using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using GeoCloud.libs.Manager;
using GeoCloud.libs;

namespace GeoCloud
{
    public partial class getjobresult : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            SqlConnection conn = null;
            System.IO.Stream istream = null;
            try
            {
                String jobKey = Request.QueryString["key"];
                if (jobKey == null)
                    throw new Exception("key is required to retrieve the job result");
                else
                    jobKey = jobKey.Trim();

                SqlParameter[] paras = new SqlParameter[]{new SqlParameter("@param0", SqlDbType.VarChar, 255)};
                paras[0].Value = jobKey;

                using (SqlDataReader rdr = SqlDbHelper.ExecuteSqlGetReader(@"select top 1 * from 
                       [dbo].[offline_jobs] where [job_key]=@param0", paras, out conn))
                {
                    rdr.Read();
                    if (!rdr.HasRows)
                    {
                        throw new Exception("job with key " + jobKey + " does not exist");
                    }

                    // check status
                    // 0 for processing, 1 for finished, -1 for failed
                    int status = Convert.ToInt32(rdr["status"]);
                    if (status == 0)
                    {
                        throw new Exception("job is still processing");
                    }
                    if (status == -1)
                    {
                        throw new Exception("job failed");
                    }

                    // check last download time, if too close, do not allow
                    if (rdr["last_download"] != DBNull.Value)
                    {
                        DateTime lastDownload = Convert.ToDateTime(rdr["last_download"]);
                        //if ((DateTime.Now - lastDownload).Seconds <= 30)
                        //{
                        //    throw new Exception("result cannot be fetched more than 1 time within 30 seconds");
                        //}
                    }

                    // job is finished, last download time is valid, allow download
                    // mark download time first
                    SqlParameter[] para2 = new SqlParameter[] { new SqlParameter("@param1", SqlDbType.VarChar, 255) };
                    para2[0].Value = jobKey;
                    SqlDbHelper.ExecuteSql(@"update [dbo].[offline_jobs] set [last_download]=GetDate() where [job_key]=@param1", para2);

                    // return the result in file
                    Response.ContentType = "application/octet-stream";
                    Response.AddHeader("Content-Disposition", "attachment;filename=\"" + jobKey + ".csv\"");
                    Response.TransmitFile(Server.MapPath("/GeoCloud/result/" + jobKey + ".csv"));
                }
            }
            catch (Exception err)
            {
                Response.ContentType = "text/xml";
                Response.Write("<error>" + err.Message + "</error>");
            }
            finally
            {
                // something to close
                if (conn != null)
                    conn.Close();

                if (istream != null)
                    istream.Close();
            }
        }
    }
}