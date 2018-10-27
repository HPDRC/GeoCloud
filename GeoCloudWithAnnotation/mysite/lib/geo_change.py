import geojson
import json
import pdb

#f = open('clusterinfo.txt')
#f = open('diseaseinfo.txt')
#f = open('AgeAndIncidence.txt')
f = open('diabetes.txt')
lines = f.readlines()
f.close()

features_l = []
#for line in lines:
#    line_str = line.strip('\n').split(',')
#    lon = float(line_str[1])
#    lat = float(line_str[2])
#    county = line_str[0]
#
#    p = geojson.Point([lon, lat])
#    f = geojson.Feature(geometry=p, properties={'county':county})
#    features_l.append(f)
#geodata = geojson.dumps(geojson.FeatureCollection(features=features_l))
#print geodata

    
#for line in lines[1:]:
#    line_str = line.strip().split('\t')
#    county = line_str[0]
#    type = line_str[1]
#    GEOM = json.loads(line_str[2])
#    population = int(line_str[3])
#    illness = int(line_str[4])
#    SMR = float(line_str[5])
#    mortality = float(line_str[6])
#    expected = int(float(line_str[7]))
#    if type == 'P':
#        p = geojson.Polygon(GEOM)
#    else:
#        p = geojson.MultiPolygon(GEOM)
#    f = geojson.Feature(geometry=p, properties={'county':county,'population':population,'illness':illness,'SMR':SMR,'mortality':mortality,'expected':expected})
#    features_l.append(f)
#geodata = geojson.dumps(geojson.FeatureCollection(features=features_l))
#print geodata

for line in lines[1:]:
    line_str = line.strip().split()
    county = line_str[0]
    type = line_str[1]
    GEOM = json.loads(line_str[2])
    age_Ad = float(line_str[3])
    incidence = float(line_str[4])
    if type == 'P':
        p = geojson.Polygon(GEOM)
    else:
        p = geojson.MultiPolygon(GEOM)
    f = geojson.Feature(geometry=p, properties={'county':county,'age_Ad':age_Ad,'incidence':incidence})
    features_l.append(f)
geodata = geojson.dumps(geojson.FeatureCollection(features=features_l))
print geodata
