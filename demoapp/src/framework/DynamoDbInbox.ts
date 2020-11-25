import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import {
  BaseApp,
  Db,
  ErrorCode,
  Jovo,
  JovoError,
  Log,
  PluginConfig,
  HandleRequest,
} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import { DataEntry } from './interfaces';

export interface DynamoDbInboxConfig extends PluginConfig {
  tableName?: string;
  createTableOnInit?: boolean;
  partitionKeyColumn?: string;
  prefixPrimaryKeyWithPlatform?: boolean;
  sortKeyColumn?: string;
  dynamoDbConfig?: AWS.DynamoDB.Types.ClientConfiguration;
  documentClientConfig?: DocumentClient.DocumentClientOptions &
    AWS.DynamoDB.Types.ClientConfiguration;
  dax?: {
    endpoints?: string[];
    region?: string;
  };
  awsConfig?: AWS.DynamoDB.Types.ClientConfiguration;
}

export class DynamoDbInbox {
  config: DynamoDbInboxConfig = {
    awsConfig: undefined,
    createTableOnInit: true,
    documentClientConfig: {
      convertEmptyValues: true,
    },
    dynamoDbConfig: {},
    prefixPrimaryKeyWithPlatform: false,
    partitionKeyColumn: 'appId',
    sortKeyColumn: 'request',
    tableName: undefined,
  };
  dynamoClient?: AWS.DynamoDB;
  docClient?: AWS.DynamoDB.DocumentClient;
  isCreating = false;
  aws: any; // tslint:disable-line

  constructor(config?: DynamoDbInboxConfig) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.aws = AWS;

    if (this.config.awsConfig) {
      this.config.dynamoDbConfig = _merge(this.config.dynamoDbConfig, this.config.awsConfig);
      this.config.documentClientConfig = _merge(
        this.config.documentClientConfig,
        this.config.awsConfig,
      );
    }

    this.dynamoClient = new this.aws.DynamoDB(this.config.dynamoDbConfig);
    this.docClient = new this.aws.DynamoDB.DocumentClient(this.config.documentClientConfig);
  }
  errorHandling() {
    if (!this.config.tableName) {
      throw new JovoError(
        `Couldn't use DynamoDB. tableName has to be set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
    if (!this.docClient) {
      throw new JovoError(
        `Couldn't use DynamoDb. DocClient is not initialized.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
  }
  async add(dataEntry: DataEntry) {
    this.errorHandling();

    const partitionKey = dataEntry.appId;
    const sortKey = `${dataEntry.userId}#${dataEntry.sessionId}#${
      dataEntry.requestId
    }#${new Date().getTime()}`;

    const getDataMapParams: DocumentClient.PutItemInput = {
      Item: {
        [this.config.partitionKeyColumn!]: partitionKey,
        [this.config.sortKeyColumn!]: sortKey,
        payload: dataEntry.payload,
      },
      TableName: this.config.tableName!,
    };

    try {
      await this.docClient!.put(getDataMapParams).promise();
    } catch (err) {
      if (err.code === 'ResourceNotFoundException') {
        if (this.config.createTableOnInit) {
          await this.createTable();
        }
      } else {
        throw err;
      }
    }
  }

  async createTable() {
    if (!this.dynamoClient) {
      throw new JovoError(
        `Couldn't use DynamoDb. DynamoClient is not initialized.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }

    const newTableParams: AWS.DynamoDB.Types.CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: this.config.partitionKeyColumn!,
          AttributeType: 'S',
        },
        {
          AttributeName: this.config.sortKeyColumn!,
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: this.config.partitionKeyColumn!,
          KeyType: 'HASH',
        },
        {
          AttributeName: this.config.sortKeyColumn!,
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      TableName: this.config.tableName!,
    };

    try {
      const result = await this.dynamoClient!.createTable(newTableParams).promise();

      if (_get(result, 'TableDescription.TableStatus') === 'CREATING') {
        Log.info(Log.header('INFO: Jovo Inbox'));
        Log.info(`Creating DynamoDB table '${this.config.tableName}' for Jovo Inbox...!`);
        Log.info();
        Log.info('Table configuration:');
        Log.info(JSON.stringify(newTableParams, null, '\t'));

        Log.info(Log.header());

        this.isCreating = true;
      }

      // return result;
    } catch (err) {
      throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
    }
  }
}
