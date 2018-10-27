using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.FileHelper
{
    /// <summary>
    /// import and export asc file from or to DataInfo list
    /// ASC file: one header file and one asc file
    /// the header file lists the fields names, in format of "FIELD-2	FieldName	Code of incident	T:String"
    /// fields separated by '\t', records separated by '\n'
    /// </summary>
    class AscFileHandler:IFileHandler
    {
        public long WriteToFile(List<DataInfo> lsData, string fileName)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// read DataInfo from ASC files
        /// </summary>
        /// <param name="fileName">the .asc FileName, there should be a .header file with the same name</param> 
        /// <param name="start">start index of record</param>
        /// <param name="count">how many records to read</param>
        /// <returns>list of DataInfo</returns>
        public List<DataInfo> ReadFromFile(string fileName, int start = 0, int count = 0)
        {
            List<DataInfo> lsData = new List<DataInfo>();
            int index = 0;

            // create a string buffer for reader
            string buf;

            // first we need to know the fields of the file, so read the .header file
            string headerFileName = fileName + ".header";
            StreamReader headerReader = new StreamReader(headerFileName);
            
            // get field names
            // field name line should match the rule: starting with FIELD-<Number>
            List<string> lsFields = new List<string>();
            Regex reFieldName = new Regex(@"^FIELD-\d+");
            while((buf = headerReader.ReadLine()) != null) 
            {
                // if the current line match field name rule, get the 2nd field of the line as field name
                if (reFieldName.IsMatch(buf))
                {
                    lsFields.Add(buf.Split('\t')[1]);
                }
            }
            // do not forget to close file
            headerReader.Close();

            // second, we should read the .asc file, separated by '\t' and '\n'
            StreamReader dataReader = new StreamReader(fileName);
            string[] fields;            // all fields array
            double longitude = 0, latitude = 0; // for spatial field
            while ((buf = dataReader.ReadLine()) != null)
            {
                DataInfo data = new DataInfo();
                fields = buf.Split('\t');

                // loop all fields
                for (int i = 0; i < lsFields.Count; ++i)
                {
                    // if fieldName is 'LATITUDE', add it to spatial field
                    if (lsFields[i] == "LATITUDE")
                    {
                        latitude = double.Parse(fields[i]);
                    }
                    // if fieldName is 'LONGITUDE', add it to spatial field
                    else if (lsFields[i] == "LONGITUDE")
                    {
                        longitude = double.Parse(fields[i]);
                    }
                    // other fields are property fields, add them to non-spatial data
                    else
                    {
                        data.NonSpatial[lsFields[i]] = fields[i];
                    }
                }
                // create spatial WKT if there is a longitude and a latitude
                // ignore the current line if there is no longitude or latitude
                if (longitude != 0 && latitude != 0)
                {
                    data.Spatial = "POINT (" + longitude + " " + latitude + ")";
                }
                else
                {
                    continue;
                }

                // add the DataInfo to DataInfo list
                index++;
                if (index >= start)
                {
                    if (lsData.Count < count)
                    {
                        lsData.Add(data);
                    }
                    else
                    {
                        break;
                    }
                }
            }

            return lsData;
        }
    }
}
