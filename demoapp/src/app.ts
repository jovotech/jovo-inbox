import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
// import { DynamoDb } from 'jovo-db-dynamodb';
import { FileDb } from 'jovo-db-filedb';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { JovoInboxPlugin } from './framework/JovoInbox';
dotenv.config({
  path: resolve(__dirname, '../../.env'),
});
// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb(),
  // new DynamoDb({
  //   awsConfig: {
  //     credentials: {
  //       accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  //     },
  //     region: process.env.AWS_REGION as string,
  //   },
  //   tableName: 'jovoinboxuserdb',
  // }),
  new JovoInboxPlugin({
    appId: process.env.APP_ID as string,
    db: {
      dbName: process.env.MYSQL_DATABASE as string,
      user: process.env.MYSQL_USER as string,
      password: process.env.MYSQL_PASSWORD as string,
      host: process.env.MYSQL_HOST as string,
    },
  }),
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Hello World! What's your name?", 'Please tell me your name.');
  },

  MyNameIsIntent() {
    this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
  },
});

export {app};