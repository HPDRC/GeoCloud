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
    public partial class newofflinejob : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack) return;

            SqlConnection conn = null;

            try
            {
                if (Request.QueryString["method"] == null ||
                    Request.QueryString["datasetid"] == null ||
                    Request.QueryString["noclusters"] == null)
                {
                    throw new Exception("bad parameters");
                }

                String method = Request.QueryString["method"];
                int datasetId = Convert.ToInt32(Request.QueryString["datasetid"]);
                String noClusters = Request.QueryString["noclusters"];
                String jobKey = MyHelper.CalculateMD5Hash(method + datasetId + MyHelper.GetTimestamp());

                SqlParameter[] paras = new SqlParameter[]{
                    new SqlParameter("@param0", SqlDbType.VarChar, 255),
                    new SqlParameter("@param1", SqlDbType.Int, 11),
                    new SqlParameter("@param2", SqlDbType.VarChar, 50),
                    new SqlParameter("@param3", SqlDbType.VarChar, 255)
                };

                paras[0].Value = jobKey;
                paras[1].Value = datasetId;
                paras[2].Value = method;
                paras[3].Value = noClusters;

                int rowsAffected = SqlDbHelper.ExecuteSql(@"insert into [dbo].[offline_jobs] 
                                        ([job_key], [dataset_id], [analysis], [parameters], [status], [submit_time]) values 
                                        (@param0, @param1, @param2, @param3, 0, GetDate())", paras);

                if (rowsAffected > 0)
                {
                    Response.ContentType = "text/xml";
                    Response.Write("<url>http://terranode-239.cs.fiu.edu/geocloud/getjobresult.aspx?key=" + jobKey + "</url>");
                }
            }
            catch (Exception err)
            {
                Response.ContentType = "text/xml";
                Response.Write("<error>" + err.Message + "</error>");
            }
            finally
            {
                if (conn != null)
                    conn.Close();
            }
        }
    }
}