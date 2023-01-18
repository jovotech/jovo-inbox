# Jovo Inbox

## Installation
### Install Services

Run setup (installs dependencies for `/core` `/api` and `/frontend`):

```
$ npm run setup

or

$ npm run setup:core
$ npm run setup:api
$ npm run setup:frontend
```


* Copy the `.env.example` file and rename it to `.env`



### Start Services

Start the API service:

```
$ cd api
$ npm run start:dev
```

Start the frontend:

```
$ cd frontend
$ npm run serve
```


Then open  http://localhost:8080

### Connect to Jovo App

Install the Jovo Inbox plugin as explained here: https://github.com/jovotech/jovo-framework/tree/master/jovo-integrations/jovo-plugin-inbox



### Deploy on server 

#### Requirements
* Server with at least 2gb of RAM

This is not the best way, but sufficient for the beginning. Better approaches will follow.

Copy `.env.example`, rename it to `.env.production`.
```
cd /frontend
cp .env.example .env.production
```

Change the `VUE_APP_BACKEND_URL` env variable to
`http://<MY_SERVER>:4000/api`

Build the frontend files into `api/public/client` 

```shell
cd /frontend
npm run build
```

Run the api and open `http://<MY_SERVER>:4000`

```shell
cd /api
npm start
```


### Basic Auth
Uncomment `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` in `/api/.env` to provide 
basic authentication



### CSV Export

Logs can be exported in csv format calling this api url: 

`http://localhost:4000/api/inboxlog/export?appId=<APP_ID>&from=2021-11-23&to=2021-11-24`

Available query params:
* appId: App ID defined in `inbox.config.ts`
* from: Timestamp `YYYY-MM-DD`
* to: Timestamp `YYYY-MM-DD`

Structure of the exported columns:
`userId`, `userSaid`, `botSaid`, `intent`, `timestamp`

### Run Docker image on Ubuntu

1. Install Docker on Ubuntu: https://docs.docker.com/engine/install/ubuntu/
```shell
$ sudo apt-get update
$ sudo apt-get install \
   ca-certificates \
   curl \
   gnupg \
   lsb-release
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
  
```
2. Clone repository (e.g. /opt)
```shell
$ cd /opt
$ git clone https://github.com/jovotech/jovo-inbox.git
```
3. Change owner of the folder
```shell
$ sudo chown -R $USER:$USER /opt/jovo-inbox
```
4. Create .env file in project folder
```shell
$ cd /opt/jovo-inbox
$ cp .env.example .env
```
5. Edit .env file
```shell
NODE_ENV=production

MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=jovoinbox
MYSQL_PASSWORD=
MYSQL_DATABASE=jovoinbox


MYSQL_USER_PASS=pass123
MYSQL_ROOT_PASSWORD=pass123

VUE_APP_BASE_APP_URL=https://my-domain.com
```
6. Install Letsencrypt
```shell
$ sudo apt install certbot python3-certbot-nginx
```
7. Create certificate for domain
```shell
$ sudo systemctl start nginx
$ sudo certbot --nginx -d my-domain.com
$ sudo systemctl stop nginx
```
8.Run docker container
```shell
$ sudo docker-compose up -d
```





