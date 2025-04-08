import mongoose from "mongoose";
const internshipApplicationSchema = new mongoose.Schema({
    userId: {type:String , ref: 'User', required:true},
    companyId: {type:mongoose.Schema.Types.ObjectId , ref: 'company', required:true},
    internshipId: {type:mongoose.Schema.Types.ObjectId , ref: 'internship', required:true},
    status:{type:String, default:"Pending"},
    date:{type:Number, required:true}
})

const internshipApplication = mongoose.model('internshipApplication',internshipApplicationSchema)
export default internshipApplication