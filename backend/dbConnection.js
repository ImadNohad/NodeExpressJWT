const { MongoClient } = require("mongodb");

const dbName = "DBEcommerce";
const url = "mongodb://localhost:27017";
let db;

const dbConnection = () => {
  if (!db) {
    const client = new MongoClient(url);
    try {
        client.connect();
        console.log('Connected to the database');
        db = client.db(dbName);
      } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
      }
  }
  return db;
};

module.exports = dbConnection;
