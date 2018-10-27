from django.conf.urls import patterns, url

#Regular expression, 'r':raw; (?p<name>...):name for a group; '^':begin; '$': end;
#'+':repeat multiple times; 'd':num; 'meanctr':method name in the view.py
urlpatterns = patterns('geodistribution.views',
    url(r'^/meanctr/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/$', 'meanctr'),
    url(r'^/medianctr/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/$', 'medianctr'),
    url(r'^/stddst/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/(?P<std>\d\.0)/$', 'stdDistance'),
    url(r'^/trends/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<wghcol>[A-Za-z_]+)/(?P<std>\d\.0)/$', 'distributionTrends'),
    #url(r'^/', 'dowork'),
)
