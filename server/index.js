const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const apiRoutes = require("./apiRoutes");
const { initialize } = require("./database");

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', apiRoutes);

async function startServer() {
  await initialize();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
