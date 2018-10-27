# Create your views here. 
import pdb
from django.http import HttpResponse
import os
import sys
import numpy as np
import logging
import logging.config
#add functions path
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1] + ['functions']))
import HotSpot as HS 
import LocalMoranI as LMI 
import SpaTemCluster as CLS
#add lib path
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-2] + ['lib']))
import DBconnect as dbconnect
import conflib

#configfile=views.conf
configfile = __file__.split('.')[0]+'.conf'
#confLib is stored in the lib
conf = conflib.ConfLib(configfile, True)

db_host = conf.get('DBINFO','db_host')
db_port = conf.get('DBINFO','db_port')
db = conf.get('DBINFO','db')
usr = conf.get('DBINFO','usr')
pwd = conf.get('DBINFO','pwd')

# anonymous functions
# unicode need to be decoded in python, transfer need the encode
x2None = lambda x: [] if x==None else [x.encode('utf-8')]
x2str = lambda x: [] if x==None else x.encode('utf-8')

def add_header(res):
    '''
        res is a HttpResponse object
    '''
    res['Access-Control-Allow-Origin'] = '*'

def hotspot(request, dataset, usegeocol, calccol):

    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    res = None
    if not calccol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        #the location of dbconnect is lib
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
        #change to "utf-8" format
        geo = change2UTF8(geo)
        cal = change2UTF8(cal)
        hotS = HS.HotSpot(geo, cal)
        hotS.controlFunc()
        res = HttpResponse(hotS.get_HotSpot())

    add_header(res)
    return res

def ClusterandOuter(request, dataset, usegeocol, calccol):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    if not calccol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
        geo = change2UTF8(geo)
        cal = change2UTF8(cal)
        localMI = LMI.LocalMoranI(geo, cal)
        localMI.controlFunc()
        res = HttpResponse(localMI.get_LocalMoranI())
    add_header(res)
    return res

def Cluster(request, dataset, usegeocol, popcol, casecol):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    popcol = x2str(popcol)
    casecol = x2str(casecol)
    
    if not popcol or not casecol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        calccol = [popcol, casecol]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
        geo = change2UTF8(geo)
        pop = [float(i[0]) for i in cal]
        case = [float(i[1]) for i in cal]

        clts = CLS.Cluster(geo,pop,case )
        clts.controlFunc()
        res = HttpResponse(clts.getGeodata())

    add_header(res)
    return res

def change2UTF8(UniList):
    try: 
        rst = [item[0].decode('utf8') for item in UniList] 
    except AttributeError:
        rst = [item[0] for item in UniList] 

    return rst 

def dowork(request):
    return HttpResponse("working")

def test():     
    dataset = 4112 
    usegeocol = 1 
    popcol = 'total'
    casecol = 'male'

    #dataset = 2095 
    #usegeocol = 1 
    #popcol = 'pop'
    #casecol = 'casenum'
    popcol = x2str(popcol)
    casecol = x2str(casecol)
    #pdb.set_trace() 
    if not popcol or not casecol:
        return HttpResponse('Please choose the data for calculating')
    else:
        calccol = [popcol, casecol]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
        geo = change2UTF8(geo)

        pop = [float(i[0]) for i in cal]
        case = [float(i[1]) for i in cal]
        clts = CLS.Cluster(geo,pop,case )
        clts.controlFunc()
        print clts.getGeodata()

       # localMI = LMI.LocalMoranI(geo, cal)
       # localMI.controlFunc()
       # return HttpResponse(localMI.get_LocalMoranI())

if __name__ == '__main__':
    test()
