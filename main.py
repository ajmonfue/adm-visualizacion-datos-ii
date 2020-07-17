#!/usr/bin/env python3

import argparse
import ssl
import pandas as pandas
import sys

import chart as charts

parser = argparse.ArgumentParser()
parser.add_argument('--url', help='Url of file', required=True)
parser.add_argument('--x-axis', help='Chart X axis', required=True)
parser.add_argument('--y-axis', help='Chart Y axis', required=True)
parser.add_argument('--chart-name', help='Chart name', default='Chart name')
parser.add_argument('--chart-file-name', help='Chart file name')

args = parser.parse_args()

if args.chart_file_name is None:
    args.chart_file_name = args.chart_name

# ERROR urllib.error.URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED]
#   certificate verify failed: unable to get local issuer certificate (_ssl.c:1123)
# SOLUCION https://stackoverflow.com/a/52172355
ssl._create_default_https_context = ssl._create_unverified_context

urlFile = args.url
# Obtener csv directamente desde url -> https://stackoverflow.com/a/41880513
csv_data = pandas.read_csv(urlFile)

# Se comprueba si los axis están presentes en el header del csv
if args.x_axis not in csv_data.columns:
    print('Seleccione un valor del listado para X axis:', csv_data.columns.values)
    sys.exit(1)

if args.y_axis not in csv_data.columns:
    print('Seleccione un valor del listado para Y axis:', csv_data.columns.values)
    sys.exit(1)

x_axis_name = args.x_axis
y_axis_name = args.y_axis

# TODO: suma, min, max?
csv_data = csv_data.groupby(x_axis_name, as_index=False).sum()

# Se obtiene el listado de valores de la columna asociada
x_axis = csv_data[x_axis_name].to_list()
y_axis = csv_data[y_axis_name].to_list()

chart = charts.LineChart(x_axis, y_axis, x_axis_name, y_axis_name)
chart.render(args.chart_name, args.chart_file_name)
