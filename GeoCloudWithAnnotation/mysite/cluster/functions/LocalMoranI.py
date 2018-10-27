import numpy as np
import sys
import os
import pdb
import scipy.stats as Stats
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import WghUtilities as WU
import SatUtilities as SU
import pysal


class LocalMoranI():
    def __init__(self, coords, yVal):
        self.coords = coords
        self.yVal = np.array([float(yv) for yv in yVal])
        self.m = len(coords)
        self.mx = None
        self.LocalMoranIgeojson = None
    
    def controlFunc(self):

        if not self.m:
            #error message
            return 0
        wgh = WU.weight(self.coords)
        self.mx = wgh.calcWeightMatrix(1)

        self.calcLocalMoranI(self.mx, self.yVal)
            
    def get_LocalMoranI(self):

        return self.LocalMoranIgeojson

    '''
    def calcLocalMoranI(self, mx, yVal):
        lenN = len(yVal)*1.0
        ySum = yVal.sum()
        yBar = ySum / lenN
        yDev = yVal - yBar

        lenNm1 = lenN-1

        lagVal2 = np.array([sum(yDev**2.0)]*int(lenN)) - yDev**2.0 

        S2 = lagVal2/lenNm1 - yBar**2.0 
     
        LMI = yDev/(S2*1.0)*(yDev*mx).sum(axis = 1)

        Ei = -1.*mx.sum(axis=1)/lenNm1 
        V4 = sum(yDev**4.0)
        V2 = sum(yDev**2.0)

        b2i = lenN*V4*1.0/(V2**2.0)*1.0
        wi2 = (mx**2.0).sum(axis=1)
        w2i = (mx.sum(axis=1))**2.0
        nm1nm2 = lenNm1*(lenN -2)
        Ei2 = (lenN - b2i)*wi2/lenNm1 + \
               (2*b2i - lenN)*(w2i - wi2)/nm1nm2
        Vi = Ei2 - Ei**2.0
        Zi = (LMI - Ei)*1.0/SU.Zero2Float(np.sqrt(Vi))
        pVal =[] 

        for g in Zi:
            if g >= 0.0:
                pVal.append((1 - Stats.zprob(g))*2)
            else:
                pVal.append(Stats.zprob(g)*2)
        self.LocalMoranIgeojson = self.change2geojson(self.coords, LMI,Zi , pVal) 
    '''

    def calcLocalMoranI(self, mx, yVal):
        lm = pysal.Moran_Local(yVal, mx)
        LMI = lm.Is
        pVal = lm.p_sim
        Zi = lm.z_sim
        self.LocalMoranIgeojson = self.change2geojson(self.coords, LMI,Zi , pVal) 

    def change2geojson(self, coords, lmiVal, zVal, pVal): 
        names = ['localMoranI', 'zval', 'pval']
        value = zip(lmiVal, zVal, pVal)
        geodata = SU.WKT2geojson(coords, names, value)
        return geodata
            


if __name__ == '__main__':
    f = open('testfile/Flrd.test')
    l = f.read()
    import json
    lloads = json.loads(l)
    listWKT = [item[0].decode('utf8') for item in lloads]

    mc = LocalMoranI(listWKT, [\
      0.70015753,  0.93385846,  1.1260911 ,  0.96184675,  1.25969471, 0.6701082,\
      1.07727664,  1.51119575,  1.62669572,  0.97324186, 0.76831824 ,1.37048193,\
      0.87077199,  1.51699029,  0.80503931,  0.90197085, 1.73608535 ,1.35476879,\
      0.55073078,  1.27418047,  1.02371609,  1.28518185, 0.         ,0.77897446,\
      0.58015858,  1.78392988,  1.62657218,  0.70696545, 0.97316124 ,1.33423317,\
      1.064706  ,  0.930166  ,  0.        ,  1.55607425, 1.03304829 ,0.46300583,\
      1.35168346,  0.        ,  1.11754546,  1.04674258, 1.5699822  ,1.30514226,\
      0.53330082,  0.77312427,  1.03378466,  0.70190033, 1.13058225 ,0.5935288 ,\
      0.5787337 ,  0.89194546,  1.33378632,  1.02245278, 1.14958469 ,1.16079744,\
      0.90974749,  1.3916863 ,  0.54119255,  1.00746151, 1.31538872 ,1.80644823,\
      1.31256784,  0.83892617,  2.48787956,  1.1609505 , 1.1440061  ,0.75159025,\
      1.06901565])    


    mc.controlFunc()
    print mc.get_LocalMoranI()

