# Generated by Django 3.2.13 on 2022-04-25 21:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_dailydata_fifteenminutedata_fourhourdata_onehourdata_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='OneMinuteData',
            new_name='ThreeMinuteData',
        ),
    ]
