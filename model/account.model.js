const mongoose = require("mongoose")
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: () => generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false // nếu không truyền vào thì mặc định là false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

accountSchema.pre('save', function (next) {
    const now = new Date();
    this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    next();
});

const Account = mongoose.model('Account'/*ten model */, accountSchema, "admins" /*ten collection*/)

module.exports = Account