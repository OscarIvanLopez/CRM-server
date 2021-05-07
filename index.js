const { ApolloServer } = require("apollo-server");
const resolvers = require("./db/resolvers");
const typeDefs = require("./db/schema");
const dbConnect = require("./config/db");

//Database Connection
dbConnect();

//server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    const myContext = "Hello";

    return {
      myContext,
    };
  },
});

//run the server
server.listen().then(({ url }) => {
  console.log(`Server runing in ${url}`);
});
