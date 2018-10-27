library(spdep)
library(DCluster)
kn <- function(pop, case, alpha_i, x_cor, y_cor, fractpop_num=.5, bootstrap_num=100, model_u="poisson"){
    #K&N's method over the centroids
    pop <- as.numeric(pop)
    case <- as.numeric(case)
    dise.data<-data.frame(Observed=case)
	dise.data<-cbind(dise.data, Expected=pop*sum(case)/sum(pop))
	dise.data<-cbind(dise.data, Population=pop, x=x_cor, y=y_cor)
    mle<-calculate.mle(dise.data, model=model_u)
    knresults<-opgam(data=dise.data, thegrid=dise.data[,c("x","y")], alpha=alpha_i, iscluster=kn.iscluster, fractpop=fractpop_num, R=bootstrap_num, model=model_u, mle=mle)
    return(knresults)
    }
