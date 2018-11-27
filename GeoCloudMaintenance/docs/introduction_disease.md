# Disease Cluster and Mapping with R
By Huibo

## Content
* Disease cluster
* Methods (Disease cluster)
* Disease mapping
* Demo

## Disease Cluster
* **Input Data**
  * Longitude, Latitude
  * Case, Population
  * Method, Alpha
* **Output Data**
  * Cluster Information
  * Lat, Lon, Cluster, PValue, Statistic
* **Package:** Dcluster, rpy2(linux)
* **Language**
  * R
  * Python

## Method
* **Three Methods**
  * Openshaw's GAM method (Opgam)
  * Besag & Newell method (BN)
  * Kulldorff & Nagarwalla method (KN)
  
## Openshaw's GAM (Opgam)
* **Arguments:**
  1. The step of the grid
  2. Radius
* **Disadvantage:**
  1. Circles of the same size can refer to different sized population
  2. It does not account for multiple testing

![picture1](https://user-images.githubusercontent.com/44629798/49058763-6cc45600-f1d3-11e8-9ad0-e376e262f44b.png)

## Besag & Newell (BN)
* **Arguments:**
  1. Size of the cluster
* **Disadvantage:**
  1. The a priori choice of cluster size

![picture2](https://user-images.githubusercontent.com/44629798/49058764-6cc45600-f1d3-11e8-8d7d-fd69df07d3af.png)

## Kulldorff & Nagarwalla (KN)
* **Arguments:**
  1. Maximum fraction of the total population used when creating the balls

![picture3](https://user-images.githubusercontent.com/44629798/49058765-6cc45600-f1d3-11e8-8350-5238ca0c57a8.png)

![kn graph](https://user-images.githubusercontent.com/44629798/49058762-6cc45600-f1d3-11e8-9905-dadf4359bead.png)

## Disease Mapping
* **Input Data**
  * Longitude, Latitude
  * Case, Population
  * Method, Alpha
* **Output Data**
  * Lon, Lat, RR, Rrmed, SMR
* **R Package SpatialEpi**
* **SMR: Observed/Expected**
* **RR: Smooth results (Empirical Bayes Estimates)**
* **RRmed: Smooth results (gamma model)**

## DEMO