from django.conf.urls import patterns, url

urlpatterns = patterns('crimemmaping.views',
    url(r'^/map/(?P<dataset>\d+)/(?P<lat>[A-Za-z_]+)/(?P<lon>[A-Za-z_]+)+$', 'cimemap'),
    #url(r'^/', 'dowork'),
)
