using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GeoCloud.libs.FileHelper
{
    /// <summary>
    /// Summary description for FileHelper
    /// </summary>
    public class FileHandlerFactory
    {
        private static List<IFileHandler> lsFileHander = new List<IFileHandler>();
        static FileHandlerFactory()
        {
            lsFileHander.Add(new DefaultFileHandler());     // default file handler
            lsFileHander.Add(new ShapeFileHandler());       // Shape file handler
            lsFileHander.Add(new JsonFileHandler());        // GeoJson File Handler
            lsFileHander.Add(new AscFileHandler());         // ASC file Handler
        }

        /// <summary>
        /// get file handler by file type
        /// </summary>
        /// <param name="type">file type, supported file type is listed in enum FileType</param>
        /// <returns>file handler</returns>
        public static IFileHandler getFileHandler(FileType type)
        {
            return lsFileHander[(int)type];
        }

        /// <summary>
        /// get default file handler
        /// </summary>
        /// <returns>default file handler</returns>
        public static IFileHandler getFileHandler()
        {
            return lsFileHander[0];
        }
    }

    public enum FileType
    {
        FILETYPE_DEFAULT = 0,
        FILETYPE_SHP,
        FILETYPE_JSON,
        FILETYPE_ASC,
        FILETYPE_CSV
    }
}