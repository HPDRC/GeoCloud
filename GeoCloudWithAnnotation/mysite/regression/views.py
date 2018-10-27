# Create your views here. 
import pdb
from django.http import HttpResponse
import os
import sys
import numpy as np
import logging
import logging.config
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1] + ['functions']))
import autoRegression as aReg
import errorsarRegression as eReg
import linearRegression as lReg
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

x2None = lambda x: [] if x==None else [x.encode('utf-8')]
x2list = lambda x: [] if x==None else x.encode('utf-8').split('&')

def add_header(res):
    '''
        res is a HttpResponse object
    '''
    res['Access-Control-Allow-Origin'] = '*'

def spatialauto(request, dataset, usegeocol, ycol, xcol):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    ycol = x2None(ycol)
    xcol = x2list(xcol)
    if not ycol or not xcol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        geo, xcolv, ycolv = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            calccolsnm=xcol, weightcolsnm=ycol)
        geo = change2UTF8(geo)
        colnm = ycol + xcol
        autoReg = aReg.autoRegression(geo, xcolv, ycolv, colnm)
        autoReg.controlFunc()
        res = HttpResponse(autoReg.get_autoRegression())
    add_header(res)
    return res

def errorauto(request, dataset, usegeocol, ycol, xcol):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    ycol = x2None(ycol)
    xcol = x2list(xcol)
    if not ycol or not xcol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        geo, xcolv, ycolv = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            calccolsnm=xcol, weightcolsnm=ycol)
        geo = change2UTF8(geo)
        colnm = ycol + xcol
        autoeReg = eReg.errorRegression(geo, xcolv, ycolv, colnm)
        autoeReg.controlFunc()
        res = HttpResponse(autoeReg.get_errorRegression())
    add_header(res)
    return res

def linearrgrs(request, dataset, usegeocol, ycol, xcol):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    ycol = x2None(ycol)
    xcol = x2list(xcol)
    if not ycol or not xcol:
        res = HttpResponse('Please choose the data for calculating')
    else:
        geo, xcolv, ycolv = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=usegeocol,\
                            calccolsnm=xcol, weightcolsnm=ycol)
        geo = change2UTF8(geo)
        colnm = ycol + xcol
        lmReg = lReg.lmRegression(geo, xcolv, ycolv, colnm)
        lmReg.controlFunc()
        res = HttpResponse(lmReg.get_lmRegression())
    add_header(res)
    return res

def change2UTF8(UniList):
   return [item[0].decode('utf8') for item in UniList] 


def test():     
    #dataset = 3095 
    #usegeocol = 1 
    #ycol = 'mortality'
    #xcol = 'income&house_price'
    dataset = 4112 
    usegeocol = 1 
    ycol = 'average_age'
    xcol = 'median_cholesterol'
    #dataset = 2095 
    #usegeocol = 1 
    #ycol = 'mortality'
    #xcol = 'casenum'
    ycol = x2None(ycol)
    xcol = x2list(xcol)
    
    #pdb.set_trace()
    geo, xcolv, ycolv = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, isShapecol=usegeocol,\
                        calccolsnm=xcol, weightcolsnm=ycol)
    geo = change2UTF8(geo)
    colnm = ycol + xcol
    #lmReg = lReg.lmRegression(geo, xcolv, ycolv, colnm)
    #lmReg.controlFunc()
    #print lmReg.get_lmRegression()
    autoReg = eReg.errorRegression(geo, xcolv, ycolv, colnm)
    autoReg.controlFunc()
    print autoReg.get_errorRegression()
    


if __name__ == '__main__':
    test()
