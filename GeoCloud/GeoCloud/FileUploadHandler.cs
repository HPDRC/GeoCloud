using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using GeoCloud.libs.FileHelper;
using GeoCloud.libs.Manager;
using GeoCloud.libs;
using GeoCloud.libs.Entity;

namespace GeoCloud
{
    /// <summary>
    /// You will need to configure this handler in the web.config file of your 
    /// web and register it with IIS before being able to use it. For more information
    /// see the following link: http://go.microsoft.com/?linkid=8101007
    /// </summary>
    public class FileUploadHandler : IHttpHandler
    {
        public bool IsReusable
        {
            // usually false
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            HttpRequest request = context.Request;
            HttpResponse response = context.Response;
            string browser = request.Browser.Browser;

            string filePath = "upload";
            string uploadFileName = null;
            FileType fileType = FileType.FILETYPE_DEFAULT;

            if (context.Request.RequestType == "GET")
            {
                string message = "Not a file";
                GetResponse(response, message);
            }
            else if (context.Request.RequestType == "POST")
            {

                HttpFileCollection uploadFiles = context.Request.Files;
                string dsName = context.Request["datasetName"];
                string dsCreator = context.Request["author"];
                string dsDesc = context.Request["datasetDesc"];

                string[] jsonResponse = new string[uploadFiles.Count];
                int i;
                if (browser.Equals("IE"))
                {
                    i = 1;
                    jsonResponse = new string[uploadFiles.Count - 1];
                }
                else
                {
                    i = 0;
                    jsonResponse = new string[uploadFiles.Count];
                }
                for (int responseIndex = 0; i < uploadFiles.Count; i++, responseIndex++)
                {

                    HttpPostedFile postedFile = uploadFiles[i];
                    System.Diagnostics.Debug.Write(i + " fileName: " + postedFile.FileName);
                    string fileName = Path.GetFileName(postedFile.FileName);

                    string path = context.Server.MapPath(filePath) + "\\" + fileName;

                    postedFile.SaveAs(path);
                    jsonResponse[responseIndex] = "{\"file\":\"" + filePath.Replace("\\", "\\\\") + "\\\\" + fileName + "\"," +
                        "\"name\":\"" + fileName + "\"," +
                        "\"type\":\"" + fileName.Substring(fileName.IndexOf('.') + 1) + "\"," +
                        "\"size\":" + postedFile.ContentLength + "}";

                    if (path.EndsWith(".shp"))
                    {
                        uploadFileName = path;
                        fileType = FileType.FILETYPE_SHP;
                    }
                    else if (path.EndsWith(".csv"))
                    {
                        uploadFileName = path;
                        fileType = FileType.FILETYPE_CSV;
                    }
                    else if (path.EndsWith(".asc"))
                    {
                        uploadFileName = path;
                        fileType = FileType.FILETYPE_ASC;
                    }
                    else if (path.EndsWith(".default"))
                    {
                        uploadFileName = path;
                        fileType = FileType.FILETYPE_DEFAULT;
                    }
                }

                // the following code is for read DataInfo list from file and insert into database
                // to avoid being out of memory, I read 100,000 records to insert into database per time
                // if the data is less than 100,000, I read all records in one time
                int recordsPerTime = 100000;
                bool isDatasetCreated = false;

                DataSetManager dsMgr = new DataSetManager();
                DataManager dataMgr = new DataManager();
                DataSetInfo dsInfo = null;
                List<DataInfo> lsData = null;
                int recordCount = 0;
                while (true)
                {
                    // read DataInfo from file
                    lsData = FileHandlerFactory.getFileHandler(fileType).ReadFromFile(uploadFileName, recordCount, recordsPerTime);

                    // create the dataset, if it is the first time to read and the dataset is not yet created
                    if (!isDatasetCreated)
                    {
                        // create dataset
                        dsInfo = dsMgr.GetDataSetInfoByData(lsData[0], dsCreator, dsName, dsDesc);
                        dsMgr.InsertDataSet(dsInfo);

                        // create data table and insert data list
                        dataMgr.CreateDataTable(dsInfo);

                        isDatasetCreated = true;
                    }
                    dataMgr.InsertDataList(lsData, dsInfo);
                    
                    // the file is read to end if the count of read record is less than record number per time
                    // then stop
                    if (lsData.Count < recordsPerTime)
                    {
                        break;
                    }
                }
                if (browser.Equals("IE"))
                {
                    response.ContentType = "text/html";
                    response.Write("<textarea>[" + String.Join(",", jsonResponse) + "]</textarea>");
                }
                else
                {
                    response.ContentType = "application/json";
                    response.Write("[" + String.Join(",", jsonResponse) + "]");
                }
            }

        }

        private void GetResponse(HttpResponse response, string message)
        {
            response.ContentType = "text/plain";
            response.Write(message);
        }
    }
}