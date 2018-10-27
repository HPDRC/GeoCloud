using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs
{
    /// <summary>
    /// Global varibles from config file
    /// </summary>
    public class Global
    {
        private static string geoCloudConnStr = System.Configuration.ConfigurationManager.ConnectionStrings["GeoCloudConnString"].ConnectionString;

        public static string GeoCloudConnStr
        {
            get { return geoCloudConnStr; }
        }
    }
}