import {JovoUser} from "jovo-framework";

export interface Db {

}

export type DataEntryType = 'request' | 'response' | 'error' | 'custom';

export interface DataEntryPayload {

}

export interface DataEntry {
    timestamp: string;
    type: DataEntryType;
    appId: string;
    userId: string;
    requestId: string;
    sessionId: string;
    locale: string;
    payload: any;
}



export interface JovoUserDb {
    init(): Promise<void>;
    save(user: JovoUser): Promise<void>;
    load(userId: string): Promise<JovoUser>;
    delete(user: JovoUser): Promise<void>;
}

export interface JovoInboxDb {
    init(): Promise<void>;
    add(dataEntry: DataEntry): Promise<void>;
}