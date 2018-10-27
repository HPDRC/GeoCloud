from django.conf.urls import patterns, url

urlpatterns = patterns('geodistribution.views',
    url(r'^meanctr/(?P<dataset>\d+)/(?P<calccol>[A-Za-z]+)/(?P<wghcol>[A-Za-z]+)[/]+$', 'meanctr'),
    #url(r'^/', 'dowork'),
)
