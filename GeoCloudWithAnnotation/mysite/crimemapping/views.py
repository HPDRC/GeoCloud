# Create your views here. 
import pdb
from django.http import HttpResponse
import os
import sys
import numpy as np
import logging
import logging.config
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-1] + ['functions']))
import CrimeMap as CM
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

def crimemap(request, dataset, lat, lon):

    dataset = int(dataset.encode("utf-8"))
    
    if not lat or not lon:
        res = HttpResponse('Please choose the data for calculating')
        
        calccol = [lat, lon]
        geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                            db_port, dataset, isShapecol=0,\
                            ispoint=0, calccolsnm=calccol)

    latitude = [i[0] for i in cal]
    longitude = [i[1] for i in cal]

    Cmap = CM.CrimeMap(latitude, longitude)
    Cmap.controlFunc()
    #res = HttpResponse(dimap.getGeodata())

    #add_header(res)
    #return res


def change2UTF8(UniList):
   return [item[0].decode('utf8') for item in UniList] 


def test():     

    dataset = 3097 
    lat = 'LATITUDE' 
    lon = 'LONGITUDE' 
        
    calccol = [lat, lon]
    geo, cal, wgh = dbconnect.fetchdata(db_host, usr, pwd, db,\
                        db_port, dataset, isShapecol=0,\
                        ispoint=0, calccolsnm=calccol)

    latitude = [i[0] for i in cal]
    longitude = [i[1] for i in cal]
    print len(latitude)
    Cmap = CM.CrimeMap(latitude, longitude)
    Cmap.controlFunc()

if __name__ == '__main__':
    test()
