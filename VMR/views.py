from django.shortcuts import render
from django.http import HttpResponse
from django.core.serializers import serialize
from django.contrib.gis import shortcuts
from django.contrib.gis.db.models.functions import AsKML
from VMR.models import CommuteFlow
import random

# Create your views here.
def index(request):
    return render(request,'VMR/index.html')

# Create json of all commute flows
def all_flows_json(request):
    geo_json = serialize('geojson',
                         subsample_flows(20000),
                         fields=("dfips_comm", "line"))
    return HttpResponse(geo_json, content_type='application/json')

# Subsampling commute flows
def subsample_flows(num_samples):
    ids = CommuteFlow.objects.filter(distance__range=(8,160)).values_list('id', flat=True)
    rand_ids = random.sample(list(ids), num_samples)
    return CommuteFlow.objects.filter(id__in=rand_ids)
