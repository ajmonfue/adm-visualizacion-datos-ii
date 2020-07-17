import argparse
import urllib.request
import ssl


parser = argparse.ArgumentParser()
parser.add_argument('--url', help='Url of file', required=True)
parser.add_argument('--x-axis', help='X axis')
parser.add_argument('--y-axis', help='Y axis')

args = parser.parse_args()

# ERROR urllib.error.URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED]
#   certificate verify failed: unable to get local issuer certificate (_ssl.c:1123)
# SOLUCION https://stackoverflow.com/a/52172355
ssl._create_default_https_context = ssl._create_unverified_context

urlFile = args.url


res = urllib.request.urlopen(urlFile)

http_message = res.info()
text = res.read()

print(text)
