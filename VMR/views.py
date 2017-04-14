from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from VMR.models import CommuteFlow
from VMR.utils import subsample_flows

# Create your views here.
def index(request):
    return render(request,'VMR/index.html')

# Create json of all commute flows
def all_flows_json(request):
    geo_json = serialize('geojson',
                         subsample_flows(20000),
                         fields=("dfips_comm", "line"))
    return HttpResponse(geo_json, content_type='application/json')

