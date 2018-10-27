import numpy as np
import math
import sys
import os
import pdb
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import SatUtilities as SU

class StandardEllipse():
    def __init__(self, coords, weights = None, stdDev = 1.0):
        self.coords = coords
        self.weights = weights
        self.m = len(coords)
        self.stdDev = float(stdDev)
    
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


        self.StandardEllipse = self.calcStandardEllipse(self.coords, self.stdDev, self.weights)
        
            
    def get_StdEllipse(self):

        return self.StandardEllipse


    def calcStandardEllipse(self, coords, stdDev, weights):

        numFeatures = len(coords)
        weights.shape = numFeatures, 1 
        weightSum = weights.sum()
        geolist = []
        if (weightSum != 0.0) and (numFeatures > 2):

            xyWeighted = weights*coords

            centers = xyWeighted.sum(0) / float(weightSum)
            meanX, meanY = centers

            devXY = coords - centers
            flatW = weights.flatten()
            sigX = (flatW * devXY[:,0]**2.0).sum()
            sigY = (flatW * devXY[:,1]**2.0).sum()
            sigXY = (flatW * devXY[:,0] * devXY[:,1]).sum()
            C = 2.0 * sigXY
            A = sigX - sigY
            Bsq = A**2.0 + 4.0 * sigXY**2.0

            if not abs(C) > 0:
                arctanVal = 0.0
            else:
                tempVal = (A + np.sqrt(Bsq)) / C
                arctanVal = np.arctan(tempVal)

            if arctanVal < 0.0: 
                arctanVal += (np.pi / 2.0) 
            sinVal = np.sin(arctanVal)
            cosVal = np.cos(arctanVal)
            sqrt2 = np.sqrt(2.0)

            sigXYSinCos = 2.0 * sigXY * sinVal * cosVal
            seX = (sqrt2 *
                   np.sqrt(((sigX * cosVal**2.0) - sigXYSinCos +
                            (sigY * sinVal**2.0)) / 
                            weightSum) * stdDev)

            seY = (sqrt2 *
                   np.sqrt(((sigX * sinVal**2.0) - sigXYSinCos +
                            (sigY * cosVal**2.0)) / 
                            weightSum) * stdDev)
            rotationFromNoon = 360.0 - (arctanVal * 57.2957795)
                 
            radianRotation1 = SU.convert2Radians(rotationFromNoon)

            
            #radianRotation2 = 360.0 - rotationFromNoon
            #if seX > seY:
            #    radianRotation2 += 90.0
            #    if radianRotation2 > 360.0:
            #        radianRotation2 = radianRotation2 - 180.0
            
            radianRotation1 = 3 

            georst = self.seXY2geojson(seX, seY, centers,\
                                       radianRotation1)
            return georst
        return 0

    def seXY2geojson(self, seX, seY, centers,\
                     radianRotation1):

                     
        xMean, yMean = centers        
        seX2 = seX**2.0    
        seY2 = seY**2.0
        
        geolist = []
        cosRadian = np.cos(radianRotation1)
        sinRadian = np.sin(radianRotation1)
        

        for degree in np.arange(0, 360):
            radians = SU.convert2Radians(degree)
            tanVal2 = np.tan(radians)**2.0
            dX = math.sqrt((seX2 * seY2) / (seY2 + (seX2 * tanVal2)))
            dY = math.sqrt((seY2 * (seX2 - dX**2.0)) / seX2 )

            if 90 <= degree < 180:
                dX = -dX
            elif 180 <= degree < 270:
                dX = -dX
                dY = -dY
            elif degree >= 270:
                dY = -dY

            dXr = dX * cosRadian - dY * sinRadian 
            dYr = dX * sinRadian + dY * cosRadian

            pntX = dXr + xMean
            pntY = dYr + yMean
            geolist.append([pntX, pntY])

        return SU.l2geojson([[geolist]])

if __name__ == '__main__':

    f = open('testfile/fl.txt')
    lines = f.readlines()
    f.close()
    import json
    geo = json.loads(lines[1].strip('/n'))
    mor = json.loads(lines[2].strip('/n'))
    mc = StandardEllipse(np.array(geo[0:5]),np.array(mor[0:5]))
    mc.controlFunc()
    print mc.get_StdEllipse()

