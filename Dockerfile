FROM python:3.8.6-buster

WORKDIR /TwitchVisualizer

ENV PYTHONUNBUFFERED 1
ENV PORT=8000

RUN apt update
RUN apt-get install cron -y

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /TwitchVisualizer/

RUN mkdir cron
RUN touch cron/cronlog.log

WORKDIR /TwitchVisualizer/twitchvisualizer

EXPOSE 8000

CMD service cron start && python manage.py runserver 0.0.0.0:8000