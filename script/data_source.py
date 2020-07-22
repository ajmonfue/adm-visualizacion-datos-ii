import pandas as pandas
from io import StringIO
import ssl


class DataSource:
    def __init__(self, data):
        self.data = data

    def get_data(self):
        return pandas.read_csv(self.data)


class UrlDataSource(DataSource):
    def __init__(self, url):
        # ERROR urllib.error.URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED]
        #   certificate verify failed: unable to get local issuer certificate (_ssl.c:1123)
        # SOLUCION https://stackoverflow.com/a/52172355
        ssl._create_default_https_context = ssl._create_unverified_context

        # Obtener csv directamente desde url -> https://stackoverflow.com/a/41880513
        super().__init__(url)


class StdinDataSource(DataSource):
    def __init__(self, stdin_read):
        super().__init__(StringIO(stdin_read))
