import numpy as np
import sys
import os
import pdb
import scipy.stats as Stats
import json
from rpy2 import robjects
sys.path.append('/'.join(os.path.abspath(__file__).split('/')[:-3] + ['lib']))
import WghUtilities as WU
import SatUtilities as SU

fileDir = '/'.join(os.path.abspath(__file__).split('/')[:-1] + ['Rcode/'])
fnm =  fileDir + 'autoregression.R'

class autoRegression:
    def __init__(self, coords, xVal, yVal, colnm=[]):
        self.coords = coords
        self.yVal = yVal
        self.xVal = xVal
        self.colnm = colnm
        self.m = len(coords)
        self.mx = None
        self.rst_json = None
        self.autoRegressiongeojson = None
        r = robjects.r
        self.s = r.source(fnm)
   
    def num2Rlist(self, yVal, xVal):

        #yVector = self.FloatV([y[0] for y in yVal])
        yVector = self.FloatV([y[0] for y in yVal])
        length_x = len(xVal[0])
        parameters = robjects.r.vector(mode="list", length=length_x+1) 
        parameters[0] = yVector
        name_l = ['y']

        for i in range(length_x):
            #parameters[i+1] = self.FloatV([x[i] for x in xVal])
            parameters[i+1] = self.FloatV([x[i] for x in xVal])
            name_l.append('x_%d' %i)

        name_str = self.StringV(name_l) 
        formula = '%s~%s' %(name_l[0], '+'.join(name_l[1:]))
        return parameters, formula, name_str

    def controlFunc(self):

        if not self.m:
            #error message
            return 0
        wgh = WU.weight(self.coords)
        self.mx = wgh.calcWeightMatrix(1)
        mrn = range(1,self.m+1)    
        res = self.mx2res(self.mx) 
        par, formula, name_str = self.num2Rlist(self.yVal, self.xVal)

        rst = self.s[0](res,self.intV(mrn), self.m, par, formula, name_str)
        self.rst2json(rst)
        
    def rst2json(self, rst):

        rho = rst[1][0]

        formul = '%s = %f*W*%s' %(self.colnm[0], rho, self.colnm[0])
        coeff = rst[0]
        i = 1
        for x in self.colnm[1:]:
            x_str = '+ %.10f*%s' %(coeff[i], x) 
            formul += x_str         
            i += 1
        formul += '+ %f' % coeff[0] 

        s2 = rst[2][0]
        Aic = rst[4][0]
        Aic_lm = rst[4][1]
        Lr = rst[6][0][0]
        Lrp = rst[6][2][0]
        Wald = rst[5][0][0]
        Waldp = rst[5][2][0]
        LMtest = rst[3][0] 
        LMp = rst[3][1] 
        rst_str = ' The model is %s\n\
                    Rho: %.5f, Residual Variance: %.5f \n\n\
                    Wald test(If the Rho could be zero):\n\
                    \tWald statistic: %.5f, p-value: %.5f\n\n\
                    AIC for Linear Regression: %.5f\n\
                    AIC for lag model: %.5f\n\
                    LR test(Likelihood Ratio diagnostics for spatial dependence):\n\
                    \tLR test value: %.5f, p-value: %.5f\n\n\
                    LM test for absence of spatial autocorrelation in lag model residuals:\n\
                    \tLM test value: %.5f, p-value: %.5f' %(formul, rho, s2,\
                    Wald, Waldp, Aic_lm, Aic, Lr, Lrp, LMtest, LMp)
        self.rst_json = json.dumps({'rst':rst_str })                

    def mx2res(self, mx):

        wghl = robjects.r.vector(mode="list", length=self.m+1) 
        for index, neighbors in mx.neighbors.items():  
            wghl[index] = self.intV([ n+1 for n in neighbors])
        return wghl            

    def get_autoRegression(self):
        return self.rst_json        

    def listV(self, L):
        return robjects.ListVector(L)

    def robjVector(self, L):
        return robjects.ListVector(L)

    def intV(self, L):
        return robjects.IntVector(L)

    def FloatV(self, L):
        return robjects.FloatVector(L)

    def StringV(self, L):
        return robjects.StrVector(L)

if __name__ == '__main__':
    f = open('test/testfile')
    lines = f.readlines()
    import json
    listWKT = [item[0].decode('utf8') for item in json.loads(lines[0])]
    xval = json.loads(lines[1]) 
    yval = json.loads(lines[2]) 
    
    mc = autoRegression( listWKT, xval, yval,['y','x1','x2'])
    mc.controlFunc()
    print mc.get_autoRegression()

