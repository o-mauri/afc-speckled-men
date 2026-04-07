import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Player, Season, Match } from '../types';

const isLocal = process.env.LOCAL === 'true';

const client = new DynamoDBClient(
  isLocal
    ? { endpoint: process.env.DYNAMO_ENDPOINT || 'http://localhost:8840', region: 'local', credentials: { accessKeyId: 'local', secretAccessKey: 'local' } }
    : {}
);
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'SpeckledMenTable';

export async function putPlayer(player: Player): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `PLAYER#${player.id}`,
        SK: `PLAYER#${player.id}`,
        entityType: 'PLAYER',
        ...player,
      },
    })
  );
}

export async function getPlayer(id: string): Promise<Player | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: `PLAYER#${id}`, SK: `PLAYER#${id}` },
    })
  );
  return (result.Item as Player) || null;
}

export async function getAllPlayers(): Promise<Player[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'entityType = :et',
      ExpressionAttributeValues: { ':et': 'PLAYER' },
    })
  );
  return (result.Items as Player[]) || [];
}

export async function deletePlayer(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: `PLAYER#${id}`, SK: `PLAYER#${id}` },
    })
  );
}

export async function putSeason(season: Season): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `SEASON#${season.id}`,
        SK: `SEASON#${season.id}`,
        entityType: 'SEASON',
        ...season,
      },
    })
  );
}

export async function getSeason(id: string): Promise<Season | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: `SEASON#${id}`, SK: `SEASON#${id}` },
    })
  );
  return (result.Item as Season) || null;
}

export async function getAllSeasons(): Promise<Season[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'entityType = :et',
      ExpressionAttributeValues: { ':et': 'SEASON' },
    })
  );
  return (result.Items as Season[]) || [];
}

export async function deleteSeason(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: `SEASON#${id}`, SK: `SEASON#${id}` },
    })
  );
}

export async function deactivateAllSeasons(): Promise<void> {
  const seasons = await getAllSeasons();
  for (const season of seasons) {
    if (season.isActive) {
      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { PK: `SEASON#${season.id}`, SK: `SEASON#${season.id}` },
          UpdateExpression: 'SET isActive = :false',
          ExpressionAttributeValues: { ':false': false },
        })
      );
    }
  }
}

export async function putMatch(match: Match): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `SEASON#${match.seasonId}`,
        SK: `MATCH#${match.date}#${match.id}`,
        entityType: 'MATCH',
        ...match,
      },
    })
  );
}

export async function getMatch(seasonId: string, matchId: string, date: string): Promise<Match | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `SEASON#${seasonId}`,
        SK: `MATCH#${date}#${matchId}`,
      },
    })
  );
  return (result.Item as Match) || null;
}

export async function getMatchesBySeason(seasonId: string): Promise<Match[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `SEASON#${seasonId}`,
        ':sk': 'MATCH#',
      },
    })
  );
  return (result.Items as Match[]) || [];
}

export async function getAllMatches(): Promise<Match[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'entityType = :et',
      ExpressionAttributeValues: { ':et': 'MATCH' },
    })
  );
  return (result.Items as Match[]) || [];
}

export async function deleteMatch(seasonId: string, matchId: string, date: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `SEASON#${seasonId}`,
        SK: `MATCH#${date}#${matchId}`,
      },
    })
  );
}
