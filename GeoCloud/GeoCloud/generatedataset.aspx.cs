using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using GeoCloud.libs.Processing;
using GeoCloud.libs.Manager;
using GeoCloud.libs.Entity;

namespace GeoCloud
{
    public partial class generatedataset : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                int orginalDataSetId = -1;
                string processMethodName = "";
                DataSetInfo dsInfo = new DataSetInfo();
                Hashtable htParas = new Hashtable();

                // get all parameters
                foreach (string paraName in Request.QueryString.Keys)
                {
                    // if value of the parameter is not null or ""
                    if (Request.QueryString[paraName] != null && Request.QueryString[paraName].Trim() != "")
                    {
                        if (paraName.ToLower() == "id")     // get original dataset id
                        {
                            orginalDataSetId = int.Parse(Request.QueryString[paraName].Trim());
                        }
                        else if (paraName.ToLower() == "methodname")    // get dataset processing method name
                        {
                            processMethodName = Request.QueryString[paraName].Trim();
                        }
                        else if (paraName.ToLower() == "targetname")
                        {
                            dsInfo.Name = Request.QueryString[paraName].Trim();
                        }
                        else    // get other parameters
                        {
                            htParas[paraName] = Request.QueryString[paraName].Trim();
                        }
                    }
                }

                List<DataInfo> lsData = this.GetDataListByDataSetInfo(orginalDataSetId, null);
                if (lsData.Count < 1)
                {
                    Response.Write("no data!");
                    return;
                }
                List<DataInfo> lsDstData = null;
                ProcessingFactory.GetProcessingMethod(ProcessingMethod.CLUSTERING).Process(lsData, htParas, out lsDstData);
                DataSetManager dsMgr = new DataSetManager();
                DataSetInfo ds = dsMgr.GetDataSetInfoByData(lsDstData[0], "Jin Lu", dsInfo.Name, "test clustering");
                dsMgr.InsertDataSet(ds);

                DataManager dtMgr = new DataManager();
                dtMgr.CreateDataTable(ds);
                dtMgr.InsertDataList(lsDstData, ds);
            }
        }

        private int doCluster(string input, string output, Hashtable htParas)
        {
            try
            {
                System.Diagnostics.Process.Start("c:\\Jason\\dbscan_cluster.exe", input + " " + output + " " + htParas["a"] + " " + htParas["b"]);
            }
            catch (Exception ex)
            {
                return -1;
            }
            return 0;
        }

        /// <summary>
        /// get data list by datasetinfo and boundary data
        /// </summary>
        /// <param name="ds">datasetinfo</param>
        /// <param name="boundary">boudary data, null stands for all data</param>
        /// <returns>data list</returns>
        private List<DataInfo> GetDataListByDataSetInfo(int dataSetId, string boundary)
        {
            List<DataInfo> lsData = null;
            DataManager dtMgr = null;
            try
            {
                dtMgr = new DataManager();
                lsData = dtMgr.GetDataListByDataSetId(dataSetId, boundary);
            }
            catch (Exception ex)
            {

            }
            return lsData;
        }
    }
}