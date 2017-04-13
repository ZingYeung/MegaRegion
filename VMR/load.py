import os
from django.contrib.gis.utils import LayerMapping
from django.contrib.gis.gdal import SpatialReference
from .models import CommuteFlow

vmr_mapping = {
    'ofips' : 'Ofips',
    'dfips' : 'Dfips',
    'ostfips' : 'Ostfips',
    'octfips' : 'Octfips',
    'otrfips' : 'Otrfips',
    'ostfips' : 'Ostfips',
    'dstfips' : 'Dstfips',
    'dctfips' : 'Dctfips',
    'dtrfips' : 'Dtrfips',
    'flow' : 'Flow',
    'moe' : 'Moe',
    'distance' : 'LenKM',
    'ofips_comm' : 'ofips_comm',
    'dfips_comm' : 'dfips_comm',
    'line' : 'LINESTRING',
}

vmr_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data',
'merged_ttw_v3_origin_and_dest_communities.shp'),
)

def run(verbose=True):
    lm = LayerMapping(
        CommuteFlow, vmr_shp, vmr_mapping,
        transform=True,
    )
    lm.save(strict=True, progress=5000,verbose=verbose)