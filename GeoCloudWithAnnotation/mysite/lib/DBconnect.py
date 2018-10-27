import pymssql
import pdb

class MSSQL:

    def __init__(self, host, user, pwd, db, port):

        self.host = host
        self.user = user
        self.pwd = pwd
        self.db = db
        self.port = port

    def __GetConnect(self):
        
        if not self.db:
            raise(NameError, 'No database info')
        self.conn = pymssql.connect(host=self.host, user=self.user,\
                                    password=self.pwd, database=self.db,\
                                    port=self.port, charset="utf8")
        cur = self.conn.cursor()
        if not cur:
            raise(NameError, 'Can not get cursor')
        else:
            return cur
    
    def ExecQuery(self, sql):
        cur = self.__GetConnect()
        cur.execute(sql)
        resList = cur.fetchall()
        self.conn.close()
            #print resList
        return resList
 
    def ExecNonQuery(self, sql):
        cur = self.__GetConnect()
        cur.execute(sql)
        self.conn.commit()
        self.conn.close()

def fetchdata(hostname, username, passwd, database,\
              portnum, datasetnum, isShapecol=None,\
              ispoint=1, calccolsnm=[], weightcolsnm=[]):
    """
    1.According the dataset number,fetch table name.
    2.Fetch the columns for analysis.

    INPUTS:
    host,user,pwd,db (str): using to connect database
    datasetnum (str): dataset number
    isShapecol (str): is the calculation need shape file or not
    calccolsnm (list): names of columns for calculation except the geo column
    weightcolsnm (list): names of weight columns

    OUTPUT:
    calccols (list): data for calculation  
    weightcols (list): weight data
    """
    #MSSQL means SQL Server
    ms = MSSQL(host=hostname, user=username, pwd=passwd, db=database, port=portnum)
    
    #All the table informations are stored in the table named "dataset_info"
    sql = 'select table_name,geo_col_name,non_spatial_cols from dataset_info where id=%s' %datasetnum
    t_g = ms.ExecQuery(sql)[0]
    tablenm, geo_col_name, non_spatial_cols= t_g[0].encode('utf8'), t_g[1].encode('utf8'), t_g[2].encode('utf8')
    geocol = None
    calccol = None
    wghtcol = None
    #all the non_sptial columns are stored in one column
    non_spatial_l =[x.lower() for x in  non_spatial_cols.split(',')]
    if isShapecol:
        #if ispoint:
        #    schgeocol = 'select %s.STX, %s.STY from %s' %(geo_col_name, geo_col_name, tablenm)
        #    geocol = ms.ExecQuery(schgeocol)
        #else:
        #STAsText: return the OGC well-Known Text(WKT)
        schgeocol = 'select %s.STAsText() from %s' %(geo_col_name, tablenm)
        geocol = ms.ExecQuery(schgeocol)
    if calccolsnm and isItemInCols(calccolsnm, non_spatial_l):

        schcalccol = 'select %s from %s' %(','.join(calccolsnm), tablenm)
        calccol = ms.ExecQuery(schcalccol)
    
    # 'join': return a string with the ',' separator
    if weightcolsnm and isItemInCols(calccolsnm, non_spatial_l):
        schwghtcol = 'select %s from %s' %(','.join(weightcolsnm), tablenm)
        wghtcol = ms.ExecQuery(schwghtcol)

    return  geocol, calccol, wghtcol
    
def isItemInCols(colsnm, non_spatial_l):
    for i in colsnm:
        if i.lower() not in non_spatial_l:
            return 0
    return 1
                

 
if __name__=='__main__':
    #ms = MSSQL(host="131.94.133.239",user="geocloudadmin",pwd="geocloudadmin",db="geo_cloud", port=1433)
    #sql = 'select nm from dataset_info where id=1' 
    #print ms.ExecQuery(sql)
    g, c, w = fetchdata("131.94.133.239","geocloudadmin", "geocloudadmin", "geo_cloud", 1433, 2085, 1, 0 )
    import json
    print json.dumps(g)

