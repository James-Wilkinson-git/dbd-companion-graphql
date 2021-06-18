const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://dbd-db-user:7Em4Yjqn0Cj0pjiw@cluster0.ykf6z.mongodb.net/dbd-companion-mongodb?retryWrites=true&w=majority",
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

app.listen(4000, () => {
  console.log("Listening for requests on port 4000");
});
