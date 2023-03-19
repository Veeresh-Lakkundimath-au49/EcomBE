const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://VeereshCluster:1234@veereshcluster.dpxprjq.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

// Database Name
const dbName = 'eCom';

//connection to dummyJsinList collection
async function initDB() {
    
    await client.connect();
    console.log('DB Connected successfully to server(dummyJsonList)');
    const db = client.db(dbName);
    // const collection = db.collection('list');
    const collection = db.collection('dummyJsonList');
    //dummyJsonList

    return collection
    
  }

  //connection to list collection
  async function listDB() {
    
    await client.connect();
    console.log('DB Connected successfully to server(goods)');
    const db = client.db(dbName);
    const collection = db.collection('list');

    return collection
    
  }

  //connection to profile collection
  async function profileDB() {
    
    await client.connect();
    console.log('DB Connected successfully to server(profile)');
    const db = client.db(dbName);
    // const collection = db.collection('list');
    const collection = db.collection('profile');
    //dummyJsonList

    return collection
    
  }

//Exporting all modules
  module.exports={initDB,listDB,profileDB}