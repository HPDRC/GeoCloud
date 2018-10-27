sink('R_output')
library(SpatialEpi)
sink()
dm <- function(pop, case){
	Expected=pop*sum(case)/sum(pop)
	rst <- eBayes(case, Expected)
	return(rst)
	}

