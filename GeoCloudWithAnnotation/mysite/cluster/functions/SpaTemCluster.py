import os
import sys
import pdb
from shapely.geometry import Point
from shapely.wkt import dumps 
from rpy2 import robjects
import scipy.stats as Stats
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import WghUtilities as WU
import SatUtilities as SU
fileDir = '/'.join(os.path.abspath(__file__).split('/')[:-1] + ['Rcode/'])
method_file = {'pam' : fileDir + 'pam.R',
                'knpam': fileDir + 'knpam.R',
                'bnpam': fileDir + 'bnpam.R'}


class Cluster:
    def __init__(self, coords, pop, case, method = 'bnpam'):
        self.coords = coords
        self.pop = pop
        self.case = [float(yv) for yv in case]
        self.m = len(coords)
        self.Clustergeojson = None
        r = robjects.r
        fnm = method_file[method]
        self.s = r.source(fnm)
        self.x = None
        self.y = None
        self.geodata = None

    def controlFunc(self):

        if not self.m:
            #error message
            return 0
        
        geotype = WU.getGeoType(self.coords)

        if geotype == 'Polygon':
            self.x, self.y = SU.getCentroid(self.coords) 
        elif geotype == 'Point':
            self.x, self.y = SU.getXY(self.coords)

        self.calcCluster(self.x, self.y, self.pop, self.case)

    def getGeodata(self):
        return self.geodata

    def calcCluster(self, x, y, pop, case):

        avg_case = sum(case)*1.0/len(case)  
        rst = self.useR(pop, case, x, y, avg_case)
        point_l = []        

        for i in range(len(rst[0])):
            point_l.append(dumps(Point(rst[0][i],\
                rst[1][i])))

        valuenml = ['statistic', 'cluster', 'pvalue']
        sat = rst[2]
        cluster = SU.Float2Str(rst[3])
        pvalue = SU.Float2Str(rst[4])
        valuel = zip(sat, cluster, pvalue)
        
        self.geodata = SU.WKT2geojson(point_l, valuenml, valuel)
         
        
    def useR(self, pop, case, x, y, k, alpha=0.02,  r=100):
        '''
        use R to calculte cluster, k is the cluster size
        '''

        rst = self.s[0](self.intV(pop), self.intV(case), alpha, self.floatV(x), self.floatV(y), k, r)
        #0-x cooidinate, 1-y coordinate
        return rst

    def floatV(self, L):
        return robjects.FloatVector(L)

    def intV(self, L):
        return robjects.IntVector(L)

def test(): 
    f = open('testfile/geo_pop_case')
    lines = f.readlines()
    import json
    geo = json.loads(lines[0]) 
    pop = json.loads(lines[1])
    case = json.loads(lines[2])
    clt = Cluster(geo, pop, case)
    clt.controlFunc()
    print clt.getGeodata()
if __name__ == '__main__':
    test()
