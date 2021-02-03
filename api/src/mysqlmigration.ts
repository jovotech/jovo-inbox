// import * as AWS from 'aws-sdk';
// import { QueryInput, ScanInput } from 'aws-sdk/clients/dynamodb';
// import * as dotenv from 'dotenv';
// import { EntityManager, MikroORM } from '@mikro-orm/core';
// import { InboxLogEntity, InboxLogType } from './entity/inbox-log.entity';
// import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
// import Key = DocumentClient.Key;
//
// dotenv.config();
// async function migrate() {
//   const data = await fetchData();
//
//   const orm = await MikroORM.init({
//     entities: [InboxLogEntity],
//     dbName: 'jovoinbox',
//     type: 'mysql',
//     host: 'localhost',
//     user: 'root',
//     password: '',
//   });
//
//   const logs: InboxLogEntity[] = [];
//   for (let i = 0; i < data.length; i++) {
//     const item = data[i];
//     const [userId, sessionId, requestId, timestampStr] = item.request.split(
//       '#',
//     );
//
//     const createdAt = new Date(Number(timestampStr));
//
//     const inboxLog = new InboxLogEntity();
//
//     inboxLog.appId = 'studios-nba-jovo-inbox';
//     inboxLog.createdAt = createdAt;
//     inboxLog.locale = 'en';
//     inboxLog.requestId = requestId;
//     inboxLog.sessionId = sessionId;
//     inboxLog.userId = userId;
//     inboxLog.type = item.payload.response
//       ? InboxLogType.RESPONSE
//       : InboxLogType.REQUEST;
//     inboxLog.payload = item.payload;
//
//     logs.push(inboxLog);
//     // await orm.em.persist(inboxLog);
//     await orm.em.transactional(async (em: EntityManager) => {
//       await em.persistAndFlush(inboxLog);
//     });
//   }
// }
//
// async function fetchData() {
//   const config = {
//     credentials: {
//       accessKeyId: process.env.JOVO_AWS_ACCESS_KEY_ID as string,
//       secretAccessKey: process.env.JOVO_AWS_SECRET_ACCESS_KEY as string,
//     },
//     region: process.env.JOVO_AWS_REGION as string,
//   };
//
//   const docClient = new AWS.DynamoDB.DocumentClient(config);
//
//   // const queryInput: QueryInput = {
//   //   TableName: 'studios-nba-jovo-inbox',
//   //
//   //   // AttributesToGet: ['request'],
//   //   KeyConditionExpression: 'appId = :appId',
//   //   // ExpressionAttributeNames: {
//   //   //   appId: ':appId',
//   //   // },
//   //   ExpressionAttributeValues: {
//   //     // @ts-ignore
//   //     ':appId': 'studios-nba',
//   //   },
//   //   ReturnConsumedCapacity: 'TOTAL',
//   // };
//   //
//   // const result = await docClient.query(queryInput).promise();
//
//   const fetch = async (lastEvaluatedKey?: Key) => {
//     const scanInput: ScanInput = {
//       TableName: 'studios-nba-jovo-inbox',
//       Limit: 1000,
//     };
//     if (lastEvaluatedKey) {
//       scanInput.ExclusiveStartKey = {
//         appId: lastEvaluatedKey.appId,
//         request: lastEvaluatedKey.request,
//       };
//     }
//     return await docClient.scan(scanInput).promise();
//   };
//
//   let items = [];
//   const result = await fetch();
//
//   items = items.concat(result.Items);
//   let lastEvaluatedKey = result.LastEvaluatedKey;
//
//   while (lastEvaluatedKey) {
//     console.log(lastEvaluatedKey);
//     const result = await fetch(lastEvaluatedKey);
//     items = items.concat(result.Items);
//     lastEvaluatedKey = result.LastEvaluatedKey;
//   }
//   return items;
// }
//
// migrate();
