import mongoose from 'mongoose'

const reviewsSchema = new mongoose.Schema({
    rating:{
        type:Number,
    },
    review:{
        type:String,
    },
    customer:{
        type:String,
    },
    date:{
        type:Date,
    },
});

const servicesSchema = new mongoose.Schema({
    name:{
        type:[String],
    }
});

const serviceProviderSchema = new mongoose.Schema({
    name:{
        type:String,
        max:255,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        max:500,
    },
    mobile:{
        type:Number,
    },
    services:{
        type:[servicesSchema],
    },
    rating:{
        type:Number,
    },
    reviews:{
        type:[reviewsSchema],
    },
    profilePicture:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
});

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);

export default ServiceProvider;