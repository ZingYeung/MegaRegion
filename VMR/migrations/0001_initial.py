# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-24 14:39
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CommuteFlow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ofips', models.CharField(max_length=12)),
                ('dfips', models.CharField(max_length=12)),
                ('ostfips', models.IntegerField(verbose_name='2 Digit Origin State FIPS Code')),
                ('octfips', models.IntegerField(verbose_name='3 Digit Origin County FIPS Code')),
                ('otrfips', models.IntegerField(verbose_name='6 Digit Origin Census Tract FIPS Code')),
                ('dstfips', models.IntegerField(verbose_name='2 Digit Destination State FIPS Code')),
                ('dctfips', models.IntegerField(verbose_name='3 Digit Destination County FIPS Code')),
                ('dtrfips', models.IntegerField(verbose_name='6 Digit Destination Census Tract FIPS Code')),
                ('flow', models.IntegerField(verbose_name='Total Num Of Commute Flow Line')),
                ('moe', models.IntegerField(verbose_name='Margin Of Error')),
                ('distance', models.FloatField(verbose_name='Distance In KM')),
                ('ofips_comm', models.IntegerField(verbose_name='10 Digit Origin Community FIPS Code')),
                ('dfips_comm', models.IntegerField(verbose_name='10 Digit Destination Community FIPS Code')),
                ('line', django.contrib.gis.db.models.fields.LineStringField(srid=5070)),
            ],
        ),
    ]