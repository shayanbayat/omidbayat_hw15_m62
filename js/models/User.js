const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        min:4,
    },
    lastName:{
        type:String,
        min:4
    },
    username:{
        type:String,
        min:6,
        required:[true,"error require"],
        unique:true
    },
    phoneNumber:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    firstPassword:{
        type:String,
        min:8,
        require:true
    },
    secondPassword:{
        type:String,
        min:8,
        require:true
    }
})

module.exports = mongoose.model('User',userSchema)