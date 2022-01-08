const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    user:[{type:Schema.Types.ObjectId, ref:'User'}],
    name:{
        type:String, required:true
    },
    token:{
        type:String,
        unique:true,
        required:true
    },
    TControl:{
        type:Number,
        default: 0
    },
    HControl:{
        type:Number,
        default: 0
    },
    LightControl:{
        type: String,
        default: 'off'
    },
    HitterControl:{
        type: String,
        default: 'off'
    },
    FanControl:{
        type:String,
        default: 'off'
    }


})

module.exports = mongoose.model('Device',deviceSchema)