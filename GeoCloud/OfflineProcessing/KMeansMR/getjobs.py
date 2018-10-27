#!/usr/bin/env python
#coding: utf-8

import pymssql
import os

# ! trailing slash required
DATADIR='/tmp/'
SCRIPTDIR='/disk/tf-hadoop/geocloud-clustering/KMeansMR/'

conn = pymssql.connect(host='131.94.133.239', user='geocloudadmin', password='geocloudadmin', database='geo_cloud', as_dict=True)
conn.autocommit(True)
cur = conn.cursor()
cur.execute('select top 1 * from offline_jobs j, dataset_info i where j.dataset_id=i.id and status=0 and analysis=\'kmeans\' order by job_id')

for row in cur:

    try:
        if row['analysis'] != 'kmeans':
            continue

        # dump data to local file
        datacur = conn.cursor()
        datacur.execute('select id, %s.STX as lon, %s.STY as lat from %s' % (row['geo_col_name'], row['geo_col_name'], row['table_name']))

        f = open(DATADIR + row['job_key'] + '.input', 'w')
        for datarow in datacur:
            f.write('%s,%s,%s\n' % (datarow['id'], datarow['lon'], datarow['lat']))
        f.close()

    except Exception, e:
        resultcur = conn.cursor()
        resultcur.execute('update offline_jobs set status=-1 where job_id=%d' % (row['job_id']))
        print str(e)
        continue

    print "Fetched data for job ID=%d, Key=%s" % (row['job_id'], row['job_key'])

    try:

        # run task scheduling script
        # run_job.sh <key> <datafile_path> <number_of_clusters>

        print SCRIPTDIR + 'run_job.sh %s %s %s' % (row['job_key'], DATADIR + row['job_key'] + '.input', row['parameters'])
        result = os.system(SCRIPTDIR + 'run_job.sh %s %s %s' % (row['job_key'], DATADIR + row['job_key'] + '.input', row['parameters']))

        resultcur2 = conn.cursor()
        if result == 0:
            # success
            print 'Job %s success!' % row['job_id']
            resultcur2.execute('update offline_jobs set status=1, finish_time=GetDate() where job_id=%d' % (row['job_id']))
        else:
            # fail
            print 'Job %s failed!' % row['job_id']
            resultcur2.execute('update offline_jobs set status=-1, finish_time=GetDate() where job_id=%d' % (row['job_id']))

        resultcur2.close()
    except Exception, e:
        print str(e)
        pass

conn.close()

