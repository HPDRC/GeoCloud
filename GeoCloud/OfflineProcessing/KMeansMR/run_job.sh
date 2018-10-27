#!/bin/bash

if [ $# -lt 3 ]; then
    echo 'Usage: run_job.sh <key> <datafile_path> <number_of_clusters>'
    exit 1
fi

homedir=/geocloud/kmeans
numiter=4
jobkey=$1
jobhome=job_$jobkey
inputfile=$2
num_clusters=$3
center_iter=`expr $numiter - 1`

# create related hdfs directories
hadoop fs -rmr $homedir/$jobhome/*
hadoop fs -mkdir $homedir/$jobhome/input
hadoop fs -mkdir $homedir/$jobhome/currentCenter
hadoop fs -mkdir $homedir/$jobhome/nextCenter/iteration_0

# upload input file to hdfs
hadoop fs -put /tmp/${jobkey}.input $homedir/$jobhome/input

# create init center file
head -n $num_clusters $inputfile > /tmp/${jobkey}.centers

# upload init center file to hdfs
hadoop fs -put /tmp/${jobkey}.centers $homedir/$jobhome/nextCenter/iteration_0

# run map-reduce job
hadoop jar kmeansmr.jar adv.datamining.KMeansMR $homedir/$jobhome/input $homedir/$jobhome/output $numiter $homedir/$jobhome/currentCenter $homedir/$jobhome/nextCenter

# delete tmporary files
rm -if /tmp/${jobkey}.*
rm -if /tmp/.${jobkey}.*

# get job results
hadoop fs -getmerge $homedir/$jobhome/output${numiter}/ /tmp/${jobkey}.clusters
hadoop fs -getmerge $homedir/$jobhome/currentCenter/iteration_${center_iter}/ /tmp/${jobkey}.newcenters

echo -e "# Centers of clusters\n# format: clusterid,longitude,latitude\n\n" > /tmp/${jobkey}.csv
cat /tmp/${jobkey}.newcenters >> /tmp/${jobkey}.csv
echo -e "\n\n# The following are results of K-Means clustering\n# format: clusterid,record_id,longitude,latitude\n\n" >> /tmp/${jobkey}.csv
cat /tmp/${jobkey}.clusters | sed 's/\t/,/g' >> /tmp/${jobkey}.csv

# move results to db server
sudo mv /tmp/${jobkey}.csv /mnt/win/

# delete tmporary files
rm -if /tmp/${jobkey}.*
rm -if /tmp/.${jobkey}.*

# delete job files on hdfs
hadoop fs -rmr $homedir/$jobhome

