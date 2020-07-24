#!/usr/bin/env python

import argparse
import sys
from io import BytesIO
import base64

import json

import chart as charts
import data_source as data_sources

chart_constructors = {
    'bar': charts.BarChart,
    'line': charts.LineChart,
    'scatter': charts.ScatterChart
}

group_by_functions = {
    'sum': lambda series_group_by: series_group_by.sum(),
    'max': lambda series_group_by: series_group_by.max(numeric_only=True),
    'min': lambda series_group_by: series_group_by.min(numeric_only=True),
    'prod': lambda series_group_by: series_group_by.prod(),
    'first': lambda series_group_by: series_group_by.first(),
    'last': lambda series_group_by: series_group_by.last(),
}


parser = argparse.ArgumentParser(
    formatter_class=lambda prog: argparse.HelpFormatter(prog, max_help_position=80, width=130)
)

parser.add_argument('--x-axis', help='Chart X axis', required=True)
parser.add_argument('--y-axis', help='Chart Y axis', required=True)
parser.add_argument('--url', help='Url of data')
parser.add_argument('--chart-type', help='Chart type', default='line', choices=['line', 'bar', 'scatter'])
parser.add_argument('--chart-name', help='Chart name', default='Chart name')
parser.add_argument('--chart-file-name', help='Chart file name')
parser.add_argument('--as-json', default=False, action='store_true', help='Print result as json')
parser.add_argument('--group-by', help='Print result as json')
parser.add_argument(
    '--group-by-func',
    help='Grouping function',
    choices=["sum", "prod", "min", "max", "first", "last"],
    default="sum"
)


args = parser.parse_args()

if args.chart_file_name is None:
    args.chart_file_name = args.chart_name

if args.chart_type not in chart_constructors:
    print('Tipo de gráfica inválido:', args.chart_type, file=sys.stderr, end='')
    sys.exit(1)

data_source = None
if args.url is not None:
    data_source = data_sources.UrlDataSource(args.url)
elif not sys.stdin.isatty():
    data_source = data_sources.StdinDataSource(sys.stdin.read())
else:
    print('Especifique una url o el contenido de los datos')
    sys.exit(1)

csv_data = data_source.get_data()

# Se comprueba si los campos seleccionados para los ejes están presentes en el header del csv
x_axis_name = args.x_axis.split(',')
y_axis_name = args.y_axis.split(',')

if len(x_axis_name) > 1 and len(y_axis_name) > 1:
    print('Sólo puede especificar múltiples campos para un eje')
    sys.exit(1)

for name in x_axis_name:
    if name not in csv_data.columns:
        print('Seleccione un valor del listado para X axis:', csv_data.columns.to_list(), file=sys.stderr, end='')
        sys.exit(1)

for name in y_axis_name:
    if name not in csv_data.columns:
        print('Seleccione un valor del listado para Y axis:', csv_data.columns.to_list(), file=sys.stderr, end='')
        sys.exit(1)


# Agrupación de los datos
group_by = None

if args.chart_type == 'scatter':
    group_by = args.group_by
else:
    group_by = x_axis_name[0]
    if len(x_axis_name) > 1:
        group_by = y_axis_name[0]

if group_by is not None:
    csv_data = group_by_functions[args.group_by_func](csv_data.groupby(group_by, as_index=False))


chartConstructor = chart_constructors.get(args.chart_type)
chart = chartConstructor(x_axis_name, y_axis_name, csv_data)
chartImage = chart.generate_chart(args.chart_name)

if args.as_json:
    imageFile = BytesIO()
    chartImage.savefig(imageFile, format='png', bbox_inches='tight')
    imageFile.seek(0)

    result = {
        'imageBase64': base64.b64encode(imageFile.getvalue()).decode('utf8'),
        'sourceData': json.loads(csv_data.to_json(orient='table'))
    }
    print(json.dumps(result), end='')

else:
    # Renderiza la imagen al completo (bbox_inches='tight') -> https://stackoverflow.com/a/39089653
    chartImage.savefig(args.chart_file_name, bbox_inches='tight')


