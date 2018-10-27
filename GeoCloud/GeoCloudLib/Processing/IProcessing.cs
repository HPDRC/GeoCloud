using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;
using GeoCloud.libs.Entity;

namespace GeoCloud.libs.Processing
{
    /// <summary>
    /// Summary description for IProcessing
    /// </summary>
    public interface IProcessing
    {
        ProcessingStatus Process(string inputFile, string outputFile, Hashtable htParas);
        ProcessingStatus Process(List<DataInfo> lsSrcData, Hashtable htParas, out List<DataInfo> lsDstData);
    }
}