const { gql } = require("apollo-server");
//Schema

const typeDefs = gql`
    type User {
        id: ID
        name: String
        lastName: String
        email: String
        created: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        exist: Int
        price: Float
        created: String
    }

    input UserInput {
        name: String
        lastName: String
        email: String
        password: String
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        exist: Int!
        price: Float!
    }

    type Query {
        getUser(token: String!): User
    }

    type Mutation {
        #USERS
        newUser(input: UserInput!): User
        authUser(input: AuthInput): Token

        #PRODUCTS
        newProduct(input: ProductInput): Product
    }
`;
module.exports = typeDefs;
