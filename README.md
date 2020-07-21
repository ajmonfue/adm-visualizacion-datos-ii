# Visualización de Datos I

## Enunciados
#### 1. Lee el documento ["Why scientists need to be better at data visualizationURL"](https://www.knowablemagazine.org/article/mind/2019/science-data-visualization) hasta la sección "Ruinous rainbows", esta última sección no incluida. Haz un resumen de no más de una página con las conclusiones que obtienes.
El ser humado es una criatura visual por naturaleza, por lo cual, procesa mejor la información que es acompañada de alguna representación visual (imágenes, gráficos...). Sin embargo, para ello, en el caso de la representación en gráficos, dicha información debe estar bien presentantada, es decir, con el tipo de correcto de gráficos (barras, líneas, puntos) acorde a la información, los colores adecuados... puesto que si no lo estuviera se podría transmitir información confusa o incorrecta a la que deseamos transmitir.

#### 2. En la sesión de teoría hemos analizado el portal Gapminder que proporciona información visual sobre muchas tematicas. Realiza una búsqueda en internet intentando localizar portales o frameworks de características similares, en los que grandes volúmenes de datos se muestren de manera gráfica/visual y con una perspectiva genérica.
Conocidas:

* Framework [TerriaJS](https://terria.io/). https://www.nationalmap.gov.au/
* [SiAR](https://siar.arte-consultores.com/#/visualizador)

Encontradas por internet:

* [Statista](https://es.statista.com/)
* [Google Public Data Explorer](https://www.google.com/publicdata/directory?hl=es)
* Framework [rawgraphs](https://rawgraphs.io/)
* [worldmapper](https://worldmapper.org/)

## Ejecución
Requerimientos:
* python >=3.7

1. Instalar dependencias mediante `pip3 install -r requirements.txt`.
2. Ejecutar programa mediante `python3 main.py <ARGUMENTOS>`
    ```
    $ python3 main.py --help
    usage: main.py [-h] --url URL --x-axis X_AXIS --y-axis Y_AXIS [--chart-type CHART_TYPE] [--chart-name CHART_NAME] [--chart-file-name CHART_FILE_NAME] [--base64]
    
    optional arguments:
      -h, --help            show this help message and exit
      --url URL             Url of data
      --x-axis X_AXIS       Chart X axis
      --y-axis Y_AXIS       Chart Y axis
      --chart-type CHART_TYPE
                            Chart type
      --chart-name CHART_NAME
                            Chart name
      --chart-file-name CHART_FILE_NAME
                            Chart file name
      --base64              Print image as base64
    ```

    Ejemplo:
    ```
    $ python3 main.py --url http://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-06-2020.csv --x-axis Province_State --y-axis Confirmed --chart-type line
    ```

## Docker
Construir la parte del cliente:
```bash
$ docker build -t adm-client -f client/etc/Dockerfile ./client
```

Construir la parte del servidor, con el script de python:
```bash
$ docker build -t adm-server -f server/etc/Dockerfile .
```

**Enlaces de interés**
* Github Packages para imágenes docker (https://docs.github.com/es/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages)