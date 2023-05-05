const Appointment = require('../models/Appointment');
const Massage = require('../models/Massage');
exports.getAppointments = async(req,res,next)=>{
    let query;
    if(req.user.role !== 'admin'){
        query=Appointment.find({user:req.user.id}).populate({
            path:'massage',
            select: 'name province tel'
        });
    }else{
        query=Appointment.find().populate({
            path: 'massage',
            select: 'name province tel'
        });
    }
    try{
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:
        "Cannot find Appointment"});
    }
};

exports.getAppointment = async(req,res,next)=>{
    try{
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'massage',
            select: 'name province tel'
        });
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }
        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:
        "Cannot find Appointment"});
    }
};

exports.addAppointment = async(req,res,next)=>{
    try {
        console.log(req.body)
        const date = new Date(req.body.apptDate)
        const upperDate = new Date(date.setDate(date.getDate()+1)).toISOString();
        const lowerDate = new Date(date.setDate(date.getDate()-1)).toISOString();
        console.log(date)
        req.body.massage = req.params.massageId;
        const massage = await Massage.findById(req.params.massageId).populate({
            path: 'appointments',
            select: '_id apptDate'
        }).where({
            apptDate:{
                $gte:lowerDate,
                $lte:upperDate
            }
        });

        console.log(massage)
        if(!massage){
            return res.status(404).json({success:false,message:`No massage shop with the id of ${req.params.massageId}`});
        }
        
        console.log(massage.appointments.length)
        console.log(massage.limit)
        req.body.user = req.user.id;
        const existedAppointments = await Appointment.find({user:req.user.id});
        if (massage.appointments.length >= massage.limit) {
            console.log("yes")
            return res.status(400).json({success:false,message:`The massage shop with ID ${massage._id} has already made ${massage.limit} appointments in that time range`}); 
        }
        if(existedAppointments.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} already has 3 appointments`});
        }
        const appointment = await Appointment.create(req.body);
        const updatedMassage = await Massage.findByIdAndUpdate(massage, { "available": massage.limit - massage.appointments.length -1 })
        console.log(updatedMassage)
        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:
        "Cannot create Appointment"});
    }
};

exports.updateAppointment = async(req,res,next)=>{
    try{
        let appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }
        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this appointment`});
        }
        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.params.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:
        "Cannot update Appointment"});
    }
};

exports.deleteAppointment = async(req,res,next)=>{
    try{
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }
        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this appointment`});
        }
        await appointment.remove();
        res.status(200).json({
            success: true,
            data: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:
        "Cannot delete Appointment"});
    }
}