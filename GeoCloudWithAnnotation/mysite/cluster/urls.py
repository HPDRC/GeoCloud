from django.conf.urls import patterns, url

#Regular expression, 'r':raw; (?p<name>...):name for a group; '^':begin; '$': end; 
#'+':repeat multiple times; 'd':num; 'hotspot':method name in the view.py
urlpatterns = patterns('cluster.views',
    url(r'^/hotspot/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<calccol>[A-Za-z_]+)/$', 'hotspot'),
    url(r'^/ClusterandOuter/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<calccol>[A-Za-z_]+)/$', 'ClusterandOuter'),
    url(r'^/Cluster/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<popcol>[A-Za-z0-9_]+)/(?P<casecol>[A-Za-z_]+)/$', 'Cluster'),
    
)
