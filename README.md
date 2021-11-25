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

In `/api` , do 2 things:

* Copy `inbox.config.example.ts` and rename it to `inbox.config.ts`
* Copy the `.env.example` file and rename it to `.env`

You can add your first app by updating the `.env` file:

```
APP1_NAME=
APP1_ID=
APP1_DB_TYPE=mysql
APP1_DB_HOST=
APP1_DB_USER=
APP1_DB_PASSWORD=
APP1_DB_DATABASE=
```

More apps can be added in the `inbox.config.ts` file.

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









