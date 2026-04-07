import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';

const TABLE_NAME = 'SpeckledMenTable';

const client = new DynamoDBClient({
  endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8840',
  region: 'local',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
});

async function setup() {
  const tables = await client.send(new ListTablesCommand({}));
  if (tables.TableNames?.includes(TABLE_NAME)) {
    console.log(`Table "${TABLE_NAME}" already exists.`);
    return;
  }

  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' },
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'entityType', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI1',
          KeySchema: [
            { AttributeName: 'entityType', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    })
  );

  console.log(`Table "${TABLE_NAME}" created.`);
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
