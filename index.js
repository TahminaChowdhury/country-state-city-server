const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Connect to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckcl0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db('country_state_city');
    const divisions = database.collection('divisions');
    const districts = database.collection('districts');
    const sub_distrcit = database.collection('sub_distrcit');
    const unions = database.collection('unions');

    // get divisions
    app.get('/divisions', async (req, res) => {
      const cursor = divisions.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get districts
    app.get('/districts/:divisionId', async (req, res) => {
      const divisionId = req.params.divisionId;
      const query = { division_id: divisionId };
      const result = await districts.find(query).toArray();
      res.send(result);
    });

    // get districts
    app.get('/sub_districts/:districtId', async (req, res) => {
      const districtId = req.params.districtId;
      const query = { district_id: districtId };
      const result = await sub_distrcit.find(query).toArray();
      res.send(result);
    });

    // get districts
    app.get('/unions/:upazilla_id', async (req, res) => {
      const upazilla_id = req.params.upazilla_id;
      const query = { upazilla_id: upazilla_id };
      const result = await unions.find(query).toArray();
      res.send(result);
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
