const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b7dcs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  const taskCollection = client.db('todoData').collection('todoList');

  try {
    /**
     * post a single task
     * link: http://localhost:5000/task
     */
    app.post('/task', async (req, res) => {
      const data = req.body;
      const doc = data;

      const result = await taskCollection.insertOne(doc);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('TO DO SERVER RUNNING');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
