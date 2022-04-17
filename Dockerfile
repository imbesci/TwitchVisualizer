FROM python:3.8-alpine3.10

WORKDIR /TwitchVisualizer

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT=8000

RUN apk update && apk add --update alpine-sdk

COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

RUN apk add --update npm

COPY . /TwitchVisualizer/

RUN npm install

WORKDIR /TwitchVisualizer/twitchvisualizer

EXPOSE 8000
CMD gunicorn twitchvisualizer.wsgi:application --bind 0.0.0.0:8000