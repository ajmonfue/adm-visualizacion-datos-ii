FROM nikolaik/python-nodejs:python3.8-nodejs12
WORKDIR /usr/src/server

COPY ./server/package.json ./
COPY ./server/package-lock.json ./
RUN npm install
COPY ./server ./
RUN npm run build

COPY ./script/requirements.txt ./script/requirements.txt
RUN pip install -r ./script/requirements.txt
COPY ./script ./script


ENV PORT=3000
ENV SCRIPT_PATH=./script/main.py
ENV PYTHON_COMMAND=python
EXPOSE 3000

CMD ["npm", "run", "start:prod"]