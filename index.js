const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9lypro.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const taskCollection = client.db("focusOn").collection("tasks");

    //tasks api
    app.post("/tasks", async(req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    })

    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = {email : email}
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert: true};
      const updatedTasks = req.body;
      const updated = {
        $set : {
          title: updatedTasks.title,
          description: updatedTasks.description, 
          deadlines: updatedTasks.deadlines, 
          priority: updatedTasks.priority, 
          email: updatedTasks.email, 
          newStatus: updatedTasks.status,
        }
      }
      const result = taskCollection.updateOne(filter, updated, options);
      res.send(result);
    })

    app.delete("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.patch("/tasks/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = req.body;
      console.log(updateStatus);
      const updatedDocs = {
        $set: {
           status: updateStatus.status
        },
      };
      const result = await taskCollection.updateOne(filter, updatedDocs);
      res.send(result);

    })











    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res)=> {
    res.send("Focus is On");
})
app.listen(port, () => {
    console.log(`Focus is running on port: ${port}`)
})