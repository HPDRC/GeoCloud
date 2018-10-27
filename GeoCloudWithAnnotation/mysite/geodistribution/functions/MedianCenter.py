import numpy as np
import sys
import os
import pdb
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import SatUtilities as SU


class MedianCenter():
    def __init__(self, coords, weights= None):
        self.coords = coords
        self.weights = weights
        self.m = len(coords)
        self.medX = None 
        self.medY = None 
    
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

        medX, medY, iters = self.calcMedianCenter(self.coords, self.weights)
        
        if iters > 0:
            self.medX = medX
            self.medY = medY
            #info
            return 1 

        else:
            #error
            return 0

    # Transfer to geojson format       
    def get_XY(self):
        
        return SU.l2geojson([[float(self.medX), float(self.medY)]], 'Point')


    def calcMedianCenter(self, coords, weights, maxIters = 100,\
                        tolerance = .000001):
        # return the rows and columns of coords 
        n, k = np.shape(coords)
        if n==1:
            estimateX, estimateY = coords[0]
            return estimateX, estimateY, 1
        
        #### Create a Weight for the point coincidents with (estmateX, estimateY) ####
        # find minX, maxX, minY, maxY in the coords
        minX, minY = np.min(coords, 0)
        maxX, maxY = np.max(coords, 0)
        deltaX = maxX - minX
        maxX = maxX + (deltaX / 1000.)
        deltaY = maxY - minY
        minY = minY - (deltaY / 1000.)
        height = maxY - minY
        width = maxX - minX
        extentArea = height * width * 1000.0
        
        # initial the mean of coords as the median center
        estimateX, estimateY = np.mean(coords, 0) 

        flag = 1
        c = 0
        while flag:
            c+=1 
            if c > maxIters:
                flag = 0 
                break

            newX, newY = self.evaluateDistance(coords, estimateX,\
                                               estimateY, weights,\
                                               extentArea)
            diffX = SU.compareFloat(newX, estimateX, rTol = tolerance)
            diffY = SU.compareFloat(newY, estimateY, rTol = tolerance)
            if diffX and diffY:
                flag = 0
            else:
                estimateX = newX
                estimateY = newY

        return estimateX, estimateY, c
    
    def evaluateDistance(self, coords, X0, Y0, weights, maxW):

        sumK = 0
        newXTop = 0
        newYTop = 0

        for ind, coord in enumerate(coords):
            x1 = coord[0]
            y1 = coord[1]
            # dij: the distance between current coord and estimate coord
            dij = SU.euclideanDistance(x1, X0,
                                       y1, Y0)
            if dij == 0.0:
                k = weights[ind] * maxK
            else:
                k = weights[ind] / dij
            sumK += k
            newXTop += k * x1
            newYTop += k * y1
           

        newX = newXTop / sumK
        newY = newYTop / sumK

        return newX, newY


if __name__=='__main__':
    mc = MedianCenter(np.array([[1,2],[2,3]]), np.array([10,1]))
    mc.controlFunc()
    print mc.get_XY()

