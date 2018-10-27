import numpy as np
import sys
import os
import pdb
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import SatUtilities as SU
import WghUtilities as WU


class MeanCenter():
    def __init__(self, coords, weights= None, zCoords=None):
        self.coords = coords
        self.weights = weights
        self.m = len(coords)
        self.zCoords = zCoords
        self.MeanCenter = None
        self.geodata = None
    
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
        self.MeanCenter = self.calcMeanCenter(self.coords, self.zCoords, self.weights)
        self.geodata = SU.l2geojson([self.MeanCenter], 'Point')
        
    def get_MeanCtr(self):

        return self.geodata

    def calcMeanCenter(self, coords, zCoords, weights):

        weightSum = weights.sum()
        xWeighted = 0.0
        yWeighted = 0.0 
        if weightSum != 0.0:
            for ind, coord in enumerate(coords):
                x = coord[0]
                y = coord[1]
                xWeighted += x*weights[ind]
                yWeighted += y*weights[ind]

            meanX = xWeighted / weightSum
            meanY = yWeighted / weightSum

            meanZ = None 

            if zCoords != None:
                zWeighted = weights*zCoords 
                meanZ = zWeighted.sum() / (2*weightSum)

                return [float(meanX), float(meanY), float(meanZ)]

            return [float(meanX), float(meanY)]
        return 0

            


if __name__ == '__main__':
    mc = MeanCenter(np.array([[1,2],[2,3],[2,4]]),np.array([10,10,10]))
    #mc = MeanCenter(np.array([[1,2],[2,3]]))
    mc.controlFunc()
    print mc.get_MeanCtr()

