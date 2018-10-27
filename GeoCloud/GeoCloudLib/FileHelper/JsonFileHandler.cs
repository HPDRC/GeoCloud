using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using System.Collections;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.FileHelper
{
    public class JsonFileHandler : IFileHandler
    {
        public long WriteToFile(List<DataInfo> lsData, string fileName)
        {
            StringBuilder strJson = new StringBuilder();
            long count = 0;
            Hashtable htJson = new Hashtable();

            // add header
            htJson["type"] = "FeatureCollection";
            ArrayList lsFeature = new ArrayList();
            
            // loop all DataInfo
            foreach (DataInfo data in lsData)
            {
                Hashtable htFeature = new Hashtable();

                // add geometry info
                Hashtable htGeometry = new Hashtable();                
                strJson.Append(data.Spatial.Substring(0, data.Spatial.IndexOf(' ')));
                switch(data.Spatial.Substring(0, data.Spatial.IndexOf(' ')))
                {
                    case "POINT":
                        htGeometry["type"] = "Point";
                        break;
                    case "POLYGON":
                        htGeometry["type"] = "Polygon";
                        break;
                    case "MULTIPOLYGON":
                        htGeometry["type"] = "MultiPolygon";
                        break;
                }
                // get coordinate list
                string coordinate = data.Spatial.Substring(data.Spatial.IndexOf(' ') + 1);

                // modify all "()" to "[]"
                coordinate = coordinate.Replace('(', '[').Replace(')', ']');
                // modify coordinate format from "-113.00771307420032 44.510611946210986" to [-89.58522033691406, 39.97879409790039]
                Regex re = new Regex(@"(\-?\d+(?:\.\d+)?) (\-?\d+(?:\.\d+)?)");
                JArray jsonCoordinate = JArray.Parse(re.Replace(coordinate, "[$1, $2]"));
                htGeometry["coordinates"] = jsonCoordinate;

                htFeature["geometry"] = htGeometry;
                htFeature["type"] = "Feature";
                htFeature["properties"] = data.NonSpatial;
                htFeature["id"] = data.Id;

                lsFeature.Add(htFeature);
                
                count++;
            }
            htJson["features"] = lsFeature;
            StreamWriter writer = new StreamWriter(fileName);
            writer.WriteLine(JsonConvert.SerializeObject(htJson));
            writer.Close();

            return count;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="start">start index of record</param>
        /// <param name="count">how many records to read</param>
        /// <returns></returns>
        public List<DataInfo> ReadFromFile(string fileName, int start = 0, int count = 0)
        {
            throw new NotImplementedException();
        }
    }

    class GeoJsonFeature
    {
    }

    class GeoJson
    {

    }
}