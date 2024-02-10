const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//MD
app.use(cors());
app.use(express.json());

//master_technology
//kdEdYfGuydLdy58I


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vc60c8j.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

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
    const phoneCollection = client.db('DB_PHONE_COLLECTION').collection('ALL_PHONES');
    const userCollection = client.db('DB_PHONE_COLLECTION').collection('users');

    //categories

    app.get('/products', async (req, res) => {
      const cursor = phoneCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await phoneCollection.findOne(query)
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateproducts = req.body;
      console.log(updateproducts)
      const update = {
        $set: {
          name: updateproducts.name,
          price: updateproducts.price,
          description: updateproducts.description,
          image: updateproducts.image,
          type: updateproducts.type,
          ratting: updateproducts.ratting,
          brand: updateproducts.brand
        }
      }
      const result = await phoneCollection.updateOne(filter, update, option)
      res.send(result)
    })

    app.post('/products', async (req, res) => {
      const products = req.body;
      const result = await phoneCollection.insertOne(products)
      res.send(result)
    })

    //user collection

    app.post('/users',async(req,res)=>{
      const user=req.body;
      const result=await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users', async(req,res)=>{
      const cursor=userCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })

    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/user',async(req,res)=>{
      const user=req.body;
      const filter={email: user.email}
      const update={
        $set:{
          lastlogin:user.lastlogin,
        }
      }
      const result = await userCollection.updateOne(filter,update)
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
  res.send('technology server is running')
})

app.listen(port, (req, res) => {
  console.log(`my port is ${port}`)
})
