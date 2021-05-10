const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
    order: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    state: {
        type: String,
        default: "PENDING",
    },
    created: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Order", OrderSchema);
