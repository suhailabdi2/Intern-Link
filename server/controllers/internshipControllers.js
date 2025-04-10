import internship from "../models/Internship.js"


export const getInternships = async (req, res) =>{
    try {
        
        const internships = await internship.find( {visible:true}).populate({path:'companyId', select:'-password'})

        res.json({success:true, internships})
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}
export const getInternshipById = async (req,res) =>{
    try {
        const {id} = req.params
        const internshipData = await internship.findById(id).populate({
            path :'companyId',
            select:"-password"
        })
        if(!internshipData){
            return res.json({
                success:false,
                message:"Internship not found"
            })
        }
        
        return res.json({
            success: true,
            internship: internshipData
        })
    } catch (error) {
        res.json({success:false, message:error.message})
        
    }
}