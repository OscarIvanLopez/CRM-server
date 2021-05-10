const { ApolloServer } = require("apollo-server");
const resolvers = require("./db/resolvers");
const typeDefs = require("./db/schema");
const dbConnect = require("./config/db");
const jwt = require("jsonwebtoken");

//Database Connection
dbConnect();

//server
const server = new ApolloServer({
    typeDefs,
    resolvers,

    context: ({ req }) => {
        const token = req.headers["authorization"] || "";
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET_WORD);

                return {
                    user,
                };
            } catch (err) {
                console.log("Token error");
                console.log(err);
            }
        }
    },
});

//run the server
server.listen().then(({ url }) => {
    console.log(`Server runing in ${url}`);
});
