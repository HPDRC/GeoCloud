# Create your views here. 
import pdb
from django.http import HttpResponse
import os
import sys
import numpy as np
import logging
import logging.config
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1] + ['functions']))
import DiseaseMap as DM
import SmrMap as SM
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-2] + ['lib']))
import DBconnect as dbconnect
import conflib

configfile = __file__.split('.')[0]+'.conf'
conf = conflib.ConfLib(configfile, True)

db_host = conf.get('DBINFO','db_host')
db_port = conf.get('DBINFO','db_port')
db = conf.get('DBINFO','db')
usr = conf.get('DBINFO','usr')
pwd = conf.get('DBINFO','pwd')

x2None = lambda x: [] if x==None or x == 'none' or x=='None'  else [x.encode('utf-8')]
x2str = lambda x: [] if x==None or x == 'none' or x=='None' else x.encode('utf-8')

def add_header(res):
    '''
        res is a HttpResponse object
    '''
    res['Access-Control-Allow-Origin'] = '*'

def diseasemap(request, dataset, usegeocol, popcol, casecol, sitenm):

    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    popcol = x2str(popcol)
    casecol = x2str(casecol)
    sitenm = x2str(sitenm)
    geo = None
    cal = None
    
    if not popcol or not casecol:
        res = HttpResponse('Please choose the data for calculating')
    elif not sitenm:
        calccol = [popcol, casecol]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
    else:
        calccol = [popcol, casecol, sitenm]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)

    geo = change2UTF8(geo)
    pop = [float(i[0]) for i in cal]
    case = [float(i[1]) for i in cal]
    if len(cal[0]) == 3:
        sitenm = [i[2] for i in cal]
    else:
        sitenm = None
    dimap = DM.DiseaseMap(geo,pop,case,sitenm)
    dimap.controlFunc()
    res = HttpResponse(dimap.getGeodata())

    add_header(res)
    return res

def smrmap(request, dataset, usegeocol, popcol, casecol, sitenm):

    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    popcol = x2str(popcol)
    casecol = x2str(casecol)
    sitenm = x2str(sitenm)
    geo = None
    cal = None
    
    if not popcol or not casecol:
        res = HttpResponse('Please choose the data for calculating')
    elif not sitenm:
        calccol = [popcol, casecol]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
    else:
        calccol = [popcol, casecol, sitenm]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)

    geo = change2UTF8(geo)
    pop = [float(i[0]) for i in cal]
    case = [float(i[1]) for i in cal]
    if len(cal[0]) == 3:
        sitenm = [i[2] for i in cal]
    else:
        sitenm = None
    smmap = SM.SmrMap(geo,pop,case,sitenm)
    smmap.controlFunc()
    res = HttpResponse(smmap.getGeodata())

    add_header(res)
    return res

def change2UTF8(UniList):
   return [item[0].decode('utf8') for item in UniList] 


def test():     
    #dataset = 2085 
    #usegeocol = 1 
    #popcol = 'pop'
    #casecol = 'casenum'
    dataset = 4112
    usegeocol = 1 
    popcol = 'total'
    casecol = 'white'

    sitenm = None
     
 
    popcol = x2str(popcol)
    casecol = x2str(casecol)
    sitenm = x2str(sitenm)
    geo = None
    cal = None
    
    if not popcol or not casecol:
        res = HttpResponse('Please choose the data for calculating')
    elif not sitenm:
        calccol = [popcol, casecol]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
    else:
        calccol = [popcol, casecol, sitenm]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            ispoint=0, calccolsnm=calccol)
    geo = change2UTF8(geo)
    pop = [float(i[0]) for i in cal]
    case = [float(i[1]) for i in cal]
    if len(cal[0]) == 3:
        sitenm = [i[2] for i in cal]
    else:
        sitenm = None

    #pdb.set_trace()
    dimap = DM.DiseaseMap(geo,pop,case,sitenm)
    dimap.controlFunc()
    print dimap.getGeodata()

if __name__ == '__main__':
    test()
