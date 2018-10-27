using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data.Sql;
using System.Data.SqlTypes;
using System.Data.SqlClient;
using GeoCloud.libs.Manager;
using GeoCloud.libs.Entity;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.Manager
{
    /// <summary>
    /// Summary description for DataManager
    /// </summary>
    public class DataManager
    {
        /// <summary>
        /// insert data list into database
        /// </summary>
        /// <param name="lsData">the data list to insert</param>
        /// <param name="ds">the dataset info of the data list</param>
        /// <returns></returns>
        public int InsertDataList(List<DataInfo> lsData, DataSetInfo ds)
        {
            int rows = 0;
            List<string> lsStrSql = new List<string>();
            List<SqlParameter[]> lsParas = new List<SqlParameter[]>();

            // format insert sql string
            string strInsert = FormatInsertSqlByDataSetInfo(ds);

            List<SqlParameter> lsPara = new List<SqlParameter>();
            // create sql parameters list
            foreach (DataInfo dt in lsData)
            {
                lsPara.Clear();
                lsPara.Add(new SqlParameter("@spatial", dt.Spatial));
                foreach (string key in dt.NonSpatial.Keys)
                {
                    lsPara.Add(new SqlParameter("@" + key, dt.NonSpatial[key]));
                }
                SqlParameter[] paras = lsPara.ToArray();

                // add sql and sql parameters to list
                lsStrSql.Add(strInsert);
                lsParas.Add(paras);
            }
            // make the spatial column valid after insert
            string sqlMakeValid = "UPDATE " + ds.TableName + " SET [spatial] = [spatial].MakeValid()";
            lsStrSql.Add(sqlMakeValid);
            lsParas.Add(null);
            // create spatial index on spatial column
            string sqlCreateIndex = "CREATE SPATIAL INDEX idx_" + ds.TableName + "_spatial ON " + ds.TableName + "(spatial) with (BOUNDING_BOX = (-180, -180, 180, 180));";
            lsStrSql.Add(sqlCreateIndex);
            lsParas.Add(null);

            try
            {
                rows = SqlDbHelper.ExecuteSqlList(lsStrSql, lsParas);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return rows;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public int CreateDataTable(DataSetInfo ds)
        {
            int rows = 0;
            List<string> lsFields = GetColumnListByDataSetInfo(ds);
            StringBuilder strCreate = new StringBuilder();
            strCreate.Append("CREATE TABLE ");
            strCreate.Append(ds.TableName);
            strCreate.Append(" ([id] [int] IDENTITY(1,1) PRIMARY KEY, [spatial] [geometry] NULL,");
            foreach (string field in lsFields)
            {
                strCreate.Append(field);
                strCreate.Append(" varchar(1000),");
            }
            strCreate.Remove(strCreate.Length - 1, 1);
            strCreate.Append(")");
            try
            {
                rows = SqlDbHelper.ExecuteSql(strCreate.ToString(), null);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return rows;
        }

        /// <summary>
        /// format insert sql by dataset info
        /// </summary>
        /// <param name="ds">the dataset to insert</param>
        /// <returns>insert sql</returns>
        private string FormatInsertSqlByDataSetInfo(DataSetInfo ds)
        {
            string strInsert = "";
            List<string> lsCol = this.GetColumnListByDataSetInfo(ds);
            StringBuilder strCol = new StringBuilder(), strColValue = new StringBuilder();
            strCol.Append("spatial");
            strColValue.Append("geometry::STGeomFromText(@spatial, 4326)");
            foreach (string col in lsCol)
            {
                strColValue.Append(",");
                strCol.Append(",");

                strCol.Append(col);
                strColValue.Append("@" + col);
            }

            strInsert = "INSERT INTO " + ds.TableName + "(" + strCol + ") VALUES (" + strColValue + ")";
            return strInsert;
        }

        /// <summary>
        /// get column list of the data table by dataset info
        /// </summary>
        /// <param name="ds">dataset info</param>
        /// <returns>column list</returns>
        private List<string> GetColumnListByDataSetInfo(DataSetInfo ds)
        {
            List<string> cols = new List<string>();
            //cols.Add(ds.GeoColName);
            foreach (string col in ds.NonSpatialCols.Split(','))
            {
                cols.Add(col);
            }
            return cols;
        }

        /// <summary>
        /// format select sql through dataset info and boundary info
        /// </summary>
        /// <param name="ds">dataset info</param>
        /// <param name="boundary">boundary string</param>
        /// <returns>select sql</returns>
        private string GetSelectStrByDataSetInfo(DataSetInfo ds, string boundary, int level=-1)
        {
            StringBuilder strSelect = new StringBuilder();
            strSelect.Append("SELECT id,");
            strSelect.Append(ds.GeoColName + ".STAsText() spatial,");
            strSelect.Append(ds.NonSpatialCols);
            strSelect.Append(" FROM ");
            strSelect.Append(ds.TableName);

            // if boundary is not null, add where clause
            if (boundary != null)
            {
                strSelect.Append(" WHERE " + ds.GeoColName + ".STIntersects(geometry::STPolyFromText('POLYGON((" + boundary + "))', 4326)) = 1");
            }

            if (ds.HasLevel && level != -1)
            {
                strSelect.Append(" AND [min_show_level] <= " + level.ToString());
            }

            strSelect.Append(" ORDER BY [id]");

            return strSelect.ToString();
        }

        /// <summary>
        /// get data list by dataset info and boundary
        /// </summary>
        /// <param name="ds">data set info</param>
        /// <param name="boundary">boundary string</param>
        /// <returns>data list</returns>
        public List<DataInfo> GetDataListByDataSetInfo(DataSetInfo ds, string boundary, int level)
        {
            List<DataInfo> lsData = new List<DataInfo>();
            List<string> lsCol = this.GetColumnListByDataSetInfo(ds);
            string strSelect = GetSelectStrByDataSetInfo(ds, boundary, level);
            SqlDataReader reader = null;
            SqlConnection conn = null;
            try
            {
                reader = SqlDbHelper.ExecuteSqlGetReader(strSelect, null, out conn);
                if (reader != null)
                {
                    while (reader.Read())
                    {
                        lsData.Add(GetDataInfoByReader(reader, lsCol));
                    }
                }
            }
            catch (Exception ex)
            {
                this.HandleException(ex);
            }
            finally
            {
                if (!reader.IsClosed)
                {
                    reader.Close();
                }

                if (conn != null && conn.State == System.Data.ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return lsData;
        }


        /// <summary>
        /// get data list by dataset id and boundary info
        /// </summary>
        /// <param name="id"></param>
        /// <param name="boundary"></param>
        /// <returns></returns>
        public List<DataInfo> GetDataListByDataSetId(int id, string boundary, int level=-1)
        {
            List<DataInfo> lsData = new List<DataInfo>();
            DataSetManager dsMgr = null;
            DataSetInfo ds = null;

            // get datasetinfo by dataset id
            try
            {
                dsMgr = new DataSetManager();
                ds = dsMgr.GetDataSetById(id);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            // if datasetinfo is null, return empty data list
            if (ds == null)
            {
                return lsData;
            }

            // if datasetinfo is not null, get data list
            return this.GetDataListByDataSetInfo(ds, boundary, level);
        }


        /// <summary>
        /// get datainfo from a datareader and field list
        /// </summary>
        /// <param name="reader">data reader</param>
        /// <param name="lsCol">field list</param>
        /// <returns>data info from current reader</returns>
        private DataInfo GetDataInfoByReader(SqlDataReader reader, List<string> lsCol)
        {
            DataInfo data = new DataInfo();
            object objTmp = new object();
            if (!(objTmp = reader["id"]).Equals(DBNull.Value))
            {
                data.Id = long.Parse(objTmp.ToString());
            }
            if (!(objTmp = reader["spatial"]).Equals(DBNull.Value))
            {
                data.Spatial = objTmp.ToString();
            }
            foreach (string col in lsCol)
            {
                if (!(objTmp = reader[col]).Equals(DBNull.Value))
                {
                    data.NonSpatial[col] = objTmp.ToString();
                }
                else
                {
                    data.NonSpatial[col] = "";
                }
            }
            return data;
        }

        /// <summary>
        /// Handle exception 
        /// </summary>
        /// <param name="ex">the exception to handle</param>
        private void HandleException(Exception ex)
        {
            throw ex;
        }
    }
}