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

Create `.env` file in `/api` with the following attributes:

```
INBOX_MYSQL_DATABASE=
INBOX_MYSQL_USER=
INBOX_MYSQL_PASSWORD=
INBOX_MYSQL_HOST=
```

For other database configurations, take a look at the `inbox.config.ts` file in `src/api`.

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