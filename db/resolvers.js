const User = require("../models/User");
const Product = require("../models/Products");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Create the token
const createToken = (user, secret, expiresIn) => {
    console.log(user);
    const { id, email, name, lastName, created } = user;
    return jwt.sign({ id, email, name, lastName, created }, secret, {
        expiresIn,
    });
};

// Resolvers
const resolvers = {
    Query: {
        getUser: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET_WORD);

            return userId;
        },
    },
    Mutation: {
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
    },
};

module.exports = resolvers;
