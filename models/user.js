const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        accepted: {
            type: Boolean,
            required: true,
        },
        wallet: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)