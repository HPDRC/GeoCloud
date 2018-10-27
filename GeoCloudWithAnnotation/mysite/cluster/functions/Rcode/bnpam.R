library(spdep)
library(DCluster)
library(boot)

bn <- function(pop, case, alpha_i, x_cor, y_cor, knum, Rnum, model_u="poisson"){
    #K&N's method over the centroids
    pop <- as.numeric(pop)
    case <- as.numeric(case)
    dise.data<-data.frame(Observed=case)
	dise.data<-cbind(dise.data, Expected=pop*sum(case)/sum(pop))
	dise.data<-cbind(dise.data, x=x_cor, y=y_cor)
    bnresults<-opgam(data=dise.data, thegrid=dise.data[,c("x","y")], alpha=alpha_i, iscluster=bn.iscluster, k=knum, R=Rnum, model=model_u, 
	mle=calculate.mle(dise.data))
    return(bnresults)
    }
