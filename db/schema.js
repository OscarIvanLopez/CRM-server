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

    type Client {
        id: ID
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        seller: ID
    }

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: ID
        seller: ID
        created: String
        state: StateOrder
    }

    type OrderGroup {
        id: ID
        quantity: Int
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
    input ClientInput {
        name: String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float!
        client: ID!
        state: StateOrder
    }

    enum StateOrder {
        PENDING
        COMPLETED
        CANCELED
    }

    type Query {
        #USERS
        getUser(token: String!): User

        #PRODUCTS
        getProducts: [Product]
        getProduct(id: ID!): Product

        #CLIENTS
        getClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        #ORDERS
        getOrders: [Order]
    }

    type Mutation {
        #USERS
        newUser(input: UserInput!): User
        authUser(input: AuthInput): Token

        #PRODUCTS
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        #CLIENTS
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!): String

        #ORDERS
        newOrder(input: OrderInput): Order
    }
`;
module.exports = typeDefs;
