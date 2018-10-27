# Create your views here. 
from django.http import HttpResponse
import os
import sys
import numpy as np
import pdb
import logging
import logging.config
#add functions path
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1] + ['functions']))
import MedianCenter as mdctr
import MeanCenter as mctr
import StandardDistance as stddst 
import DistributionTrends as dstrtrd
#add lib path
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-2] + ['lib']))
import DBconnect as dbconnect
import conflib
import WghUtilities as WU

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

def add_header(res):
    '''
        res is a HttpResponse object
    '''
    res['Access-Control-Allow-Origin'] = '*'

def medianctr(request, dataset, usegeocol, wghcol, calccol=None):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    wghcol = x2None(wghcol)
    
    #the location of dbconnect is lib
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, usegeocol,\
                        1, calccol, wghcol)

    #transfer WKT to coodrds(a list)
    geo = WU.Wkt2Array(geo)                    
    if not wgh:
        mc = mdctr.MedianCenter(np.array(geo), None) 
        mc.controlFunc()
        res = HttpResponse(mc.get_XY())
    else:
        try:
            # mediancenter in the functions
            # wgh is a string with the ',' separator
            # call the initial function
            mc = mdctr.MedianCenter(np.array(geo), np.array([float(w[0].encode('utf8'))\
                                    for w in wgh])) 
        except AttributeError:
            mc = mdctr.MedianCenter(np.array(geo), np.array([float(w[0])\
                                    for w in wgh]))
        mc.controlFunc()
        res = HttpResponse(mc.get_XY())
    add_header(res)
    return res

def meanctr(request, dataset, usegeocol, wghcol, calccol=None):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    wghcol = x2None(wghcol)
    
    # meancenter in the functions
    # wgh is a string with the ',' separator
    # call the initial function
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, usegeocol,\
                        1, calccol, wghcol)
    
    #transfer WKT to coodrds(a list)
    geo = WU.Wkt2Array(geo)                    
    if not wgh:
        mc = mctr.MeanCenter(np.array(geo), None) 
        mc.controlFunc()
        res = HttpResponse(mc.get_MeanCtr())
    else:
        try:
            mc = mctr.MeanCenter(np.array(geo), np.array([float(w[0].encode('utf8'))\
                                    for w in wgh])) 
        except AttributeError:
            mc = mctr.MeanCenter(np.array(geo), np.array([float(w[0])\
                                    for w in wgh])) 

        mc.controlFunc()
        res = HttpResponse(mc.get_MeanCtr())
    add_header(res)
    return res

def stdDistance(request, dataset, usegeocol, wghcol, std, calccol=None):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    wghcol = x2None(wghcol)
    
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, usegeocol,\
                        1, calccol, wghcol)

    geo = WU.Wkt2Array(geo)                    
    if not wgh:
        stdd = stddst.StandardDistance(np.array(geo), None, std) 
        stdd.controlFunc()
        res = HttpResponse(stdd.get_StdDistance())
    else:
        try:
            stdd = stddst.StandardDistance(np.array(geo), np.array([float(w[0].encode('utf8'))\
                                    for w in wgh]), std) 
        except AttributeError:
            stdd = stddst.StandardDistance(np.array(geo), np.array([float(w[0])\
                                    for w in wgh]), std) 
        stdd.controlFunc()
        res = HttpResponse(stdd.get_StdDistance())
    add_header(res)
    return res

def distributionTrends(request, dataset, usegeocol, wghcol, std, calccol=None):
    dataset = int(dataset.encode("utf-8"))
    usegeocol = int(usegeocol.encode("utf-8"))
    calccol = x2None(calccol)
    wghcol = x2None(wghcol)
    
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, usegeocol,\
                        1, calccol, wghcol)

    geo = WU.Wkt2Array(geo)                    

    if not wgh:
        dt = dstrtrd.StandardEllipse(np.array(geo), None, std)
        dt.controlFunc()
        res = HttpResponse(dt.get_StdEllipse())
    else:
        try:
            dt = dstrtrd.StandardEllipse(np.array(geo), np.array([float(w[0].encode('utf8'))\
                                    for w in wgh]), std) 
        except AttributeError:
            dt = dstrtrd.StandardEllipse(np.array(geo), np.array([float(w[0])\
                                    for w in wgh]), std) 
        dt.controlFunc()
        res = HttpResponse(dt.get_StdEllipse())

    add_header(res)
    return res

def test():     
    print 
    dataset = 2095 
    #dataset = 2085 
    usegeocol = 1 
    calccol = 'name'
    wghcol = 'mortality'
    calccol = x2None(calccol)
    wghcol = x2None(wghcol)
    
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, usegeocol,\
                        1, calccol, wghcol)
    geo = WU.Wkt2Array(geo)                    
    import json
    print json.dumps(geo)
    print json.dumps([float(w[0].encode('utf8'))\
                                for w in wgh])

    #mc = mdctr.MedianCenter(np.array(geo),\
    #            np.array([ float(w[0].encode('utf8')) for w in wgh]))
 
    #mc = mctr.MeanCenter(np.array(geo), wgh) 
    #mc = mctr.MeanCenter(np.array(geo), np.array([float(w[0].encode('utf8'))\
    #                        for w in wgh])) 
    #mc.controlFunc()

    #print mc.get_XY()
    #print "center:%f, %f" %(list(mc.get_MeanCtr())[0],list(mc.get_MeanCtr())[1])
    #stdd = stddst.StandardDistance(np.array(geo), np.array([float(w[0].encode('utf8'))\
    #                        for w in wgh])) 
    #stdd.controlFunc()
    #print stdd.get_StdDistance()
    #stdd = dstrtrd.StandardEllipse(np.array(geo), np.array([float(w[0].encode('utf8'))\
    #                        for w in wgh]), 1) 
    #stdd.controlFunc()
    #print stdd.get_StdEllipse()

if __name__ == '__main__':
    test()
