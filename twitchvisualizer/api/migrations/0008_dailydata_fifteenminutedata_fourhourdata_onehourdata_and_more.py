# Generated by Django 4.0.4 on 2022-04-22 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_delete_dailydata_delete_fifteenminutedata_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=250)),
                ('viewers', models.IntegerField()),
                ('channel_id', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': 'Daily Data',
            },
        ),
        migrations.CreateModel(
            name='FifteenMinuteData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=250)),
                ('viewers', models.IntegerField()),
                ('viewers_date', models.DateTimeField()),
                ('channel_id', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': 'Fifteen Minute Data',
            },
        ),
        migrations.CreateModel(
            name='FourHourData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=250)),
                ('viewers', models.IntegerField()),
                ('channel_id', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': '4 Hour Data',
            },
        ),
        migrations.CreateModel(
            name='OneHourData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=250)),
                ('viewers', models.IntegerField()),
                ('viewers_date', models.DateTimeField()),
                ('channel_id', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': 'Hourly Data',
            },
        ),
        migrations.CreateModel(
            name='OneMinuteData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=250)),
                ('viewers', models.IntegerField()),
                ('viewers_date', models.DateTimeField()),
                ('channel_id', models.IntegerField()),
            ],
            options={
                'verbose_name_plural': 'One Minute Data',
            },
        ),
    ]
