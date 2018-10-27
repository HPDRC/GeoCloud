from django.conf.urls import patterns, include, url
#from mysite.views import regression, meancenter

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    ('^analysis/regression', include('regression.urls')), #include the urls.py in the regression 
    ('^analysis/map', include('map.urls')),
    ('^analysis/cluster', include('cluster.urls')),
    ('^analysis/geodistribution', include('geodistribution.urls')),
    ('^analysis/surveillance', include('surveillance.urls')),
    ('^analysis/crimemapping', include('crimemapping.urls')),
)
