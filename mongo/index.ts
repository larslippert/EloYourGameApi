import { MongoClient, ServerApiVersion } from "mongodb";
import { SimplePlayer } from "../data/simplePlayer";
import { SimpleGame, SimpleGameCreate } from "../data/simpleGame";

const mongoUsername = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD
const uri = "mongodb://"+mongoUsername+":"+mongoPassword+"@localhost:27017"
const dbName = "elo-your-game"
const playerCollectionName = "players"
const gamesCollectionName = "games"

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
}); 

export async function testMongo() {
  console.log("Testing MongoDB...")
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB: " + error);
  } finally {
    console.log("Closing mongo test connection...");
    await client.close();
  }
}

export async function insertPlayer(player: SimplePlayer) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(playerCollectionName);
    const result = await collection.insertOne(player);
    console.log("Inserted player with id: " + result.insertedId);
  } catch (error) {
    console.error("Error inserting player: " + error);
  } finally {
    await client.close();
  }
}

export async function insertGame(game: SimpleGameCreate): Promise<{ alreadyExists: boolean }> {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(gamesCollectionName);
    // Check if game name is unique
    const existingGame = await collection.findOne({ name: game.name });
    if (existingGame) {
      console.log("Game with name " + game.name + " already exists");
      return { alreadyExists: true };
    }
    const result = await collection.insertOne(game);
    console.log("Inserted game with id: " + result.insertedId);
    return { alreadyExists: false };
  } catch (error) {
    console.error("Error inserting game: " + error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function getPlayers() {
  let players: SimplePlayer[] = [];

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(playerCollectionName);
    const result = await collection.find().toArray();
    console.log("Found players: " + result);
    //players = result;
  } catch (error) {
    console.error("Error getting players: " + error);
    throw error;
  } finally {
    await client.close();
    //return players;
  }
}

export async function getGames(): Promise<SimpleGame[]> {
  let games: SimpleGame[] = [];

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(gamesCollectionName);
    const result = await collection.find().toArray();
    console.log("Found games: " + JSON.stringify(result));

    games = result.map(game => ({
      id: game._id.toString(),
      name: game.name.toString(),
      maxPlayersPerTeam: game.maxPlayersPerTeam,
      keepScore: game.keepScore
    }) as SimpleGame);
  } catch (error) {
    console.error("Error getting games: " + error);
    throw error;
  } finally {
    await client.close();
    return games;
  }
}