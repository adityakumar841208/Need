import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;

