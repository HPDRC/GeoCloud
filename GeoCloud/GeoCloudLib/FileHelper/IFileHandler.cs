using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.FileHelper
{
    /// <summary>
    /// Summary description for IFileHandler
    /// </summary>
    public interface IFileHandler
    {
        /// <summary>
        /// write the data list to file
        /// </summary>
        /// <param name="lsData">data list</param>
        /// <param name="fileName">file path</param>
        /// <returns>record number that has been written</returns>
        long WriteToFile(List<DataInfo> lsData, string fileName);

        /// <summary>
        /// get data list from file
        /// </summary>
        /// <param name="fileName">file path</param>
        /// <returns>data list</returns>
        List<DataInfo> ReadFromFile(string fileName, int start = 0, int count = 0);
    }
}