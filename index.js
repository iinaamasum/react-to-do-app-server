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
     * JWT token post api
     * link-local: http://localhost:5000/login
     */
     app.post('/login', async (req, res) => {
      const loggedUser = req.body;
      const token = jwt.sign(loggedUser, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '10h',
      });

      res.send({ token });
    });

    /**
     * verifyToken function section
     */
    const verifyToken = (req, res, next) => {
      const author = req.headers.author;
      if (!author) {
        return res
          .status(401)
          .send({ name: 'NoToken', message: 'Unauthorized Access' });
      }
      const token = author.split(' ')[1];
      //console.log(token);
      jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
        if (error) {
          return res
            .status(403)
            .send({ name: 'WrongToken', message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next();
      });
    };

    app.get('/tasks', verifyToken, async(req, res){
      const decodedEmail = req.decoded.email;
      // console.log(decodedEmail);
      if (req.query.email === decodedEmail) {
        const query = { email: req.query.email };
        const data = await taskCollection.find(query).toArray();
        // console.log(query);
        res.send(data);
      } else {
        res
          .status(403)
          .send({ name: 'WrongToken', message: 'Forbidden Access' });
      }
    })
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
