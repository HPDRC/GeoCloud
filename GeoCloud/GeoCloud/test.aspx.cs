using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Net;
using GeoCloud.libs.Manager;
using GeoCloud.libs.FileHelper;
using GeoCloud.libs.Entity;
using GeoCloud.libs.Manager;
using System.Text;

namespace GeoCloud
{
    public partial class test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            readAscFile();
        }

        private void testJsonFile()
        {
            string dataDir = "data";
            //string fileName = dataDir + "\\test.json";
            string fileName = Server.MapPath(dataDir) + "\\test.json";
            DataManager dm = new DataManager();
            List<DataInfo> lsData = dm.GetDataListByDataSetId(20, null);
            FileHandlerFactory.getFileHandler(FileType.FILETYPE_JSON).WriteToFile(lsData, fileName);

            StreamReader reader = new StreamReader(fileName);
            string content = reader.ReadToEnd();
            content = "geodata=" + Server.UrlEncode(content) + "&vcol=MED_AGE";
            reader.Close(); 
            byte[] byteArray = Encoding.UTF8.GetBytes(content);
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create("http://131.94.133.223/py_scripts/auto_corre_cgi.py");
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded";
            using (Stream dataStream = req.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
            }
            HttpWebResponse res = (HttpWebResponse)req.GetResponse();
            string result;
            using (StreamReader r = new StreamReader(res.GetResponseStream()))
            {
                result = r.ReadToEnd();
            }
        }

        private void readAscFile()
        {
            string dataDir = "upload";
            string fileName = Server.MapPath(dataDir) + "\\crime_mb.asc";

            List<DataInfo> lsData = FileHandlerFactory.getFileHandler(FileType.FILETYPE_ASC).ReadFromFile(fileName, 0, 10000);
            if (lsData.Count > 0)
            {
                DataSetManager dsMgr = new DataSetManager();
                DataSetInfo ds = dsMgr.GetDataSetInfoByData(lsData[0], "Jin", "crime_mb_test", "test");
                dsMgr.InsertDataSet(ds);
                DataManager dataMgr = new DataManager();
                dataMgr.CreateDataTable(ds);
                dataMgr.InsertDataList(lsData, ds);
            }
        }
    }
}