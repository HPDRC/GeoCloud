using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.ProjectionHelper
{
    /// <summary>
    /// Summary description for GeometryHelper
    /// </summary>
    public class GeometryHelper
    {
        /// <summary>
        /// get the line length between two points
        /// </summary>
        /// <param name="p1"></param>
        /// <param name="p2"></param>
        /// <returns></returns>
        public static double getLineLength(Point p1, Point p2)
        {
            double length;
            length = Math.Pow(p1.X - p2.X, 2) + Math.Pow(p1.Y - p2.Y, 2);
            length = Math.Sqrt(length);
            return length;
        }

        /// <summary>
        /// get triangle's area Using Heron's formula
        /// </summary>
        /// <param name="p1"></param>
        /// <param name="p2"></param>
        /// <param name="p3"></param>
        /// <returns></returns>
        public static double getAreaOfTriangle(Point p1, Point p2, Point p3)
        {
            double area = 0;
            double p1p2 = getLineLength(p1, p2);
            double p2p3 = getLineLength(p2, p3);
            double p1p3 = getLineLength(p1, p3);

            double s = (p1p2 + p2p3 + p1p3) / 2;
            area = s * (s - p1p2) * (s - p2p3) * (s - p1p3);
            area = Math.Sqrt(area);

            return area;
        }

        /// <summary>
        /// get polygon's area
        /// </summary>
        /// <param name="lsPoint"></param>
        /// <returns></returns>
        public static double getAreaOfPolygon(List<Point> lsPoint)
        {
            double area = 0;
            if (lsPoint.Count < 3)
            {
                throw new Exception("Area is not available with less than 3 points");
            }

            Point p1 = lsPoint[0];
            for (int i = 1; i < lsPoint.Count - 1; ++i)
            {
                Point p2 = lsPoint[i];
                Point p3 = lsPoint[i + 1];

                // create vector
                Point vecP1P2 = new Point(p2.X - p1.X, p2.Y - p1.Y);
                Point vecP2P3 = new Point(p3.X - p2.X, p3.Y - p2.Y);

                // to judge p1-p2-p3 is clockwise or anticlockwise
                double vecMult = vecP1P2.X * vecP2P3.Y - vecP1P2.Y * vecP2P3.X;
                int sign = (int)(vecMult / Math.Abs(vecMult));

                // if p1-p2-p3 is clockwise, add the triangle's area to polygon's area. Or else, minus it from the polygon's area
                double triArea = getAreaOfTriangle(p1, p2, p3) * sign;
                area += triArea;
            }

            return area;
        }
    }

    public class Point
    {
        public Point(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

        private double x;

        public double X
        {
            get { return x; }
            set { x = value; }
        }
        private double y;

        public double Y
        {
            get { return y; }
            set { y = value; }
        }
    }
}