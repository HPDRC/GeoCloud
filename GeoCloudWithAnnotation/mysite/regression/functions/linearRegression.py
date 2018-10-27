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
fnm =  fileDir + 'lmregression.R'

class lmRegression:
    def __init__(self, coords, xVal, yVal, colnm=[]):
        self.coords = coords
        self.yVal = yVal
        self.xVal = xVal
        self.numx = len(colnm)-1
        self.colnm = colnm
        self.m = len(coords)
        self.mx = None
        self.rst_json = None
        self.lmRegressiongeojson = None
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
            parameters[i+1] = self.FloatV([x[i] for x in xVal])
            name_l.append('x_%d' %i)

        name_str = self.StringV(name_l) 
        x_formula = '+'.join(name_l[1:])
        formula = '%s~%s' %(name_l[0], x_formula )
        bpformula = '%s ~ 1 + error + %s' %(x_formula, x_formula)
        return parameters, formula, name_str, bpformula

    def controlFunc(self):

        if not self.m:
            #error message
            return 0
        wgh = WU.weight(self.coords)
        self.mx = wgh.calcWeightMatrix(1)
        mrn = range(1,self.m+1)    
        res = self.mx2res(self.mx) 
        par, formula, name_str, bpformula = self.num2Rlist(self.yVal, self.xVal)

        rst = self.s[0](res,self.intV(mrn), self.m, par, formula, name_str, bpformula, self.numx)
        self.rst2json(rst)
        
    def rst2json(self, rst):

        formul = '%s = ' %(self.colnm[0])
        coeff = rst[0]
        i = 1
        for x in self.colnm[1:]:
            if i == 1:
                x_str = ' %.10f*%s ' %(coeff[i], x) 
            else:
                x_str = '+ %.10f*%s ' %(coeff[i], x) 
            formul += x_str         
            i += 1
        formul += '+ %f' % coeff[0] 
        
        sigma = rst[1][0]
        Aic = rst[2][0]
        Rsquare = rst[3][0]
        adjRsquare = rst[3][1]
        fstatistic = rst[4][0]
        jbtest = rst[5][0]
        pjbtest = rst[5][1]
        bptest = rst[6][0][0]
        pbptest = rst[6][1][0]
        vif = rst[7]
        i = 1
        vif_str = ''
        if self.numx != 1:
            for vif_v in vif:
                vif_str += '%s: %f,' %(self.colnm[i], vif_v)
                i += 1
        else:
            vif_str = 'Can not do vif test on one explanatory variable'
            
        mi = rst[8][2][0]
        miz = rst[8][0][0]
        pmiz = rst[8][1][0]

        rst_str = ' The model is %s\n\
                    Residual Standard Deviation: %.5f \n\n\
                    AIC for Linear Regression: %.5f\n\
                    Multiple R-squared: %.5f, Adjusted R-squared: %.5f\n\
                    F-statistic: %.5f\n\
                    JB(Jarque.Bera test) test for residual:\n\
                    \tJB-statistic: %.5f, p-value: %.5f\n\
                    Breusch-Pagan test for hetroscedasticity:\n\
                    \tBP: %.5f, p-value: %.5f\n\
                    VIF test: %s\n\
                    global Moran\'s I for regression residuals:\n\
                    \tObserved Moran\'s I: %.5f,\n\
                    \tMoran I statistic standard deviate = %.5f, p-value = %.5f'\
                    %(formul, sigma, Aic, Rsquare, adjRsquare\
                    , fstatistic, jbtest, pjbtest, bptest, pbptest\
                    , vif_str, mi, miz, pmiz)
        self.rst_json = json.dumps({'rst':rst_str })                

    def mx2res(self, mx):

        wghl = robjects.r.vector(mode="list", length=self.m+1) 
        for index, neighbors in mx.neighbors.items():  
            wghl[index] = self.intV([ n+1 for n in neighbors])
        return wghl            

    def get_lmRegression(self):
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
    
    mc = lmRegression(listWKT, xval, yval,['y','x1','x2'])
    mc.controlFunc()
    print mc.get_lmRegression()

