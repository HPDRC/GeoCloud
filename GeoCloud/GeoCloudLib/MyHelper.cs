using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;

namespace GeoCloud.libs
{
    /// <summary>
    /// Summary description for Helper
    /// </summary>
    public static class MyHelper
    {

        public static string formatRectagleString(string latMin, string lonMin, string latMax, string lonMax)
        {
            string leftTop = lonMin + " " + latMin;
            string rightTop = lonMax + " " + latMin;
            string leftBottom = lonMin + " " + latMax;
            string rightBottom = lonMax + " " + latMax;

            return string.Join(", ", leftTop, rightTop, rightBottom, leftBottom, leftTop);
        }

        public static string CalculateMD5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            byte[] hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public static String GetTimestamp()
        {
            return DateTime.Now.ToString("yyyyMMddHHmmssffff");
        }
    }
}