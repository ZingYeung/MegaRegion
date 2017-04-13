from django.contrib.gis import admin
from .models import CommuteFlow, MegaRegion

admin.site.register(CommuteFlow, admin.OSMGeoAdmin)
admin.site.register(MegaRegion, admin.OSMGeoAdmin)