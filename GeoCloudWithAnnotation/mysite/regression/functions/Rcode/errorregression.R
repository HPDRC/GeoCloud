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
    model.error <- errorsarlm(as.formula(formula_str), data=par, rst.listw, tol.solve=1.0e-20, zero.policy=T)
    
    model.aic <- AIC(model.error)
    model.Wald <- Wald1.sarlm(model.error)
    model.lr <- LR1.sarlm(model.error) 

    model.error.res <- vector(mode="list", length=7)
    model.error.res[[1]] <- model.error$coefficients 
    model.error.res[[2]] <- model.error$lambda 
    model.error.res[[3]] <- model.error$s2 

    model.error.res[[4]] <- c(model.aic, model.error$AIC_lm.model) 
    model.error.res[[5]] <- model.Wald 
    model.error.res[[6]] <- model.lr 

    return(model.error.res)


    #model.err <- errorsarlm(yval ~ xval,rst.listw)
    #summary(model.err)
}




