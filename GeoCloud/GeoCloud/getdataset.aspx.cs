using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using GeoCloud.libs;
using GeoCloud.libs.Manager;
using GeoCloud.libs.Entity;
using System.Security;

namespace GeoCloud
{
    public partial class getdataset : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int dataSetId = -1;
                string latLeftTop, lonLeftTop, latRightBottom, lonRightBottom;
                int level;
                try
                {
                    latLeftTop = Request.QueryString["lat1"].ToString().Trim();
                    lonLeftTop = Request.QueryString["lon1"].ToString().Trim();
                    latRightBottom = Request.QueryString["lat2"].ToString().Trim();
                    lonRightBottom = Request.QueryString["lon2"].ToString().Trim();
                    dataSetId = int.Parse(Request.QueryString["id"].Trim());

                    if (Request.QueryString["level"] == null)
                        level = -1;
                    else
                        level = Convert.ToInt32(Request.QueryString["level"].ToString().Trim());
                }
                catch (Exception ex)
                {
                    Response.Write("parameter error!");
                    return;
                }

                string boundary = MyHelper.formatRectagleString(latLeftTop, lonLeftTop, latRightBottom, lonRightBottom);

                List<DataInfo> lsData = this.GetDataListByDataSetInfo(dataSetId, boundary, level);
                string strRes = this.GenerateResponseStr(lsData);
                Response.ContentType = "text/xml";
                Response.Write(strRes);
            }
        }

        /// <summary>
        /// get data list by datasetinfo and boundary data
        /// </summary>
        /// <param name="ds">datasetinfo</param>
        /// <param name="boundary">boudary data, null stands for all data</param>
        /// <returns>data list</returns>
        private List<DataInfo> GetDataListByDataSetInfo(int dataSetId, string boundary, int level)
        {
            List<DataInfo> lsData = null;
            DataManager dtMgr = null;
            try
            {
                dtMgr = new DataManager();
                lsData = dtMgr.GetDataListByDataSetId(dataSetId, boundary, level);
            }
            catch (Exception ex)
            {

            }
            return lsData;
        }

        private string GenerateResponseStr(List<DataInfo> lsData)
        {
            StringBuilder strResponse = new StringBuilder();
            strResponse.Append("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
            strResponse.Append("<DataSet>");
            foreach (DataInfo dt in lsData)
            {
                strResponse.Append("<Record>");
                strResponse.Append("<Id>" + dt.Id + "</Id>");
                strResponse.Append("<Spatial>" + dt.Spatial + "</Spatial>");
                foreach (string key in dt.NonSpatial.Keys)
                {
                    strResponse.Append("<" + SecurityElement.Escape(key) + ">" + SecurityElement.Escape(dt.NonSpatial[key].ToString()) + "</" + SecurityElement.Escape(key) + ">");
                }
                strResponse.Append("</Record>");
            }
            strResponse.Append("</DataSet>");
            return strResponse.ToString();
        }
    }
}