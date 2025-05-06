const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema(
    { 
        title: String,
        description: String,
        permissions:{
            type: Array,
            default:[]
        },
        deleted:{
            type: Boolean,
            default: false 
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

roleSchema.pre('save', function (next) {
    const now = new Date();
    this.createdAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    this.updatedAt = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    next();
  });

const Role = mongoose.model('Role'/*ten model */, roleSchema, "roles" /*ten collection*/)

module.exports = Role