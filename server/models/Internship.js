import mongoose, { trusted } from "mongoose";
const internshipSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    location:{type:String,required:true},
    year:{type:String,required:true},
    category:{type:String,required:true},
    date:{type:Number, required:true},
    visible :{type:Boolean , default:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:"Company", required:true}
})

const internship = mongoose.model('Internship',internshipSchema)

export default internship