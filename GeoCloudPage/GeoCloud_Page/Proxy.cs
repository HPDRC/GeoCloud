using System;
using System.Web;
using System.IO;
using System.Net;

namespace GeoCloud_Page
{
    public class Proxy : IHttpHandler
    {
        /// <summary>
        /// You will need to configure this handler in the Web.config file of your 
        /// web and register it with IIS before being able to use it. For more information
        /// see the following link: http://go.microsoft.com/?linkid=8101007
        /// </summary>
        #region IHttpHandler Members

        public bool IsReusable
        {
            // Return false in case your Managed Handler cannot be reused for another request.
            // Usually this would be false in case you have some state information preserved per request.
            get { return false; }
        }

        public void ProcessRequest(HttpContext context)
        {
            HttpRequest request = context.Request;
            HttpResponse response = context.Response;

            string uri = Uri.UnescapeDataString(request.QueryString.ToString());
            if (string.IsNullOrWhiteSpace(uri))
            {
                response.StatusCode = 403;
                response.End();
                return;
            }

            if (!uri.ToLowerInvariant().Contains("131.94.129.95") && !uri.ToLowerInvariant().Contains("131.94.133.233") )
            {
                response.StatusCode = 403;
                response.End();
                return;
            }

            WebRequest webRequest = WebRequest.Create(new Uri(uri));
            webRequest.Method = request.HttpMethod;
            ((HttpWebRequest)webRequest).UserAgent = request.UserAgent;
            webRequest.ContentType = request.ContentType;

            if (webRequest.Method.Equals("POST"))
            {
                Stream newStream = webRequest.GetRequestStream();
                StreamReader sr = new StreamReader(request.InputStream);
                byte[] bytes = sr.CurrentEncoding.GetBytes(sr.ReadToEnd());

                newStream.Write(bytes, 0, bytes.Length);
                newStream.Close();
                sr.Close();
            }

            WebResponse serverResponse = null;
            try
            {
                serverResponse = webRequest.GetResponse();
            }
            catch (WebException webExc)
            {
                response.StatusCode = 500;
                response.StatusDescription = webExc.Status.ToString();
                response.Write(webExc.Response);
                response.End();
                return;
            }

            if (serverResponse == null)
            {
                response.End();
                return;
            }

            response.ContentType = serverResponse.ContentType;
            Stream stream = serverResponse.GetResponseStream();

            byte[] buffer = new byte[32768];
            int read = 0;

            int chunk;
            while ((chunk = stream.Read(buffer, read, buffer.Length - read)) > 0)
            {
                read += chunk;
                if (read != buffer.Length) { continue; }
                int nextByte = stream.ReadByte();
                if (nextByte == -1) { break; }

                // Resize the buffer
                byte[] newBuffer = new byte[buffer.Length * 2];
                Array.Copy(buffer, newBuffer, buffer.Length);
                newBuffer[read] = (byte)nextByte;
                buffer = newBuffer;
                read++;
            }

            byte[] ret = new byte[read];
            Array.Copy(buffer, ret, read);

            response.OutputStream.Write(ret, 0, ret.Length);
            serverResponse.Close();
            stream.Close();
            response.End();
        }

        #endregion
    }
}
