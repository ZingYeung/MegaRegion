from django.conf.urls import url
from . import views

app_name = 'VMR'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^all_flows.json', views.all_flows_json, name='all_flows_json'),
]
