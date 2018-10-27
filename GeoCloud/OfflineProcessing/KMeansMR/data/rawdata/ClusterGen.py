#!/usr/bin/env python
#coding: utf-8

import sys
import random
import time
import hashlib
import math
import matplotlib.pyplot as plt

USAGE = '''
    Generate clusters in 2-D space
    
    Author: Yudong Guang
    Date:   Jan 22, 2014
    
    Parameters:
        @xrange: Integer
        @yrange: Integer
        @number_of_clusters: Integer
        @number_of_points: Integer
        @noise_number: Integer
    
    Output:
        A file containing records like:
        Id, x, y
    
    Example:
        python ClusterGen.py 100 100 4 500 50
'''

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def distance(self, op):
        return math.sqrt((self.x - op.x)*(self.x - op.x) + (self.y - op.y)*(self.y - op.y))

    def get_neighbor(self, rg):
        theta = random.randint(0, 360) * math.pi * 1.0/ 180
        return Point(self.x + random.choice(range(1, rg+1)) * math.cos(theta), self.y + random.choice(range(1, rg+1)) * math.sin(theta))
    
    def __str__(self):
        return '%d %d' % (self.x, self.y)

def out_of_range(p, xrg, yrg):
    if p.x < 0 or p.x > xrg or p.y < 0 or p.y > yrg:
        return True
    return False

def get_radius(centers, radius):

    for i, x in enumerate(centers):
        dist = []
        
        for j in range(len(centers)):
            if i != j:
                dist.append(centers[i].distance(centers[j]))
        
        radius.append(int(min(dist))/2)

def output(f, s):
    try:
        f.write('%s\n' % s)
    except:
        pass
        
if __name__ == "__main__":

    if len(sys.argv) != 6:
        print USAGE
        sys.exit(1)

    output_f = None
    try:
        # xrange, yrange, number of clusters, number of points, number of noise
        xrg, yrg, nc, np, nn = [int(i) for i in sys.argv[1:]]

        # generate finger print for file names
        fp = hashlib.md5(str(time.time())).hexdigest()
        output_f = open("data-%s.txt" % fp, "w")
        
        # generate centers and plot them
        centers = [Point(random.randint(0, xrg), random.randint(0, yrg)) for i in range(nc)]
        output(output_f, 'Centers')
        
        for i, c in enumerate(centers):
            plt.plot(c.x, c.y, 'ro')
            output(output_f, '%s,%s,%s' %(i, c.x, c.y))

        # radius of clusters, determined by the distance with its latest center
        radius = []
        get_radius(centers, radius)
        
        # begin generating
        output(output_f, 'Points')
        for i in range(np):
            c = random.choice(range(nc))
            p = centers[c].get_neighbor(radius[c])
            
            output(output_f, '%s,%s,%s,%d' %(i, p.x, p.y, c))
            plt.plot(p.x, p.y, 'g.')

        # generate noise
        noise = [Point(random.randint(0, xrg), random.randint(0, yrg)) for i in range(nn)]

        output(output_f, 'Noise')
        for i, j in enumerate(noise):
            output(output_f, '%s,%s,%s' %(i, j.x, j.y))
            plt.plot(j.x, j.y, 'b.')

        plt.xlabel("X")
        plt.ylabel("Y")
        
        # save the figure
        plt.savefig("data-%s.png" % fp)
        
        # show the plot
        plt.show()
        
        print 'Data stored to file: data-%s.txt.\nFigure stored to data-%s.png' % (fp, fp)
    except:
        if output_f is not None:
            output_f.close()