#random data
year <- c(0)
infected <- c(0)

ram1 <- round(runif(52,min=0, max=100))
#sum.year <- 11795
#ram1_51 <- round(ram1[1:51]*(sum.year/sum(ram1)))
#ram1 <- c(ram1_51, sum.year-sum(ram1_51))
year_week <- c(rep(200401:200452))
year <- c(year_week)
infected <- c(ram1)

ram1 <- round(runif(52,min=0, max=100))
#sum.year <- 11878
#ram1_51 <- round(ram1[1:51]*(sum.year/sum(ram1)))
#ram1 <- c(ram1_51, sum.year-sum(ram1_51))
year_week <- c(rep(200501:200552))
year <- c(year, year_week)
infected <- c(infected, ram1)

ram1 <- round(runif(52,min=0, max=100))
#sum.year <- 11795
#ram1_51 <- round(ram1[1:51]*(sum.year/sum(ram1)))
#ram1 <- c(ram1_51, sum.year-sum(ram1_51))
year_week <- c(rep(200601:200652))
year <- c(year, year_week)
infected <- c(infected, ram1)

ram1 <- round(runif(52,min=0, max=100))
#sum.year <- 11547
#ram1_51 <- round(ram1[1:51]*(sum.year/sum(ram1)))
#ram1 <- c(ram1_51, sum.year-sum(ram1_51))
year_week <- c(rep(200701:200752))
year <- c(year, year_week)
infected <- c(infected, ram1)

ram1 <- round(runif(46,min=0, max=50))
ram1 <- c(ram1, round(runif(6,min=0, max=150)))
#sum.year <- 11800
#ram1_51 <- round(ram1[1:51]*(sum.year/sum(ram1)))
#ram1 <- c(ram1_51, sum.year-sum(ram1_51))
year_week <- c(rep(200801:200852))
year <- c(year, year_week)
infected <- c(infected, ram1)

data_yr <- data.frame(year=year, infected=infected)


data_yr$state <- c(0)
LungCancerOfFL <- create.disProg(week = 1:nrow(data_yr), 
        observed = data_yr$infected, state= data_yr$state,
                start = c(2001, 1))
                lungcancer.rst  <- algo.bayes(aggregate(LungCancerOfFL), control = list(range = 208:259, b=2, w = 6, alpha = 0.01))
                lungcancer.rst$upperbound <- c(lungcancer.rst$upperbound, lungcancer.rst$upperbound[52])
                s<-source("C:/working file/code/plotR.r")
                s$value(lungcancer.rst,firstweek = 1, startyear = 2008)
                #plot(lungcancer.rst, firstweek = 1, startyear = 2008)

                #write.table(data_yr, file="c:/Users/whb/Desktop/Fl_cancer", sep=",", col.names = NA)

