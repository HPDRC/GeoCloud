import os
import sys
import pdb
import numpy as np
from shapely.geometry import Point
from shapely.wkt import dumps 
from rpy2 import robjects
import scipy.stats as Stats
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import WghUtilities as WU
import SatUtilities as SU

class SmrMap:
    def __init__(self, coords, pop, case, sitenm=None):
        self.coords = coords
        self.pop = np.array(pop)
        self.case = np.array([float(yv) for yv in case])
        self.m = len(coords)

        self.SmrMapgeojson = None
        self.sitenm = sitenm
        self.geodata = None

    def controlFunc(self):

        if not self.m:
            #error message
            return 0
        
        self.calcSmrMap(self.coords, self.pop, self.case, self.sitenm)

    def getGeodata(self):
        return self.geodata

    def calcSmrMap(self, coords, pop, case, sitenm):
        mean_rate = sum(case)*1.0/sum(pop)
        expected = pop*mean_rate 
        Smr = case*1.0/expected


        valuenml = ['SMR', 'nm', 'expected', 'observed']
        if sitenm == None:
            sitenm = ['none']*self.m
        valuel = zip(Smr, sitenm, expected, case)
        
        self.geodata = SU.WKT2geojson(coords, valuenml, valuel)

def test(): 
    f = open('testfile/geo_pop_case')
    lines = f.readlines()
    import json
    geo = json.loads(lines[0]) 
    pop = json.loads(lines[1])
    case = json.loads(lines[2])
    name = json.loads(lines[3])
    clt = SmrMap(geo, pop, case, name)
    clt.controlFunc()
    print clt.getGeodata()

if __name__ == '__main__':
    test()
