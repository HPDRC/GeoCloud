using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using GeoCloud.libs.Manager;
using GeoCloud.libs.FileHelper;
using GeoCloud.libs.Entity;

public partial class adddataset : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        
    }

    private void importDataFromFile()
    {
        StreamReader reader = new StreamReader(@"C:\inetpub\wwwroot\GeoCloud\crime_data_clusters.txt");
        string line = null;
        string[] fields = null;
        reader.ReadLine();
        string lat = null, lon = null;
        int cluster_id = 0;
        List<DataInfo> lsData = new List<DataInfo>();
        while((line = reader.ReadLine()) != null)
        {
            fields = line.Split(',');
            lat = fields[1];
            lon = fields[2];
            cluster_id = int.Parse(fields[0]);
            DataInfo dt = new DataInfo();
            dt.NonSpatial["cluster_id"] = cluster_id;
            dt.Spatial = "POINT (" + lon + " " + lat + ")";
            lsData.Add(dt);
            //Response.Write(line);
        }
        DataManager dtMgr = new DataManager();
        DataSetInfo ds = (new DataSetManager()).GetDataSetById(3);
        dtMgr.InsertDataList(lsData, ds);
    }
}