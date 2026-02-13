const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        unique:true
    },
    code:{
        type:String,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastUpdated:{
        type:Date,
        default:Date.now
    }
});

const Room = mongoose.model('Room', roomSchema);

module.exports=Room;