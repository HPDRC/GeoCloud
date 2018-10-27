using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Sql;
using System.Data.SqlTypes;
using System.Data.SqlClient;
using System.Text;
using GeoCloud.libs.Manager;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.Manager
{
    /// <summary>
    /// Summary description for DataSetManager
    /// </summary>
    public class DataSetManager
    {
        /// <summary>
        /// insert a data set info into database
        /// </summary>
        /// <param name="ds">the dataset info to insert</param>
        /// <returns>the effected rows number</returns>
        public int InsertDataSet(DataSetInfo ds)
        {
            int rows = 0;
            string strInsert = "INSERT INTO dataset_info([name], [creator], [desc], [pubdate], [table_name], [geo_col_name], [non_spatial_cols]) VALUES(@name, @creator, @desc, @pubdate, @table_name, @geo_col_name, @non_spatial_cols)";
            SqlParameter[] paras = new SqlParameter[]
                {
                    new SqlParameter("@name", System.Data.SqlDbType.VarChar, 100),
                    new SqlParameter("@creator", System.Data.SqlDbType.VarChar, 50),
                    new SqlParameter("@desc", System.Data.SqlDbType.VarChar, 255),
                    new SqlParameter("@pubdate", System.Data.SqlDbType.DateTime),
                    new SqlParameter("@table_name", System.Data.SqlDbType.VarChar, 50),
                    new SqlParameter("@geo_col_name", System.Data.SqlDbType.VarChar, 50),
                    new SqlParameter("@non_spatial_cols", System.Data.SqlDbType.VarChar, 500)
                };
            int index = 0;
            paras[index++].Value = ds.Name;
            paras[index++].Value = ds.Creator;
            paras[index++].Value = ds.Desc;
            paras[index++].Value = ds.PubDate;
            paras[index++].Value = ds.TableName;
            paras[index++].Value = ds.GeoColName;
            paras[index++].Value = ds.NonSpatialCols;

            try
            {
                rows += SqlDbHelper.ExecuteSql(strInsert, paras);
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }

            return rows;
        }

        /// <summary>
        /// get datasetinfo from data info and other info
        /// </summary>
        /// <param name="data">data info</param>
        /// <param name="creator">dataset creator name</param>
        /// <param name="name">dataset name</param>
        /// <param name="description">dataset description</param>
        /// <returns>dataset info</returns>
        public DataSetInfo GetDataSetInfoByData(DataInfo data, string creator, string name, string description)
        {
            DataSetInfo ds = new DataSetInfo();
            ds.Name = name;
            ds.PubDate = DateTime.Now;
            ds.TableName = ds.Name + "_" + ds.PubDate.Ticks.ToString();
            ds.GeoColName = "spatial";
            ds.Creator = creator;
            ds.Desc = description;

            // get all the non-spatial fields of data
            StringBuilder strNonSpatial = new StringBuilder();
            foreach (string field in data.NonSpatial.Keys)
            {
                strNonSpatial.Append(field);
                strNonSpatial.Append(',');
            }
            // remove the comma in the end
            strNonSpatial.Remove(strNonSpatial.Length - 1, 1);

            ds.NonSpatialCols = strNonSpatial.ToString();

            return ds;
        }

        /// <summary>
        /// get all data set
        /// </summary>
        /// <returns>all data set list</returns>
        public List<DataSetInfo> GetDataSetList()
        {
            string strSelect = "SELECT [id],[name],[creator],[desc],[pubdate],[table_name],[geo_col_name],[non_spatial_cols] FROM [geo_cloud].[dbo].[dataset_info] where [enabled]=1";
            SqlDataReader reader = null;
            SqlConnection conn = null;

            List<DataSetInfo> lsDataSet = new List<DataSetInfo>();
            try
            {
                reader = SqlDbHelper.ExecuteSqlGetReader(strSelect, null, out conn);
                if (reader != null)
                {
                    while (reader.Read())
                    {
                        lsDataSet.Add(this.GetDataSetInfoFromReader(reader));
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

            return lsDataSet;
        }

        /// <summary>
        /// get data set by id
        /// </summary>
        /// <param name="id">data set id</param>
        /// <returns>the data set with specified id</returns>
        public DataSetInfo GetDataSetById(int id)
        {
            DataSetInfo ds = null;
            string strSelect = "SELECT [id],[name],[creator],[desc],[pubdate],[table_name],[geo_col_name],[non_spatial_cols] FROM [geo_cloud].[dbo].[dataset_info] WHERE [id]=@id";
            SqlParameter[] paras = { 
                                   new SqlParameter("@id", System.Data.SqlDbType.Int)
                               };
            int index = 0;
            paras[index++].Value = id;

            SqlDataReader reader = null;
            SqlConnection conn = null;
            try
            {
                reader = SqlDbHelper.ExecuteSqlGetReader(strSelect, paras, out conn);
                if (reader != null)
                {
                    if (reader.Read())
                    {
                        ds = this.GetDataSetInfoFromReader(reader);
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

            return ds;
        }

        /// <summary>
        /// get DataSetInfo by reader
        /// </summary>
        /// <param name="reader">reader</param>
        /// <returns>the DataSetInfo from the reader</returns>
        private DataSetInfo GetDataSetInfoFromReader(SqlDataReader reader)
        {
            DataSetInfo dataSetInfo = new DataSetInfo();
            object objTmp = null;
            if (!(objTmp = reader["id"]).Equals(DBNull.Value))
            {
                dataSetInfo.Id = int.Parse(objTmp.ToString());
            }
            if (!(objTmp = reader["name"]).Equals(DBNull.Value))
            {
                dataSetInfo.Name = objTmp.ToString();
            }
            if (!(objTmp = reader["creator"]).Equals(DBNull.Value))
            {
                dataSetInfo.Creator = objTmp.ToString();
            }
            if (!(objTmp = reader["desc"]).Equals(DBNull.Value))
            {
                dataSetInfo.Desc = objTmp.ToString();
            }
            if (!(objTmp = reader["pubdate"]).Equals(DBNull.Value))
            {
                dataSetInfo.PubDate = DateTime.Parse(objTmp.ToString());
            }
            if (!(objTmp = reader["table_name"]).Equals(DBNull.Value))
            {
                dataSetInfo.TableName = objTmp.ToString();
            }
            if (!(objTmp = reader["geo_col_name"]).Equals(DBNull.Value))
            {
                dataSetInfo.GeoColName = objTmp.ToString();
            }
            if (!(objTmp = reader["non_spatial_cols"]).Equals(DBNull.Value))
            {
                dataSetInfo.NonSpatialCols = objTmp.ToString();
                if (dataSetInfo.NonSpatialCols.Contains("min_show_level"))
                    dataSetInfo.HasLevel = true;
            }

            return dataSetInfo;
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