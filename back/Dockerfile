
FROM python:3.8
ENV PYTHONUNBUFFERED=1

WORKDIR /app/back
COPY requirements.txt .
RUN apt-get update
RUN pip install -r requirements.txt

COPY . .
RUN python3 build_repo.py data embed cats profiles viz
COPY . .

