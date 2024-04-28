const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0cyoac0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const addedItemCollection = client.db("artCraftDB").collection('addedItem');

    const homeCollection = client.db("artCraftDB").collection('homeData');


    // Get myItems data
    app.get('/myItems/:email', async (req, res) => {
      const result = await addedItemCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })



    // Get AddItem data
    app.get('/addedItems', async (req, res) => {
      const cursor = addedItemCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // get home data 
    app.get('/homeData', async (req, res) => {
      const cursor = homeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // Get AddItem id 
    app.get('/addedItems/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await addedItemCollection.findOne(query);
      res.send(result)
    })

    // get home data for id
    app.get('/homeData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await homeCollection.findOne(query);
      res.send(result)
    })



    // Post AddItem data
    app.post('/addedItems', async (req, res) => {
      const newAddItem = req.body;
      const result = await addedItemCollection.insertOne(newAddItem);
      res.send(result);
    })

    // Update method 
    app.put('/addedItems/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateItem = req.body;
      const item = {
        $set: {
          subcategory_Name: updateItem.subcategory_Name,
          item_name: updateItem.item_name,
          shortDescription: updateItem.shortDescription,
          price: updateItem.price,
          rating: updateItem.rating,
          customization: updateItem.customization,
          processing_time: updateItem.processing_time,
          stockStatus: updateItem.stockStatus,
          photoURL: updateItem.photoURL,
          user_Name: updateItem.user_Name,
          email: updateItem.email
        }
      }

      const result = await addedItemCollection.updateOne(filter, item, options)
      res.send(result)
    })



    // Delete method 
    app.delete('/addedItems/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await addedItemCollection.deleteOne(query)
      res.send(result)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Assignment 10 server is running')
})

app.listen(port, () => {
  console.log(`Assignment 10 server is running on port ${port}`);
})