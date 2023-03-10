const express = require('express');
const app = express();
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsqsics.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

  try {
    await client.connect();
    const infoCollection = client.db("blood-donation").collection("update-info");


    // get info ?
    app.get('/info', async (req, res) => {
      const query = {};
      const cursor = infoCollection.find(query);
      const info = await cursor.toArray();
      res.send(info)
    });




    // get info one
    app.get('/info/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const info = await infoCollection.findOne(query);
      res.send(info)
    })




    // User Profile 
    app.get('/findUser', async (req, res) => {
      const email = req.query.email;
      // console.log(email)
      const query = { email: email };
      const cursor = infoCollection.find(query);
      const info = await cursor.toArray();
      res.send(info)
    });



    // post info 
    app.post('/info', async (req, res) => {
      const info = req.body;
      const result = await infoCollection.insertOne(info);
      res.send(result)
    })



    // put info email 
    app.put('/info/:email', async (req, res) => {
      const email = req.params.email;
      const update = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {

        $set: update
      };
      const result = await infoCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })



  } finally {

    // await client.close();

  }

}

run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello, Blood Donation Server')
})

app.listen(port, () => {
  console.log('Example app listening on port', port)
})
