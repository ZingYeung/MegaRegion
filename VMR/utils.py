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
    filter_cases = {
        3: (18, 21, 39, 54),
        6: (17, 18, 21, 39, 51, 54),
        12: (6, 41),
        19: (4, 35, 48),
        20: (21, 37, 47, 51, 54),
        25: (1, 12, 13, 28, 47),
        39: (6, 32),
        40: (1, 12, 13, 22, 28),
        41: (35, 48),
        47: (48,),
        51: (12, 13, 45),
        52: (4, 8, 35, 49),
        53: (8, 20, 35, 40, 48),
        54: (26, 55),
        55: (16, 41, 53)
    }
    split_cases = {
        12: (12, 51, 52),
        39: (39, 53),
        41: (41, 54, 55)
    }
    flows = CommuteFlow.objects.filter(dfips_comm=code, ofips_comm=code, distance__range=(8, max_distance))
    if code in split_cases.keys():
        for split in split_cases[code]:
            flows_split = flows.filter(
                dstfips__in=filter_cases[split],
                ostfips__in=filter_cases[split])
            collect = flows_split.aggregate(Collect('line'))
            multilines = collect['line__collect']
            mr = MegaRegion(code=split, max_distance=max_distance, cnt_flows=flows_split.count(),
                            convex_hull=multilines.boundary.convex_hull, boundary=multilines.boundary)
            mr.name = MegaRegion.objects.get(code=split, max_distance=160).name
            mr.save()
            print(mr)
    else:
        if code in filter_cases.keys():
            flows = flows.filter(dstfips__in=filter_cases[code],
                                ostfips__in=filter_cases[code])
        collect = flows.aggregate(Collect('line'))
        multilines = collect['line__collect']
        mr = MegaRegion(code=code, max_distance=max_distance, cnt_flows=flows.count(),
                       convex_hull=multilines.boundary.convex_hull, boundary=multilines.boundary)
        mr.name = MegaRegion.objects.get(code=code, max_distance=160).name
        mr.save()
        print(mr)

# Delineate contour of all mega regions
def contour_all(max_distance):
    codes = CommuteFlow.objects.values_list('dfips_comm', flat=True).distinct()
    # flows = subsample_flows(CommuteFlow.objects, num_samples)
    for code in codes:
        contour(code, max_distance)