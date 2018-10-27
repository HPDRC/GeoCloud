import numpy as np
import math
import sys
import os
import pdb
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import SatUtilities as SU

class StandardDistance():
    def __init__(self, coords, weights = None, stdDev = 1.0):
        self.coords = coords
        self.weights = weights
        self.m = len(coords)
        self.stdDev = stdDev
    
    def controlFunc(self):

        if not self.m:
            #error message
            return 0
       
        if self.weights is not None:
            lessThanZero = np.where(self.weights < 0.0)
            if len(lessThanZero[0]):
                self.weights[lessThanZero] = 0.0

            self.weightSum = self.weights.sum()
            if not self.weightSum > 0.0:
                #error massage
                return 0
        else:
            self.weights = np.ones((self.m, 1))


        self.StandardDistance = self.calcStandardDistance(self.coords, self.stdDev, self.weights)
        
            
    def get_StdDistance(self):

        return self.StandardDistance


    def calcStandardDistance(self, coords, stdDev, weights):

        numFeatures = len(coords)
        weights.shape = numFeatures, 1 
        weightSum = weights.sum()
        geolist = []
        if (weightSum != 0.0) and (numFeatures > 2):

            xyWeighted = weights*coords

            centers = xyWeighted.sum(0) / float(weightSum)
            meanX, meanY = centers
            devXY = coords - centers
            sigXY = (weights * devXY**2.0).sum(0) / float(weightSum)
            sd = (math.sqrt(sigXY.sum())) * float(stdDev) 
            
            for degree in np.arange(0, 360):
                radians = np.pi / 180.0 * degree
                pointX = meanX + (sd * np.cos(radians))
                pointY = meanY + (sd * np.sin(radians))
                geolist.append([pointX, pointY])
            georst = SU.l2geojson([[geolist]])
            return georst
        return 0

            


if __name__ == '__main__':
    f = open('testfile/fl.txt')
    lines = f.readlines()
    f.close()
    import json
    geo = json.load(lines[0])
    mor = json.load(lines[1])
    mc = StandardDistance(np.array(geo),np.array(mor))
    #mc = StandardDistance(np.array([[1,2],[2,3]]))
    mc.controlFunc()
    print mc.get_StdDistance()

