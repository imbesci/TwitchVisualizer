# Generated by Django 4.0.4 on 2022-04-22 22:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_rename_stream_started_at_stream_stream_date'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DailyData',
        ),
        migrations.DeleteModel(
            name='FifteenMinuteData',
        ),
        migrations.DeleteModel(
            name='FourHourData',
        ),
        migrations.DeleteModel(
            name='OneHourData',
        ),
        migrations.DeleteModel(
            name='OneMinuteData',
        ),
    ]