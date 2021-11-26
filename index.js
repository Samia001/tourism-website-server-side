const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());


const uri =`${process.env.DB_HOST}://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a8pyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bdTravellers");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");

    /**
     * 
     * 
     * Service API
     * 
     * 
     **/

    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit from api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });

    //delete api

    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });

    /**
     * orders API
     */

    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //get single service
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await ordersCollection.findOne(query);
      res.json(order);
    });

    // post api
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      console.log("hit from api", orders);

      const result = await ordersCollection.insertOne(orders);
      console.log(result);
      res.send(result);
    });

    //delete api

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch();

app.get("/", (req, res) => {
  res.send("Application is running!");
});

app.listen(port, () => {
  console.log(`Application is running at: http://localhost:${port}`);
});
