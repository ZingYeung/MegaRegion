from VMR.models import CommuteFlow, MegaRegion
import random
from django.contrib.gis.db.models import Collect

# Subsampling commute flows
def subsample_flows(flows, num_samples):
    ids = flows.values_list('id', flat=True)
    rand_ids = random.sample(list(ids), num_samples)
    return flows.filter(id__in=rand_ids)

# Delineate contour of mega region
def contour(code, max_distance):
    flows = CommuteFlow.objects.filter(dfips_comm=code, ofips_comm=code, distance__range=(8, max_distance))
    collect = flows.aggregate(Collect('line'))
    multilines = collect['line__collect']
    mr = MegaRegion(code=code, max_distance=max_distance, cnt_flows=flows.count(),
                   convex_hull=multilines.convex_hull, boundary=multilines.boundary)
    mr.save()
    print(mr)

# Delineate contour of all mega regions
def contour_all(max_distance, num_samples):
    codes = CommuteFlow.objects.values_list('dfips_comm', flat=True).distinct()
    # flows = subsample_flows(CommuteFlow.objects, num_samples)
    for code in codes:
        contour(code, max_distance)