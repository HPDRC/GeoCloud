from django.conf.urls import patterns, url

urlpatterns = patterns('regression.views',
    url(r'^/spatialauto/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z_]+)/(?P<xcol>[A-Za-z_]+(&[A-Za-z_]+)*)/$', 'spatialauto'),
    url(r'^/errorauto/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z_]+)/(?P<xcol>[A-Za-z_]+(&[A-Za-z_]+)*)/$', 'errorauto'),
    url(r'^/linear/(?P<dataset>\d+)/(?P<usegeocol>\d)/(?P<ycol>[A-Za-z_]+)/(?P<xcol>[A-Za-z_]+(&[A-Za-z_]+)*)/$', 'linearrgrs'),
)
