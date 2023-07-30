const { defineConfig } = require("cypress");
const mysql = require("mysql2");
require('dotenv').config();
const { MongoClient } = require('mongodb');

/* const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); */

function queryTestDB(query) {
  const connection = mysql.createConnection({
    host: process.env.host_dev,
    user: process.env.user_dev,
    password: process.env.password_dev,
    database: process.env.database_dev,
  });

  connection.connect();

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();
        return resolve(results);
      }
    });
  });
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(`Soy el console log del Task: ${message}`)
          return null
        },
        queryDB: (query) => {
          return queryTestDB(query);
        },

        queryMongo: async function() {
          let client;
          try {
            client = new MongoClient("mongodb://127.0.0.1:27017");
            await client.connect();
            console.log("Connected to MongoDB");
    
            const db = client.db('cypress');
            const collection = db.collection("tests");
            const results = await collection.find().toArray();
            return results;
          } catch (e) {
            console.error("Error connecting to MongoDB", e);
            throw e;
          } finally {
            if (client) {
              await client.close();
              console.log("Disconnected from MongoDB");
            }
          }
        },
        crearMongo: async function(object) {
          let client;
          try {
            client = new MongoClient("mongodb://127.0.0.1:27017");
            await client.connect();
            console.log("Connected to MongoDB");
    
            const db = client.db('cypress');
            const collection = db.collection("tests");
            const results = await collection.insertOne(object)
            return results;
          } catch (e) {
            console.error("Error connecting to MongoDB", e);
            throw e;
          } finally {
            if (client) {
              await client.close();
              console.log("Disconnected from MongoDB");
            }
          }
        },
        borrarMongo: async function() {
          let client;
          try {
            client = new MongoClient("mongodb://127.0.0.1:27017");
            await client.connect();
            console.log("Connected to MongoDB");
    
            const db = client.db('cypress');
            const collection = db.collection("tests");
            const results = await collection.findOneAndDelete({}, { sort: { _id: -1 } });
            return results;
          } catch (e) {
            console.error("Error connecting to MongoDB", e);
            throw e;
          } finally {
            if (client) {
              await client.close();
              console.log("Disconnected from MongoDB");
            }
          }
        },
        
      })
      return {
        excludeSpecPattern: [
          "./cypress/e2e/1-getting-started/*.cy.js",
          "./cypress/e2e/2-advanced-examples/*.cy.js"
        ],
      }
    },
  },
});
