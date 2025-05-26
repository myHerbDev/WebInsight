import { MongoClient, ServerApiVersion } from "mongodb"

// Check if MongoDB URI exists, but don't throw an error that would break the app
const uri = process.env.MONGODB_URI || ""
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client
let clientPromise: Promise<MongoClient>

// Create a mock client if no MongoDB URI is provided
if (!uri) {
  console.warn("No MongoDB URI provided. Using mock client.")

  // Create a mock client that won't actually connect
  const mockClient = {
    connect: () =>
      Promise.resolve({
        db: () => ({
          collection: () => ({
            insertOne: () => Promise.resolve({ insertedId: "mock-id" }),
            findOne: () => Promise.resolve(null),
            updateMany: () => Promise.resolve(),
            deleteOne: () => Promise.resolve(),
          }),
        }),
      }),
  } as unknown as MongoClient

  clientPromise = Promise.resolve(mockClient)
} else {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export default clientPromise
