library(spdep)
library(DCluster)
pam <- function(pop, case, alpha_i, x_cor, y_cor){
	dise.data<-data.frame(Observed=case)
	dise.data<-cbind(dise.data, Expected=pop*sum(case)/sum(pop))
	dise.data<-cbind(dise.data, x=x_cor, y=y_cor)
	gam_rst<-opgam(data=dise.data,  radius=30, step=10, alpha=alpha_i)
	return(gam_rst)
	}
