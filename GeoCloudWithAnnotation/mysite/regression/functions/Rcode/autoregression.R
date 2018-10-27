library(spdep)

sptial.auto.regression <- function(res, mrn, len_n, par, formula_str, name_str)
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
    rst.listw <- nb2listw(rst.gal.nb, zero.policy=T)
    names(par) <- name_str
    model.lag <- lagsarlm(as.formula(formula_str), data=par, rst.listw, tol.solve=1.0e-20, zero.policy=T)
    

    model.aic <- AIC(model.lag)
    model.Wald <- Wald1.sarlm(model.lag)
    model.lr <- LR1.sarlm(model.lag) 
    model.LMtest.pv <- (1 - pchisq(model.lag$LMtest, 1)) 

    model.lag.res <- vector(mode="list", length=7)
    model.lag.res[[1]] <- model.lag$coefficients 
    model.lag.res[[2]] <- model.lag$rho 
    model.lag.res[[3]] <- model.lag$s2 

    model.lag.res[[4]] <- c(model.lag$LMtest, model.LMtest.pv) 
    model.lag.res[[5]] <- c(model.aic, model.lag$AIC_lm.model) 
    model.lag.res[[6]] <- model.Wald 
    model.lag.res[[7]] <- model.lr 

    return(model.lag.res)


    #model.err <- errorsarlm(yval ~ xval,rst.listw)
    #summary(model.err)
}




