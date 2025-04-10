import mongoose from "mongoose";

// Check if the model is already registered to prevent the OverwriteModelError
const internshipApplicationSchema = new mongoose.Schema({
    userId: {type:String , ref: 'User', required:true},
    companyId: {type:mongoose.Schema.Types.ObjectId , ref: 'Company', required:true},
    internshipId: {type:mongoose.Schema.Types.ObjectId , ref: 'Internship', required:true},
    status:{type:String, default:"Pending"},
    date:{type:Number, required:true}
});

// Only create the model if it hasn't been registered yet
const internshipApplication = mongoose.models.internshipApplication || mongoose.model('internshipApplication', internshipApplicationSchema);

export default internshipApplication;