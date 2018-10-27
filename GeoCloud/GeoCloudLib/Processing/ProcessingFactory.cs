using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.Processing
{
    /// <summary>
    /// Summary description for ProcessingFactory
    /// </summary>
    public class ProcessingFactory
    {
        private static string[] processingErrors = { 
                                                   "OK",
                                                   "Parameter missed!",
                                                   "Execute error!"
                                               };

        private static List<IProcessing> lsProcessing = new List<IProcessing>();
        static ProcessingFactory()
        {
            lsProcessing.Add(new Clustering());     //clustering
        }

        public static IProcessing GetProcessingMethod(ProcessingMethod method)
        {
            return lsProcessing[(int)method];
        }
    }

    public enum ProcessingMethod
    {
        CLUSTERING
    }

    public enum ProcessingStatus
    {
        OK,
        PARA_ERROR,
        EXECUTE_ERROR
    }
}