import numpy as np
import geojson
import shapely 
from shapely.wkt import loads, dumps
import pdb

def euclideanDistance(x1, x0, y1, y0):

    return np.sqrt( (x0 - x1)**2.0 + (y0 - y1)**2.0 )

def compareFloat(a, b, rTol = .0001, aTol = .00000001):

    if abs(a-b) < aTol + (rTol * abs(b)):
        return 1 
    else:
        return 0 
            
def getXY(Wktl):
    x = []
    y = []
    for oneWkt in Wktl: 
       tWkt = loads(oneWkt) 
       x.append(tWkt.x)
       y.append(tWkt.y)
    return x, y

def Float2Str(Floatl):

    return  ['%.6f' %fl for fl in Floatl]
    



def Zero2Float(aArray, aTol = .00000001):
    
    FloatList = [] 
    for a in aArray: 
        if a == 0.0:
            FloatList.append(a+aTol)
        else:
            FloatList.append(a)

    return np.array(FloatList)

def getCentroid(coords):
    x_cor = []
    y_cor = []
    for coord in coords:
        cc = loads(coord)
        ctroid = cc.centroid
        x_cor.append(ctroid.x)
        y_cor.append(ctroid.y)
            
    return x_cor, y_cor 

def l2geojson(l, type='Polygon'):

    features_l = []
    for ll in l:
        if type == 'Polygon':
            p = geojson.Polygon(ll)
        elif type == 'Point':
            p = geojson.Point(ll)
        else:
            p = geojson.MultiPolygon(ll)

        f = geojson.Feature(geometry=p)
        features_l.append(f)
        
    geodata = geojson.dumps(geojson.FeatureCollection(features=features_l))
    return geodata

def WKT2geojson(WKTl, valuenml, valuel): 
    '''
    WKTl: list, indicate all the coordinates info 
    valuenml: list, the names of properties
    values: list(tuple1,tuple2...), each tuple indicats the values of all the properties
    '''

    lenvalnm = len(valuenml)
    lenvaluel = len(valuel)

    if lenvaluel ==0\
        or lenvalnm == 0:
        return 0    

    property_l = []
    
    for each_value in valuel:
        d = dict(zip(valuenml, each_value)) 
        property_l.append(d)

    features_l = []
    i = 0
    for onewkt in WKTl:
        wkt = loads(onewkt)
        wktjson = geojson.loads(geojson.dumps(wkt))
        f = geojson.Feature(geometry=wktjson,\
                            properties = property_l[i]) 
        i += 1                        
        features_l.append(f)
    geodata = geojson.dumps(geojson.FeatureCollection(features=features_l))

    return geodata
        
    

def convert2Radians(degree):

    return np.pi / 180.0 * degree
