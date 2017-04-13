from VMR.models import CommuteFlow
from django.contrib.gis.db.models.functions import AsKML
from django.contrib.gis.shortcuts import compress_kml
from VMR.views import subsample_flows
import os

# Format KML of all commute flows
def format_all_flows():
    #subsample flows
    samples = subsample_flows(1000)
    # format styles
    mr_codes = CommuteFlow.objects.values_list('dfips_comm', flat=True).distinct()
    style_template = (
        '<Style id="{id}">\n'
        '        <LineStyle>\n'
        '            <color>#2E8B57</color>\n'
        '            <width>0.25</width>\n'
        '        </LineStyle>\n'
        '</Style>'
    )
    styles = "\n".join(style_template.format(id=mr_code) for mr_code in mr_codes)

    # format geometry objects
    flows_kml = samples.annotate(kml=AsKML('line')).values_list('dfips_comm', 'kml')
    flows_template = (
        '<Placemark>\n'
        '   <styleUrl>#{style_id}</styleUrl>\n'
        '   {flow}\n'
        '</Placemark>'
    )
    flows = "\n".join(flows_template.format(style_id=mr_code, flow=line) for (mr_code, line) in flows_kml)

    # format header and tail
    kml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<kml xmlns="http://www.opengis.net/kml/2.2">\n'
        '   <Document>\n'
        '       {styles}\n'
        '       {flows}\n'
        '   </Document>\n'
        '</kml>'
    ).format(styles=styles, flows=flows)
    return kml

def write_flows():
    kml = format_all_flows()
    file_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'static', 'VMR', 'kml',
                 'all_flows.kml'),)
    with open(file_path, 'w') as f:
        f.write(kml)

    file_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), 'static', 'VMR', 'kml',
                     'all_flows.kmz'), )
    with open(file_path, 'wb') as f:
        f.write(compress_kml(kml))