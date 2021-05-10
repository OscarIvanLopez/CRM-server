const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Orden = require("../models/Order");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Create the token
const createToken = (user, secret, expiresIn) => {
    const { id, email, name, lastName, created } = user;
    return jwt.sign({ id, email, name, lastName, created }, secret, {
        expiresIn,
    });
};

// Resolvers
const resolvers = {
    Query: {
        //USERS
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET_WORD);

            return userId;
        },

        //PRODUCTS
        getProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch (err) {
                console.log(err);
            }
        },

        getProduct: async (_, { id }) => {
            //check if the product exist
            const product = await Product.findById(id);
            if (!product) {
                throw new Error("This product do not exist");
            }

            return product;
        },

        //CLIENTS
        getClients: async () => {
            try {
                const clients = await Client.find({});

                return clients;
            } catch (err) {
                console.log(err);
            }
        },

        getClientsSeller: async (_, {}, ctx) => {
            try {
                const clients = await Client.find({
                    seller: ctx.user.id.toString(),
                });

                return clients;
            } catch (err) {
                console.log(err);
            }
        },
        getClient: async (_, { id }, ctx) => {
            //Check if the client exist
            const client = await Client.findById(id);
            if (!client) {
                throw new Error("Client not found");
            }
            //Who create it only can see it
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error("You can't acces to this client");
            }

            return client;
        },

        //ORDERS
        getOrders: async () => {
            try {
                const orders = Order.find({});

                return orders;
            } catch (err) {
                console.log(err);
            }
        },
    },
    Mutation: {
        //USERS
        newUser: async (_, { input }, ctx) => {
            const { email, password } = input;

            //check if the user is already registered
            const userExist = await User.findOne({ email });
            if (userExist) {
                throw new Error("The user already exist");
            }

            //hash the password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            //Save it in the database
            try {
                const user = new User(input);
                user.save();
                return user;
            } catch (err) {
                console.log(err);
            }
        },
        //End create User Function

        authUser: async (_, { input }) => {
            const { email, password } = input;

            //If the user exist
            const userExist = await User.findOne({ email });
            if (!userExist) {
                throw new Error("The user does no exist");
            }

            //Check if the password is correct
            const correctPassword = await bcryptjs.compare(
                password,
                userExist.password
            );
            if (!correctPassword) {
                throw new Error("The password is incorrect");
            }

            //return the token
            return {
                token: createToken(userExist, process.env.SECRET_WORD, "5hr"),
            };
        },
        //<----End authUser function ---->
        //PRODUCTS
        newProduct: async (_, { input }) => {
            try {
                const product = new Product(input);

                const res = await product.save();
                console.log(res);

                return res;
            } catch (err) {
                console.log(err);
            }
        },

        updateProduct: async (_, { id, input }) => {
            let product = await Product.findById(id);

            if (!product) {
                throw new Error("This product do not exist");
            }

            //save it in database
            product = await Product.findOneAndUpdate({ _id: id }, input, {
                new: true,
            });

            return product;
        },

        deleteProduct: async (_, { id }) => {
            const product = await Product.findById(id);

            if (!product) {
                throw new Error("This product do not exist");
            }

            //Delete
            await Product.findOneAndDelete({ _id: id });

            return "Product deleted";
        },

        //CLIENTS//

        newClient: async (_, { input }, ctx) => {
            const { email } = input;
            //Check if the client is already registered
            const client = await Client.findOne({ email });

            if (client) {
                throw new Error("The client is already registered");
            }

            const newClient = new Client(input);

            //Asign a seller
            newClient.seller = ctx.user.id;

            //save it in the database
            try {
                const res = await newClient.save();

                return res;
            } catch (err) {
                console.log(err);
            }
        },

        updateClient: async (_, { id, input }, ctx) => {
            let client = await Client.findById(id);
            //Check if exist
            if (!client) {
                throw new Error("This client do not exist");
            }

            //Check if is the correct seller
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error("You can't acces to this client");
            }

            //Save it into the database
            client = await Client.findOneAndUpdate({ _id: id }, input, {
                new: true,
            });
            return client;
        },

        deleteClient: async (_, { id }, ctx) => {
            let client = await Client.findById(id);
            console.log(client);
            //Check if the client exist
            if (!client) {
                throw new Error("This client do not exist");
            }

            //Check if the seller is the correct
            if (client.seller.toString() !== ctx.user.id) {
                throw new Error("You can't acces to this client");
            }

            //Remove it from the database
            await Client.findOneAndDelete({ _id: id });
            return "Client deleted";
        },

        //ORDERS
        newOrder: async (_, { input }, ctx) => {
            const { client } = input;
            //Check if the client exist
            let clientExist = await Client.findById(client);
            if (!clientExist) {
                throw new Error("The client do not exist");
            }

            //Check if the seller is correct
            if (clientExist.seller.toString() !== ctx.user.id) {
                throw new Error("You can't acces to this client");
            }

            //Check the stock
            for await (const item of input.order) {
                const { id } = item;

                const product = await Product.findById(id);

                if (item.quantity > product.exist) {
                    throw new Error(
                        `The item ${product.name} exceeds the available quantity`
                    );
                } else {
                    //Less the quantity available
                    product.exist = product.exist - item.quantity;

                    await product.save();
                }
            }
            //Create a new orden
            const newOrder = new Orden(input);

            //Asign to a seller
            newOrder.seller = ctx.user.id;

            //Save it into the database
            const res = await newOrder.save();
            return res;
        },
    },
};

module.exports = resolvers;
