using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DotSpatial.Data;
using System.Data;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.FileHelper
{
    public class ShapeFileHandler: IFileHandler
    {
        public long WriteToFile(List<DataInfo> lsData, string fileName)
        {
            long count = 0;
            return count;
        }

        /// <summary>
        /// read shape file to DataInfo List
        /// </summary>
        /// <param name="fileName">file name</param>
        /// <param name="start">start index of record</param>
        /// <param name="count">how many records to read</param>
        /// <returns>DataInfo List</returns>
        public List<DataInfo> ReadFromFile(string fileName, int start = 0, int count = 0)
        {
            List<DataInfo> lsData = new List<DataInfo>();

            Shapefile fs = Shapefile.OpenFile(fileName);
            int index = 0;
            foreach (DataRow row in fs.DataTable.Rows)
            {
                DataInfo data = new DataInfo();
                data.Spatial = fs.GetShape(index, false).ToGeometry().ToString();
                foreach (DataColumn col in fs.GetColumns())
                {
                    data.NonSpatial[col.ColumnName] = row[col.ColumnName].ToString();
                }

                lsData.Add(data);
                index++;
            }
                
            return lsData;
        }
    }
}