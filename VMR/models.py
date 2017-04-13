from django.contrib.gis.db import models


# Create your models here.
class CommuteFlow(models.Model):
    # Regular Django fields corresponding to the attributes in the
    # commuter flow shapefile
    ofips = models.CharField(max_length=12)
    dfips = models.CharField(max_length=12)
    ostfips = models.IntegerField('2 Digit Origin State FIPS Code')
    octfips = models.IntegerField('3 Digit Origin County FIPS Code')
    otrfips = models.IntegerField('6 Digit Origin Census Tract FIPS Code')
    dstfips = models.IntegerField('2 Digit Destination State FIPS Code')
    dctfips = models.IntegerField('3 Digit Destination County FIPS Code')
    dtrfips = models.IntegerField('6 Digit Destination Census Tract FIPS Code')
    flow = models.IntegerField('Total Num Of Commute Flow Line')
    moe = models.IntegerField('Margin Of Error')
    distance = models.FloatField('Distance In KM')
    ofips_comm = models.IntegerField("10 Digit Origin Community FIPS Code")
    dfips_comm = models.IntegerField("10 Digit Destination Community FIPS Code")

    #GeoDjango-specific: a geometry field (LineStringField)
    line = models.LineStringField(srid=4326)

    # Returns the string representation of the model.
    def __str__(self):  # __unicode__ on Python 2
        return 'Flow %s : %s -> %s' % (self.id, self.ofips, self.dfips)

class MegaRegion(models.Model):
    code = models.IntegerField("10 Digit MegaRegion Center FIPS Code")
    name = models.CharField("Mega Region Name", max_length=50)
    max_distance = models.FloatField("Max Distance of Flows contained")
    cnt_flows = models.IntegerField("Numbers Of Flows Contained")
    # GeoDjango-specific: a geometry field (MutilPolygonField)
    # Boundary of Mega Region
    boundary = models.MultiPointField(srid=4326)
    # Convex Hull of Mega Region
    convex_hull = models.PolygonField(srid=4326)

    def __str__(self):
        return 'MegaRegion %s: %s %s <=%s' %(self.id, self.code, self.name, self.max_distance)