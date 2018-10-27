using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.Entity
{
    /// <summary>
    /// Summary description for DataInfo
    /// </summary>
    public class DataInfo
    {
        /// <summary>
        /// constructor
        /// </summary>
        public DataInfo()
        {
            this.nonSpatial = new Hashtable();
        }

        private long id;
        private string spatial;
        private Hashtable nonSpatial;

        public long Id
        {
            get { return this.id; }
            set { this.id = value; }
        }

        public string Spatial
        {
            get { return spatial; }
            set { this.spatial = value; }
        }

        public Hashtable NonSpatial
        {
            get { return nonSpatial; }
            set { this.nonSpatial = value; }
        }
    }
}