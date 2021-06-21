require("dotenv").config();
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.ykf6z.mongodb.net/dbd-companion-mongodb?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection.once("open", () => {
  console.log("connected to db");
});

app.use(
  "/api",
  graphqlHTTP({
    //ES6 short hand for schema: schema
    schema,
    graphiql: true,
  })
);

app.listen(process.env.PORT || 4000, () => {
  console.log("Listening for requests on port 4000");
});
