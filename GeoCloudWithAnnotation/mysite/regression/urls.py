from django.conf.urls import patterns, url

urlpatterns = patterns('regression.views',
    url(r'^/spatialauto/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z0-9_]+)/(?P<xcol>[A-Za-z0-9_]+(&[A-Za-z0-9_]+)*)/$', 'spatialauto'),
    url(r'^/errorauto/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z0-9_]+)/(?P<xcol>[A-Za-z0-9_]+(&[A-Za-z0-9_]+)*)/$', 'errorauto'),
    url(r'^/linear/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z_]+)/(?P<xcol>[A-Za-z0-9_]+(&[A-Za-z0-9_]+)*)/$', 'linearrgrs'),
)
