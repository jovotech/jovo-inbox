import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  DocumentClient,
  GetItemOutput,
  QueryInput,
  ScanInput,
} from 'aws-sdk/clients/dynamodb';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {}
}
