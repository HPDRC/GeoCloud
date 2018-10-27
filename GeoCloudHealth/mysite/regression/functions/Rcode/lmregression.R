library(spdep)
library(lmtest)
library(ccgarch)
library(HH)

sptial.auto.regression <- function(res, mrn, len_n, par, formula_str, name_str, bpformulastr, numx)
{
    res1 <- vector(mode="list", length=len_n)
    region.id <- as.character( 1:len_n )
    for ( i in 1:len_n ) {
        x <- res[i]
        if (any(is.na(x)) | (length(x) != length(res[i]))) {
            stop(paste("GAL file corrupted at region", i))
        }
        res1[[mrn[i]]] <- sort(as.integer(unlist(res[i])))

    }
    class(res1) <- "nb"
        attr(res1, "region.id") <- region.id
    attr(res1, "GeoDa") <- list(shpfile=as.character(NA), ind=as.character(NA))
    attr(res1, "gal") <- TRUE
    attr(res1, "call") <- TRUE
    rst.gal.nb <- sym.attr.nb(res1)
    rst.listw <- nb2listw(rst.gal.nb)

    names(par) <- name_str
    model.lm <- lm(as.formula(formula_str), data=par, x=TRUE)
    
    model.summary <- summary(model.lm)
    model.aic <- AIC(model.lm)
    model.Rsquare <- c(model.summary$r.squared, model.summary$adj.r.squared)
    model.fstatistic <- model.summary$fstatistic

    par$error <- model.lm$residuals
    model.jbtest <- jb.test(par$error) 
    model.bptest <- bptest(as.formula(bpformulastr), data=par)
    model.vif <- 0 
    if(numx != 1){
        model.vif <- vif(model.lm)
    }
    model.MI <- lm.morantest(model.lm, rst.listw)

    model.lm.res <- vector(mode="list", length=9)

    model.lm.res[[1]] <- model.lm$coefficients 
    model.lm.res[[2]] <- model.summary$sigma 
    model.lm.res[[3]] <- model.aic 
    model.lm.res[[4]] <- model.Rsquare
    model.lm.res[[5]] <- model.fstatistic 
    model.lm.res[[6]] <- model.jbtest 
    model.lm.res[[7]] <- model.bptest 
    model.lm.res[[8]] <- model.vif 
    model.lm.res[[9]] <- model.MI 

    return(model.lm.res)

}




