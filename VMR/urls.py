from django.conf.urls import url
from . import views

app_name = 'VMR'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^all_flows.json', views.all_flows, name='all_flows'),
    url(r'^mega_regions.json', views.mega_regions, name='mega_regions'),
    url(r'^mega_regions/(?P<max_distance>[0-9]+)/$', views.mega_regions, name='mega_regions'),
]
