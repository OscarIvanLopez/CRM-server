const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
    process.exit(1);
  }
};
module.exports = dbConnect;
