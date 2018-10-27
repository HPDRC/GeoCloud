using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.ProjectionHelper
{
    /// <summary>
    /// Summary description for Terrafly
    /// </summary>
    public class Terrafly
    {
        private const double RadiansPerDegree = 0.0174532925199432957692;
        private const double DegreesPerRadian = 57.2957795130823208768;
        private const double CScale = 0.9996;
        private double[] visualResolutionList = { 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, 76.8, 38.4, 19.2, 9.6, 4.8, 2.4, 1.2, 0.6, 0.3, 0.15, 0.075 };

        /// <summary>
        /// UTMPixelXY(pixelX, pixelY, utmZone, isNorth) to GDC(longitude, latitude)
        /// </summary>
        /// <param name="pixelX"></param>
        /// <param name="pixelY"></param>
        /// <param name="utmZone"></param>
        /// <param name="isNorth"></param>
        /// <param name="level"></param>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        public void pixelXYToLatLng(int pixelX, int pixelY, int utmZone, bool isNorth, int level, out double latitude, out double longitude)
        {
            double res = visualResolutionList[level];
            double x = pixelX * res;
            double y = pixelY * res;
            UtmToGdc(x, y, utmZone, isNorth, out latitude, out longitude);
        }

        /// <summary>
        /// GDC(longitude, latitude) to UTMPixelXY(pixelX, pixelY, utmZone, isNorth)
        /// </summary>
        /// <param name="latitude"></param>
        /// <param name="longitude"></param>
        /// <param name="level"></param>
        /// <param name="pixelX"></param>
        /// <param name="pixelY"></param>
        /// <param name="utmZone"></param>
        /// <param name="isNorth"></param>
        public void latLngToPixelXY(double latitude, double longitude, int level, out int pixelX, out int pixelY, out int utmZone, out bool isNorth)
        {
            double res = visualResolutionList[level];
            double X, Y;
            GdcToUtm(latitude, longitude, out X, out Y, out utmZone, out isNorth);
            pixelX = (int)(X / res);
            pixelY = (int)(Y / res);
        }

        /// <summary>
        /// GDC(longitude, latitude) to UTM(x, y, zone, isNorth)
        /// </summary>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="zone"></param>
        /// <param name="isNorth"></param>
        public void GdcToUtm(double latitude, double longitude, out double x, out double y, out int zone, out bool isNorth)
        {
            double A = 0;
            double F = 0;
            double C = 0;

            double Eps2 = 0;
            double Eps25 = 0;
            double Epps2 = 0;
            double EF = 0;
            double Epsp2 = 0;

            double polx2b = 0;
            double polx3b = 0;
            double polx4b = 0;
            double polx5b = 0;

            double poly1b = 0;
            double poly2b = 0;
            double poly3b = 0;
            double poly4b = 0;
            double poly5b = 0;

            double Con = 0;
            double Con2 = 0;
            double Con6 = 0;
            double Con24 = 0;
            double Con120 = 0;
            double Con720 = 0;

            double conap = 0;

            double source_lat, source_lon, s1, c1, tx, s12, rn, axlon0, al, al2, sm, tn2, cee, poly1, poly2;

            double polx1a_i, polx2a_i, polx4a_i, polx6a_i, polx8a_i;
            double polx2b_i, polx3b_i, polx4b_i, polx5b_i;

            A = 6378137;
            F = 298.257223563;

            //  Create the ERM constants.    
            F = 1 / (F);
            C = (A) * (1 - F);
            Eps2 = (F) * (2.0 - F);
            Eps25 = 0.25 * (Eps2);
            Epps2 = (Eps2) / (1.0 - Eps2);
            EF = F / (2.0 - F);

            Con = (1.0 - Eps2);
            Con2 = 2 / (1.0 - Eps2);
            Con6 = 0.166666666666667;
            Con24 = 4 * .0416666666666667 / (1 - Eps2);
            Con120 = 0.00833333333333333;
            Con720 = 4 * 0.00138888888888888 / (1 - Eps2);

            polx2b_i = 1.0 * Eps2 + 1.0 / 4.0 * Math.Pow(Eps2, 2) + 15.0 / 128.0 * Math.Pow(Eps2, 3) - 455.0 / 4096.0 * Math.Pow(Eps2, 4);
            polx2b_i = 3.0 / 8.0 * polx2b_i;

            polx3b_i = 1.0 * Math.Pow(Eps2, 2) + 3.0 / 4.0 * Math.Pow(Eps2, 3) - 77.0 / 128.0 * Math.Pow(Eps2, 4);
            polx3b_i = 15.0 / 256.0 * polx3b_i;

            polx4b_i = Math.Pow(Eps2, 3) - 41.0 / 32.0 * Math.Pow(Eps2, 4);
            polx4b_i = polx4b_i * 35.0 / 3072.0;

            polx5b_i = -315.0 / 131072.0 * Math.Pow(Eps2, 4);

            poly1b = 1.0 - (1.0 / 4.0 * Eps2) - (3.0 / 64.0 * Math.Pow(Eps2, 2)) - (5.0 / 256.0 * Math.Pow(Eps2, 3)) - (175.0 / 16384.0 * Math.Pow(Eps2, 4));
            poly2b = polx2b_i * -2.0 + polx3b_i * 4.0 - polx4b_i * 6.0 + polx5b_i * 8.0;
            poly3b = polx3b_i * -8.0 + polx4b_i * 32.0 - polx5b_i * 80.0;
            poly4b = polx4b_i * -32.0 + polx5b_i * 192.0;
            poly5b = polx5b_i * -128.0;

            polx1a_i = 1.0 - Eps2 / 4.0 - 3.0 / 64.0 * Math.Pow(Eps2, 2) - 5.0 / 256.0 * Math.Pow(Eps2, 3) - 175.0 / 16384.0 * Math.Pow(Eps2, 4);
            polx2a_i = 3.0 / 2.0 * EF - 27.0 / 32.0 * Math.Pow(EF, 3);
            polx4a_i = 21.0 / 16.0 * Math.Pow(EF, 2) - 55.0 / 32.0 * Math.Pow(EF, 4);
            polx6a_i = 151.0 / 96.0 * Math.Pow(EF, 3);
            polx8a_i = 1097.0 / 512.0 * Math.Pow(EF, 4);

            conap = A * polx1a_i;

            polx2b = polx2a_i * 2.0 + polx4a_i * 4.0 + polx6a_i * 6.0 + polx8a_i * 8.0;
            polx3b = polx4a_i * -8.0 - polx6a_i * 32.0 - 80.0 * polx8a_i;
            polx4b = polx6a_i * 32.0 + 192.0 * polx8a_i;


            if (latitude < 0)
                isNorth = false;
            else
                isNorth = true;

            source_lat = latitude * RadiansPerDegree;
            source_lon = longitude * RadiansPerDegree;

            s1 = Math.Sin(source_lat);
            c1 = Math.Cos(source_lat);
            tx = s1 / c1;
            s12 = s1 * s1;

            /* USE IN-LINE SQUARE ROOT */
            rn = A / ((0.25 - Eps25 * s12 + .9999944354799 / 4) + (0.25 - Eps25 * s12) / (0.25 - Eps25 * s12 + 0.9999944354799 / 4));
            /* COMPUTE UTM COORDINATES */
            /* Compute Zone */
            zone = (int)(source_lon * 30.0 / 3.1415926 + 31);

            if (zone <= 0)
                zone = 1;
            else if (zone >= 61)
                zone = 60;

            axlon0 = (zone * 6 - 183) * RadiansPerDegree;
            al = (source_lon - axlon0) * c1;
            sm = s1 * c1 * (poly2b + s12 * (poly3b + s12 * (poly4b + s12 * poly5b)));
            sm = A * (poly1b * source_lat + sm);

            tn2 = tx * tx;
            cee = Epps2 * c1 * c1;
            al2 = al * al;
            poly1 = 1.0 - tn2 + cee;
            poly2 = 5.0 + tn2 * (tn2 - 18.0) + cee * (14.0 - tn2 * 58.0);

            /* COMPUTE EASTING */

            x = CScale * rn * al * (1.0 + al2 * (0.166666666666667 * poly1 + 0.00833333333333333 * al2 * poly2));
            x += 5.0E5;

            /* COMPUTE NORTHING */

            poly1 = 5.0 - tn2 + cee * (cee * 4.0 + 9.0);
            poly2 = 61.0 + tn2 * (tn2 - 58.0) + cee * (270.0 - tn2 * 330.0);

            y = CScale * (sm + rn * tx * al2 * (0.5 + al2 * (0.0416666666666667 * poly1 + 0.00138888888888888 * al2 * poly2)));

            if (source_lat < 0.0)
                y += 1.0E7;
        }

        /// <summary>
        /// UTM(x, y, zone, isNorth) to GDC(longitude, latitude)
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="zone"></param>
        /// <param name="isNorth"></param>
        /// <param name="longitude"></param>
        /// <param name="latitude"></param>
        public void UtmToGdc(double x, double y, int zone, bool isNorth, out double latitude, out double longitude)
        {
            double A = 0;
            double F = 0;
            double C = 0;

            double Eps2 = 0;
            double Eps25 = 0;
            double Epps2 = 0;
            double EF = 0;
            double Epsp2 = 0;

            double polx2b = 0;
            double polx3b = 0;
            double polx4b = 0;
            double polx5b = 0;

            double poly1b = 0;
            double poly2b = 0;
            double poly3b = 0;
            double poly4b = 0;
            double poly5b = 0;

            double Con = 0;
            double Con2 = 0;
            double Con6 = 0;
            double Con24 = 0;
            double Con120 = 0;
            double Con720 = 0;

            double conap = 0;
            bool hemisphere_north = isNorth;
            // Create all ERM constants firstly  
            double polx1a_i, polx2a_i, polx4a_i, polx6a_i, polx8a_i;
            double polx2b_i, polx3b_i, polx4b_i, polx5b_i;

            A = 6378137;
            F = 298.257223563;

            //  Create the ERM constants.    
            F = 1 / (F);
            C = (A) * (1 - F);
            Eps2 = (F) * (2.0 - F);
            Eps25 = 0.25 * (Eps2);
            Epps2 = (Eps2) / (1.0 - Eps2);
            EF = F / (2.0 - F);

            Con = (1.0 - Eps2);
            Con2 = 2 / (1.0 - Eps2);
            Con6 = 0.166666666666667;
            Con24 = 4 * .0416666666666667 / (1 - Eps2);
            Con120 = 0.00833333333333333;
            Con720 = 4 * 0.00138888888888888 / (1 - Eps2);

            polx2b_i = 1.0 * Eps2 + 1.0 / 4.0 * Math.Pow(Eps2, 2) + 15.0 / 128.0 * Math.Pow(Eps2, 3) - 455.0 / 4096.0 * Math.Pow(Eps2, 4);
            polx2b_i = 3.0 / 8.0 * polx2b_i;

            polx3b_i = 1.0 * Math.Pow(Eps2, 2) + 3.0 / 4.0 * Math.Pow(Eps2, 3) - 77.0 / 128.0 * Math.Pow(Eps2, 4);
            polx3b_i = 15.0 / 256.0 * polx3b_i;

            polx4b_i = Math.Pow(Eps2, 3) - 41.0 / 32.0 * Math.Pow(Eps2, 4);
            polx4b_i = polx4b_i * 35.0 / 3072.0;

            polx5b_i = -315.0 / 131072.0 * Math.Pow(Eps2, 4);

            poly1b = 1.0 - (1.0 / 4.0 * Eps2) - (3.0 / 64.0 * Math.Pow(Eps2, 2)) - (5.0 / 256.0 * Math.Pow(Eps2, 3)) - (175.0 / 16384.0 * Math.Pow(Eps2, 4));
            poly2b = polx2b_i * -2.0 + polx3b_i * 4.0 - polx4b_i * 6.0 + polx5b_i * 8.0;
            poly3b = polx3b_i * -8.0 + polx4b_i * 32.0 - polx5b_i * 80.0;
            poly4b = polx4b_i * -32.0 + polx5b_i * 192.0;
            poly5b = polx5b_i * -128.0;

            polx1a_i = 1.0 - Eps2 / 4.0 - 3.0 / 64.0 * Math.Pow(Eps2, 2) - 5.0 / 256.0 * Math.Pow(Eps2, 3) - 175.0 / 16384.0 * Math.Pow(Eps2, 4);
            polx2a_i = 3.0 / 2.0 * EF - 27.0 / 32.0 * Math.Pow(EF, 3);
            polx4a_i = 21.0 / 16.0 * Math.Pow(EF, 2) - 55.0 / 32.0 * Math.Pow(EF, 4);
            polx6a_i = 151.0 / 96.0 * Math.Pow(EF, 3);
            polx8a_i = 1097.0 / 512.0 * Math.Pow(EF, 4);

            conap = A * polx1a_i;

            polx2b = polx2a_i * 2.0 + polx4a_i * 4.0 + polx6a_i * 6.0 + polx8a_i * 8.0;
            polx3b = polx4a_i * -8.0 - polx6a_i * 32.0 - 80.0 * polx8a_i;
            polx4b = polx6a_i * 32.0 + 192.0 * polx8a_i;
            polx5b = -128.0 * polx8a_i;

            double source_x, source_y, u, su, cu, su2, xlon0, temp, phi1, sp, sp2, cp, cp2, tp, tp2, eta2, top, rn, b3, b4, b5, b6, d1, d2;

            source_x = x;
            source_x = (source_x - 500000.0) / 0.9996;

            if (hemisphere_north == true)
                source_y = y / 0.9996;
            else
                source_y = (y - 1.0E7) / 0.9996;

            u = source_y / conap;

            /* TEST U TO SEE IF AT POLES */
            su = Math.Sin(u);
            cu = Math.Cos(u);
            su2 = su * su;

            /* THE SNYDER FORMULA FOR PHI1 IS OF THE FORM
            PHI1=U+POLY2A*Sin(2U)+POLY3A*Sin(4U)+POLY4ASin(6U)+...
            BY USinG MULTIPLE ANGLE TRIGONOMETRIC IDENTITIES AND APPROPRIATE FACTORING JUST THE SinE AND CosinE ARE REQUIRED NOW READY TO GET PHI1
            */

            xlon0 = (6.0 * (zone) - 183.0) / DegreesPerRadian;

            temp = polx2b + su2 * (polx3b + su2 * (polx4b + su2 * polx5b));

            phi1 = u + su * cu * temp;

            /* COMPUTE VARIABLE COEFFICIENTS FOR FINAL RESULT COMPUTE THE VARIABLE COEFFICIENTS OF THE LAT AND LON EXPANSIONS */
            sp = Math.Sin(phi1);
            cp = Math.Cos(phi1);

            tp = sp / cp;
            tp2 = tp * tp;
            sp2 = sp * sp;
            cp2 = cp * cp;
            eta2 = Epsp2 * cp2;

            top = 0.25 - (sp2 * (Eps2 / 4));

            /* inline sq root*/
            rn = A / ((0.25 - Eps25 * sp2 + 0.9999944354799 / 4) +
            (0.25 - Eps25 * sp2) / (0.25 - Eps25 * sp2 + 0.9999944354799 / 4));

            b3 = 1.0 + tp2 + tp2 + eta2;
            b4 = 5 + tp2 * (3 - 9 * eta2) + eta2 * (1 - 4 * eta2);

            b5 = 5 + tp2 * (tp2 * 24.0 + 28.0);
            b5 += eta2 * (tp2 * 8.0 + 6.0);

            b6 = 46.0 - 3.0 * eta2 + tp2 * (-252.0 - tp2 * 90.0);
            b6 = eta2 * (b6 + eta2 * tp2 * (tp2 * 225.0 - 66.0));
            b6 += 61.0 + tp2 * (tp2 * 45.0 + 90.0);

            d1 = source_x / rn;
            d2 = d1 * d1;

            latitude = phi1 - tp * top * (d2 * (Con2 + d2 * ((-Con24) * b4 + d2 * Con720 * b6)));
            longitude = xlon0 + d1 * (1.0 + d2 * (-Con6 * b3 + d2 * Con120 * b5)) / cp;

            /* TRANSVERSE MERCATOR COMPUTATIONS DONE */
            latitude = latitude * DegreesPerRadian;
            longitude = longitude * DegreesPerRadian;
        }
    }
}