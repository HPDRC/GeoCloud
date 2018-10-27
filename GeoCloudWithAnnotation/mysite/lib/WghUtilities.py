import pysal
import shapely
from shapely.wkt import loads, dumps
from pysal.weights import W as WeightMatrix
from pysal.weights._contW_rtree import ContiguityWeights_rtree as ContiguityWeights
from pysal.core.util import WKTParser
import numpy as np
import pdb 

class MyList(list):

    def get(self, i):
        return super(MyList, self).__getitem__(i) 
        
class weight:
    
    def __init__(self, listWKT):

        self.listWKT = [self.MultiP2P(ow) for ow in listWKT]
        self.ids = range(len(listWKT))  #store the ids from 0, 1,...n-1
        self.N = len(listWKT)
        self.geotype = self.getGeoType() #Polygon
               
    def getGeoType(self): 

        return loads(self.listWKT[0]).type
        
    def MultiP2P(self, oneWKT):

        wkt = loads(oneWKT)
        if wkt.type == 'MultiPolygon':
            wkt_areas = [a.area for a in wkt]
            maxindex = wkt_areas.index(max(wkt_areas))                
            return dumps(wkt[maxindex])
        else:
            return oneWKT
                
    def calcWeightMatrix(self, get_wm = 0):
        
        wm = None        
        if self.geotype == 'Polygon':
            parser = WKTParser() 
            shape_l = MyList([parser.fromWKT(s) for s in self.listWKT]) 
            neighbour_data = ContiguityWeights(shape_l).w
            wm = WeightMatrix(neighbour_data, id_order=self.ids)
        elif self.geotype == 'Point':
            parser = WKTParser() 
            shape_l = MyList([parser.fromWKT(s) for s in self.listWKT]) 
            #wm = pysal.knnW_from_array(np.array(self.listWKT), k=5, ids=self.ids)
            wm = pysal.knnW_from_array(np.array(shape_l), k=5, ids=self.ids)
        if get_wm == 1:
            return wm 
        warray = self.dict2array(wm, self.N) 
        return warray 

    def dict2array(self, wm, n): 
        
        warray = np.zeros((n,n))
        index = 0
        for whts in wm:
            for idx, wght in whts.items():
                warray[idx][index]= wght
            index += 1
        return warray
            
            
def getGeoType(listWKT): 
    try:
        geotype = loads(listWKT[0]).type
        return geotype 

    except TypeError: 

        geotype = loads(listWKT[0][0]).type
        return geotype 

#transfer WKT to coodrds(a list)
def Wkt2Array(Wktl):    

    coords =[] 
    if getGeoType(Wktl) == 'Point': 
        print 'point processed'
        for Wkt in Wktl:
            Wktone = None
            try:
                Wktone = loads(Wkt)            
            except TypeError:
                Wktone = loads(Wkt[0])            
            coords.append([Wktone.x, Wktone.y])
    if getGeoType(Wktl) == 'Polygon': 
        print 'polygon processed'
        for Wkt in Wktl:
            ctroid = None
            try:
                ctroid = loads(Wkt).centroid            
            except TypeError:
                ctroid = loads(Wkt[0]).centroid            
            coords.append([ctroid.x, ctroid.y])
        
    return coords

def test():
    f = open('Flrd.test')
    l = f.read()
    import json
    lloads = json.loads(l)   
    listWKT = [item[0].decode('utf8') for item in lloads]
    wgh = weight(listWKT)
    print wgh.calcWeightMatrix() 

if __name__ == '__main__':
    test()
