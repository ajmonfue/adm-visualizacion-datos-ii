#!/usr/bin/env python3

import argparse
import ssl
import pandas as pandas
import sys

import chart as charts

from io import BytesIO
import base64

parser = argparse.ArgumentParser()
parser.add_argument('--url', help='Url of data', required=True)
parser.add_argument('--x-axis', help='Chart X axis', required=True)
parser.add_argument('--y-axis', help='Chart Y axis', required=True)
parser.add_argument('--chart-type', help='Chart type', default='line')
parser.add_argument('--chart-name', help='Chart name', default='Chart name')
parser.add_argument('--chart-file-name', help='Chart file name')
parser.add_argument('--base64', default=False, action='store_true', help='Print image as base64')

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
    print('Seleccione un valor del listado para X axis:', csv_data.columns.to_list(), file=sys.stderr, end='')
    sys.exit(1)

if args.y_axis not in csv_data.columns:
    print('Seleccione un valor del listado para Y axis:', csv_data.columns.to_list(), file=sys.stderr, end='')
    sys.exit(1)

x_axis_name = args.x_axis
y_axis_name = args.y_axis

# TODO: suma, min, max?
csv_data = csv_data.groupby(x_axis_name, as_index=False).sum()

# Se obtiene el listado de valores de la columna asociada
x_axis = csv_data[x_axis_name].to_list()
y_axis = csv_data[y_axis_name].to_list()


chartConstructors = {
    'bar': charts.BarChart,
    'line': charts.LineChart,
    'point': charts.PointChart
}

if args.chart_type not in chartConstructors:
    print('Tipo de gráfica inválido:', args.chart_type, file=sys.stderr, end='')
    sys.exit(1)

chartConstructor = chartConstructors.get(args.chart_type)
chart = chartConstructor(x_axis, y_axis, x_axis_name, y_axis_name)
chartImage = chart.generate_chart(args.chart_name)

if args.base64:
    imageFile = BytesIO()
    chartImage.savefig(imageFile, format='png')
    imageFile.seek(0)

    # https://stackoverflow.com/a/31494954
    print(base64.b64encode(imageFile.getvalue()).decode('utf8'), end='')

else:
    chartImage.savefig(args.chart_file_name)

