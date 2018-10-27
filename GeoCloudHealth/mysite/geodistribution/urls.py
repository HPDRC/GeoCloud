from django.conf.urls import patterns, url

urlpatterns = patterns('geodistribution.views',
    url(r'^/meanctr/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/$', 'meanctr'),
    url(r'^/medianctr/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/$', 'medianctr'),
    url(r'^/stddst/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/(?P<std>\d\.0)/$', 'stdDistance'),
    url(r'^/trends/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/(?P<std>\d\.0)/$', 'distributionTrends'),
    #url(r'^/', 'dowork'),
)
