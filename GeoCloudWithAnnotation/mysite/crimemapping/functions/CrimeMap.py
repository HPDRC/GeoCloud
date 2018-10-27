import os 
import sys
import pdb
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import datetime

class CrimeMap:
    def __init__(self, lat, lon):
        self.lat_x = np.array(lat)
        self.lon_y = np.array(lon)
        self.m = len(self.lon_y)

    def controlFunc(self):
        if not self.m:
            #error message
            return 0
        
        self.calcCrimeMap()

    def calcCrimeMap(self):

        xmin = self.lat_x.min()
        xmax = self.lat_x.max()
        ymin = self.lon_y.min()
        ymax = self.lon_y.max()

        #if self.m <= 1000:
        X, Y = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]
        #else:
        #    X, Y = np.mgrid[xmin:xmax:400j, ymin:ymax:400j]
        #elif self.m >=1000:
        #    X, Y = np.mgrid[xmin:xmax:10000j, ymin:ymax:10000j]
        positions = np.vstack([X.ravel(), Y.ravel()])
        values = np.vstack([self.lat_x, self.lon_y])
        kernel = stats.gaussian_kde(values)
        Z = np.reshape(kernel(positions).T, X.shape)
        fig = plt.figure()
        ax = fig.add_subplot(111)
        ax.imshow(np.rot90(Z), cmap=plt.cm.gist_earth_r,
                  extent=[xmin, xmax, ymin, ymax])
        ax.set_axis_off()
        plt.savefig('test.jpeg')

def test(): 
    f = open('testfile/geo_pop_case')
    lines = f.readlines()
    import json
    geo = json.loads(lines[0]) 
    pop = json.loads(lines[1])
    case = json.loads(lines[2])
    name = json.loads(lines[3])
    clt = CrimeMap(geo, pop, case, name)
    clt.controlFunc()
    print clt.getGeodata()

if __name__ == '__main__':
    test()
