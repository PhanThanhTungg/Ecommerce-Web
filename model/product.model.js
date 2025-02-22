const mongoose = require("mongoose")
const slug = require("mongoose-slug-updater")   // slug de seo // vd: tu dong chuyen sản phẩm 1 thành san-pham-1

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
    { 
        title: String,
        product_category_id:{
            type: String,
            default: ""
        },
        description: String,
        listSize:[
            {
                size: String,
                price: Number,
                stock: Number
            }
        ],
        discountPercentage: Number,
        thumbnail: String,
        status: String,
        featured: String,
        position: Number,
        slug:{
            type: String,
            slug: "title",   
            unique: true    
        },
        createBy:{
            account_id: String,
            createdAt:{
                type: Date,
                default: Date.now
            }
        },
        deleted:{
            type: Boolean,
            default: false 
        },
        deletedBy:{
            account_id: String,
            deletedAt: Date
        },
        feedback:{
            type:[
                {
                    userToken: String,
                    rating: String,
                    comment: String,
                    time: Date
                } 
            ],
            default: []
        },
        ratingNumber:{
            type: Number,
            default: 5
        },
        sales:{
            type: Number,
            default: 0
        },
        updatedBy:[
            {
                account_id: String,
                updatedAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product'/*ten model */, productSchema, "products" /*ten collection*/)

module.exports = Product