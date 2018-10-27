using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.FileHelper
{
    /// <summary>
    /// Summary description for DefaultFileHandler, fields delimitor is '|', row delimitor is '\r\n'
    /// </summary>
    public class DefaultFileHandler : IFileHandler
    {
        public DefaultFileHandler()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        /// <summary>
        /// write the data list to file
        /// </summary>
        /// <param name="lsData">data list</param>
        /// <param name="fileName">file path</param>
        /// <returns>record number that has been written</returns>
        public long WriteToFile(List<DataInfo> lsData, string fileName)
        {
            DataInfo smplDt = lsData[0];
            List<string> lsField = new List<string>();
            long count = 0;

            // get all field names
            foreach (string key in smplDt.NonSpatial.Keys)
            {
                lsField.Add(key);
            }

            // open file
            StreamWriter writer = new StreamWriter(fileName);

            // write field name to file
            writer.Write("spatial|id");
            foreach (string field in lsField)
            {
                writer.Write("|");
                writer.Write(field);
            }
            writer.WriteLine();

            // write all data to file        
            foreach (DataInfo dt in lsData)
            {
                writer.Write(dt.Spatial);
                writer.Write("|");
                writer.Write(dt.Id);
                foreach (string field in lsField)
                {
                    writer.Write("|");
                    writer.Write(dt.NonSpatial[field]);
                }
                writer.WriteLine();
                count++;
            }

            // close file and return result
            writer.Close();
            return count;
        }

        /// <summary>
        /// read DataInfo from default file type
        /// </summary>
        /// <param name="fileName">file name</param>
        /// <param name="start">start index of record</param>
        /// <param name="count">how many records to read</param>
        /// <returns>list of DataInfo</returns>
        public List<DataInfo> ReadFromFile(string fileName, int start = 0, int count = 0)
        {
            List<DataInfo> lsData = new List<DataInfo>();
            StreamReader reader = new StreamReader(fileName);
            string line = null;

            // get the first line for field names
            line = reader.ReadLine();
            if (line == null)
            {
                return lsData;
            }
            string[] lsFields = line.Split('|');
            string[] lsValues = null;

            // get all lines for data list
            while ((line = reader.ReadLine()) != null)
            {
                DataInfo dt = new DataInfo();
                lsValues = line.Split('|');
                try
                {
                    // get value of each field
                    for (int i = 0; i < lsFields.Length; ++i)
                    {
                        string field = lsFields[i].Trim().ToLower();

                        switch (field)
                        {
                            case "id":
                                dt.Id = long.Parse(lsValues[i].Trim());
                                break;
                            case "spatial":
                                dt.Spatial = lsValues[i].Trim();
                                break;
                            default:
                                if (lsValues.Length <= i)
                                {
                                    dt.NonSpatial[field] = "";
                                }
                                else
                                {
                                    dt.NonSpatial[field] = lsValues[i].Trim();
                                }
                                break;
                        }
                    }
                }
                catch
                {
                    continue;
                }
                lsData.Add(dt);
            }

            return lsData;
        }
    }
}