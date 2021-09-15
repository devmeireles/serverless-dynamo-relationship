import { DocumentClient } from "aws-sdk/clients/dynamodb";

let config = {}

if (process.env.IS_OFFLINE && process.env.stage.includes("dev") || process.env.NODE_ENV === 'test') {
    config = {
        region: 'sa-east-1',
        credentials: {
            accessKeyId: process.env.awsLocalDynammoAccessKey,
            secretAccessKey: process.env.awsLocalDynammoSecretAccessKey,
        }
    };
}

const client: DocumentClient = new DocumentClient(config);


export default {
    get: (params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> => client.get(params).promise(),
    put: (params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> => client.put(params).promise(),
    query: (params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> => client.query(params).promise(),
    update: (params: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> => client.update(params).promise(),
    delete: (params: DocumentClient.DeleteItemInput): Promise<DocumentClient.DeleteItemOutput> => client.delete(params).promise(),
    scan: (params: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput> => client.scan(params).promise(),
    scanRec: async (params: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput> => {
        //MEGA HACK: Handels the 1 mb limit, but can run out of memory on 6 mb. 
        //Stable workarounds could be a stepfunction or requestion less return items (or better datastructure ;) )
        //Be cautious with this function.
        let nextKey;
        let fullList = [];
        while (fullList.length >= 0) {
            const table = await client.scan({ ...params, ...(nextKey ? { ExclusiveStartKey: nextKey } : {}) }).promise();
            fullList = [...fullList, ...table.Items];
            if (table.LastEvaluatedKey) {
                nextKey = table.LastEvaluatedKey;
            } else {
                return { Items: fullList };
            }
        }
    },
};