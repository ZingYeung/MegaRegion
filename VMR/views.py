from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from django.db.models import Q
from VMR.models import CommuteFlow,  MegaRegion
from VMR.utils import subsample_flows

# Create your views here.
def index(request):
    return render(request,'VMR/index.html')

# Create json of all commute flows
def all_flows(request):
    geo_json = serialize('geojson',
                         subsample_flows(CommuteFlow.objects.filter(distance__range=(8,160)),20000),
                         geometry_field='line',
                         fields=('dfips_comm',))
    return HttpResponse(geo_json, content_type='application/json')


# def mega_regions(request):
#     geo_json = serialize('geojson',
#                          MegaRegion.objects.filter(max_distance=80).order_by('name'),
#                          geometry_field='convex_hull',
#                          fields=('code','name',))
#     return HttpResponse(geo_json, content_type='application/json')

def mega_regions(request, max_distance):
    geo_json = serialize('geojson',
                         MegaRegion.objects.filter(max_distance=max_distance).order_by('name'),
                         geometry_field='convex_hull',
                         fields=('code','name',))
    return HttpResponse(geo_json, content_type='application/json')

def detail_statistics(request):
    return HttpResponse()