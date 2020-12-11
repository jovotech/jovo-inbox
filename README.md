### Install Jovo-Inbox


### Install services
Run setup (installs dependecies for `/core` `/api` and `/frontend`)

```
$ npm run setup

or

$ npm run setup:core
$ npm run setup:api
$ npm run setup:frontend
```

Create `.env` file in `/api` with the following attributes:

```
INBOX_MYSQL_DATABASE=
INBOX_MYSQL_USER=
INBOX_MYSQL_PASSWORD=
INBOX_MYSQL_HOST=
```


### Start services

#### API service
```
$ cd api
$ npm run start:dev
```

#### Frontend

```
$ cd frontend
$ npm run serve
```



Open  http://localhost:8080