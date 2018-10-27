using System;
//using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Data.SqlTypes;
using GeoCloud.libs.Manager;
using GeoCloud.libs.Entity;
using System.Security;

namespace GeoCloud
{
    public partial class datasetlist : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsCallback)
            {
                string resXml = GenerateResponseXml();
                Response.ContentType = "text/xml";
                Response.Write(resXml);
            }
        }

        private string GenerateResponseXml()
        {
            StringBuilder strResponse = new StringBuilder();
            DataSetManager dsMgr = null;
            strResponse.Append("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>");
            strResponse.Append("<DataSets>");
            try
            {
                dsMgr = new DataSetManager();
                //get dataset list from database
                List<DataSetInfo> lsDataInfo = dsMgr.GetDataSetList();

                // generate xml string
                foreach (DataSetInfo ds in lsDataInfo)
                {
                    strResponse.Append("<DataSet>");
                    strResponse.Append("<Id>" + ds.Id + "</Id>");
                    strResponse.Append("<Name>" + SecurityElement.Escape(ds.Name) + "</Name>");
                    strResponse.Append("<Creator>" + SecurityElement.Escape(ds.Creator) + "</Creator>");
                    strResponse.Append("<Desc>" + SecurityElement.Escape(ds.Desc) + "</Desc>");
                    strResponse.Append("<PubDate>" + SecurityElement.Escape(ds.PubDate.ToShortDateString()) + "</PubDate>");
                    strResponse.Append("</DataSet>");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            strResponse.Append("</DataSets>");
            return strResponse.ToString();
        }
    }
}