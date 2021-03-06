# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-04-13 22:05
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('VMR', '0002_auto_20170325_1809'),
    ]

    operations = [
        migrations.CreateModel(
            name='MegaRegion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.IntegerField(verbose_name='10 Digit MegaRegion Center FIPS Code')),
                ('name', models.CharField(max_length=50, verbose_name='Mega Region Name')),
                ('max_distance', models.FloatField(verbose_name='Max Distance of Flows contained')),
                ('cnt_flows', models.IntegerField(verbose_name='Numbers Of Flows Contained')),
                ('boundary', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
                ('convex_hull', django.contrib.gis.db.models.fields.PolygonField(srid=4326)),
            ],
        ),
    ]
