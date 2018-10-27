using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.Entity
{
    /// <summary>
    /// Summary description for DataSetInfo
    /// </summary>
    public class DataSetInfo
    {
        private int id;
        private string name;
        private string creator;
        private string desc;
        private DateTime pubDate;
        private string tableName;
        private string geoColName;
        private string nonSpatialCols;
        private bool hasLevel;

        public int Id
        {
            get { return this.id; }
            set { this.id = value; }
        }

        public string Name
        {
            get { return this.name; }
            set { this.name = value; }
        }

        public string Creator
        {
            get { return this.creator; }
            set { this.creator = value; }
        }

        public string Desc
        {
            get { return this.desc; }
            set { this.desc = value; }
        }

        public DateTime PubDate
        {
            get { return this.pubDate; }
            set { this.pubDate = value; }
        }

        public string TableName
        {
            get { return this.tableName; }
            set { this.tableName = value; }
        }

        public string GeoColName
        {
            get { return this.geoColName; }
            set { this.geoColName = value; }
        }

        public string NonSpatialCols
        {
            get { return nonSpatialCols; }
            set { nonSpatialCols = value; }
        }

        public bool HasLevel
        {
            get { return hasLevel; }
            set { hasLevel = value; }
        }
    }
}