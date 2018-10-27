using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using DBscanManaged;
using System.Collections;
using System.Text.RegularExpressions;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.Processing
{
    /// <summary>
    /// Summary description for Clustering
    /// </summary>
    public class Clustering : IProcessing
    {
        private string clusterPath = ConfigurationManager.AppSettings["clusterPath"];
        public Clustering()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public ProcessingStatus Process(List<DataInfo> lsSrcData, Hashtable htParas, out List<DataInfo> lsDstData)
        {
            lsDstData = new List<DataInfo>();
            DBscanManagedWrapper dbscanMgr = new DBscanManagedWrapper();
            long[] lsIds = new long[lsSrcData.Count];
            double[] lsLat = new double[lsSrcData.Count];
            double[] lsLon = new double[lsSrcData.Count];
            long[] lsOutIds = new long[lsSrcData.Count];
            int[] lsClusterIds = new int[lsSrcData.Count];

            Regex r = new Regex(@"(\d+\.\d+)");
            for (int i = 0; i < lsSrcData.Count; ++i)
            {
                lsIds[i] = i;
                MatchCollection matches = r.Matches(lsSrcData[i].Spatial);
                if (matches.Count == 2)
                {
                    lsLat[i] = double.Parse(matches[1].Value);
                    lsLon[i] = double.Parse(matches[0].Value);
                }
            }
            dbscanMgr.GetClusterDefaultPara(lsIds, lsLat, lsLon, lsOutIds, lsClusterIds, lsSrcData.Count);
            for (int i = 0; i < lsOutIds.Length; ++i)
            {
                long id = lsOutIds[i];
                lsSrcData[(int)id].NonSpatial["cluster_id"] = lsClusterIds[i];
                lsDstData.Add(lsSrcData[(int)id]);
            }

            return ProcessingStatus.OK;
        }

        public ProcessingStatus Process(string inputFile, string outputFile, System.Collections.Hashtable htParas)
        {
            if (htParas["a"] == null || htParas["b"] == null)
            {
                return ProcessingStatus.PARA_ERROR;
            }
            try
            {
                System.Diagnostics.Process.Start(clusterPath, inputFile + " " + outputFile + " " + htParas["a"] + " " + htParas["b"]);
            }
            catch
            {
                return ProcessingStatus.EXECUTE_ERROR;
            }
            return ProcessingStatus.OK;
        }
    }
}