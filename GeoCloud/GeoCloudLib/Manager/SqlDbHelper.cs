using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Data.SqlTypes;

namespace GeoCloud.libs.Manager
{
    /// <summary>
    /// some common functions of database operation
    /// </summary>
    public class SqlDbHelper
    {
        /// <summary>
        /// get sql server connection
        /// </summary>
        /// <returns>sql server connection</returns>
        public static SqlConnection GetConnection()
        {
            return new SqlConnection(Global.GeoCloudConnStr);
        }

        /// <summary>
        /// execute a sql and get data reader
        /// </summary>
        /// <param name="strSelect">the sql to execute</param>
        /// <param name="paras">parameters to the sql</param>
        /// <returns>data reader</returns>
        public static SqlDataReader ExecuteSqlGetReader(string strSelect, SqlParameter[] paras)
        {
            SqlDataReader reader = null;
            SqlConnection conn = SqlDbHelper.GetConnection();
            SqlCommand comm = new SqlCommand(strSelect, conn);

            // add parameters to sql command
            if (paras != null)
            {
                foreach (SqlParameter para in paras)
                {
                    comm.Parameters.Add(para);
                }
            }

            // execute sql and get a reader
            try
            {
                if (conn.State != System.Data.ConnectionState.Open)
                {
                    conn.Open();
                }
                reader = comm.ExecuteReader();
            }
            catch (Exception ex)
            {
                HandleException(ex);
                conn.Close();
            }

            return reader;
        }

        /// <summary>
        /// Execute sql get reader, and pass sqlconnection out to Close
        /// </summary>
        /// <param name="strSelect"></param>
        /// <param name="paras"></param>
        /// <param name="conn"></param>
        /// <returns></returns>
        public static SqlDataReader ExecuteSqlGetReader(string strSelect, SqlParameter[] paras, out SqlConnection conn)
        {
            SqlDataReader reader = null;
            conn = SqlDbHelper.GetConnection();
            SqlCommand comm = new SqlCommand(strSelect, conn);

            // add parameters to sql command
            if (paras != null)
            {
                foreach (SqlParameter para in paras)
                {
                    comm.Parameters.Add(para);
                }
            }

            // execute sql and get a reader
            try
            {
                if (conn.State != System.Data.ConnectionState.Open)
                {
                    conn.Open();
                }
                reader = comm.ExecuteReader();
            }
            catch (Exception ex)
            {
                if (conn.State == System.Data.ConnectionState.Open)
                {
                    conn.Close();
                }
                HandleException(ex);
            }

            return reader;
        }

        /// <summary>
        /// execute a sql with parameters
        /// </summary>
        /// <param name="strSql">the sql to execute</param>
        /// <param name="paras">parameter list</param>
        /// <returns>the effected rows number</returns>
        public static int ExecuteSql(string strSql, SqlParameter[] paras)
        {
            int rows = 0;
            SqlConnection conn = SqlDbHelper.GetConnection();
            SqlCommand comm = new SqlCommand(strSql, conn);

            // add parameters to sql command
            if (paras != null)
            {
                foreach (SqlParameter para in paras)
                {
                    comm.Parameters.Add(para);
                }
            }

            // execute sql and get a reader
            try
            {
                if (conn.State != System.Data.ConnectionState.Open)
                {
                    conn.Open();
                }
                rows = comm.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                HandleException(ex);
            }
            finally
            {
                conn.Close();
            }
            return rows;
        }

        /// <summary>
        /// execute a list of sql with parameters
        /// </summary>
        /// <param name="lsStrSql">the sql list to execute</param>
        /// <param name="lsParas">the parameters for sqls</param>
        /// <returns>the effected row number</returns>
        public static int ExecuteSqlList(List<string> lsStrSql, List<SqlParameter[]> lsParas)
        {
            int rows = 0;

            SqlConnection conn = SqlDbHelper.GetConnection();
            SqlTransaction trans = null;
            SqlCommand comm = new SqlCommand();

            try
            {
                // open database connection
                conn.Open();
                // create sql server transaction, roll back, if a sql fails
                trans = conn.BeginTransaction();
                comm.Connection = conn;
                comm.Transaction = trans;

                // execute each sql with parameters
                for (int i = 0; i < lsStrSql.Count; ++i)
                {
                    comm.CommandText = lsStrSql[i];
                    comm.Parameters.Clear();
                    if (lsParas[i] != null)
                    {
                        foreach (SqlParameter para in lsParas[i])
                        {
                            comm.Parameters.Add(para);
                        }
                    }
                    rows += comm.ExecuteNonQuery();
                }

                // commit transcation when finish all sql
                trans.Commit();
            }
            catch (Exception ex)
            {
                // roll back if transaction begins and fails
                if (trans != null)
                {
                    trans.Rollback();
                }
                HandleException(ex);
            }
            finally
            {
                comm.Dispose();
                conn.Close();
            }
            return rows;
        }

        /// <summary>
        /// to handle the exception
        /// </summary>
        /// <param name="ex">the exception to handle</param>
        private static void HandleException(Exception ex)
        {
            throw ex;
        }
    }
}