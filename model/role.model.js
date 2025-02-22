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

const Role = mongoose.model('Role'/*ten model */, roleSchema, "roles" /*ten collection*/)

module.exports = Role