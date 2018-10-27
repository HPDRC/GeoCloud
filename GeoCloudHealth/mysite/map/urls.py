from django.conf.urls import patterns, url

urlpatterns = patterns('map.views',
    url(r'^/diseasemap/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<popcol>[A-Za-z_]+)/(?P<casecol>[A-Za-z_]+)/(?P<sitenm>[A-Za-z_]+)[/]+$', 'diseasemap'),
    url(r'^/smrmap/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<popcol>[A-Za-z_]+)/(?P<casecol>[A-Za-z_]+)/(?P<sitenm>[A-Za-z_]+)[/]+$', 'smrmap'),
    #url(r'^/', 'dowork'),
)
