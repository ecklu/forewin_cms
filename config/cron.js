const cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection string
//const mongoURI = 'mongodb+srv://johnecklu:sample@cluster0.ingx5.mongodb.net/forewin';
const mongoURI = 'mongodb://localhost:27017/forewin';

// Name of the collection to delete and recreate
const collectionName = 'daily_activities';

// Schedule the job to run at 6:00 am every day
cron.schedule('0 6 * * *', async () => {
  try {
    // Connect to the MongoDB server
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Access the database
    const db = client.db();

    // Drop the collection
    await db.collection(collectionName).drop();
    console.log(`Collection "${collectionName}" deleted successfully`);

    // Recreate the collection
    await db.createCollection(collectionName);
    console.log(`Collection "${collectionName}" recreated successfully`);

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    console.error('Error deleting/recreating collection:', error);
  }
});

console.log('Cron job scheduled to run at 6:00 am every day');
