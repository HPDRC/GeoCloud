using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.ProjectionHelper
{
    /// <summary>
    /// Summary description for ProjectionFactory
    /// </summary>
    public class ProjectionHandler
    {
        static ProjectionHandler()
        {
            bingProjection = new BingMapsTileSystem();
            terraflyProjection = new Terrafly();
        }

        private static BingMapsTileSystem bingProjection;
        private static Terrafly terraflyProjection;
        private static int terraflyLevelMin = 11;
        private static int terraflyLevelMax = 21;
        private static int bingLevelMin = 0;
        private static int bingLevelMax = 10;

        /// <summary>
        /// get the distance between two GDC point
        /// </summary>
        /// <param name="latitude1"></param>
        /// <param name="longitude1"></param>
        /// <param name="latitude2"></param>
        /// <param name="longitude2"></param>
        /// <param name="level"></param>
        /// <returns></returns>
        public static double getPixelDistanceByLatLng(double latitude1, double longitude1, double latitude2, double longitude2, int level)
        {
            double distance = 0;
            int pixelX1, pixelY1, pixelX2, pixelY2;

            getPixelXYByLatLong(latitude1, longitude1, level, out pixelX1, out pixelY1);
            getPixelXYByLatLong(latitude2, longitude2, level, out pixelX2, out pixelY2);

            if (pixelX1 < 0 || pixelX2 < 0)
            {
                distance = 0;
            }
            else
            {
                distance = Math.Sqrt(Math.Pow(pixelX1 - pixelX2, 2) + Math.Pow(pixelY1 - pixelY2, 2));
            }
            return distance;
        }

        /// <summary>
        /// GDC(longtitude, latitude) to pixelXY(pixelX, pixelY)
        /// </summary>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        /// <param name="level"></param>
        /// <param name="pixelX"></param>
        /// <param name="pixelY"></param>
        public static void getPixelXYByLatLong(double latitude, double longitude, int level, out int pixelX, out int pixelY)
        {
            if (level <= terraflyLevelMax && level >= terraflyLevelMin)
            {
                int utmZone;
                bool isNorth;
                terraflyProjection.latLngToPixelXY(latitude, longitude, level, out pixelX, out pixelY, out utmZone, out isNorth);
            }
            else if (level <= bingLevelMax && level >= bingLevelMin)
            {
                bingProjection.LatLongToPixelXY(latitude, longitude, level, out pixelX, out pixelY);
            }
            else
            {
                throw new Exception("The level is not valid. Make sure the level is between 0 and 21");
            }
        }

    }
}