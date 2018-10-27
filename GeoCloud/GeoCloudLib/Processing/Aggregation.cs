using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.Processing
{
    class Aggregation : IProcessing
    {
        public ProcessingStatus Process(string inputFile, string outputFile, System.Collections.Hashtable htParas)
        {
            throw new NotImplementedException();
        }

        public ProcessingStatus Process(List<DataInfo> lsSrcData, System.Collections.Hashtable htParas, out List<DataInfo> lsDstData)
        {
            throw new NotImplementedException();
        }
    }
}
