from django.conf.urls import patterns, url

urlpatterns = patterns('cluster.views',
    url(r'^/hotspot/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<calccol>[A-Za-z_]+)/$', 'hotspot'),
    url(r'^/ClusterandOuter/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<calccol>[A-Za-z_]+)/$', 'ClusterandOuter'),
    url(r'^/Cluster/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<popcol>[A-Za-z_]+)/(?P<casecol>[A-Za-z_]+)/$', 'Cluster'),
)
