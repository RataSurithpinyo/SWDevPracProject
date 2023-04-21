const mongoose = require('mongoose');
const Massage = require('../models/Massage');
//const vacCenter = require('../models/VacCenter');
//@desc Get all massages
//@route GET api/v1/massages
//@access Public

// exports.getVacCenters = (req,res,next)=>{
//     vacCenter.getAll((err,data) => {
//         if(err) res.status(500).send({message:err.message||"Some error occurred while retrieving Vaccine Centers."});
//         else res.send(data);
//     });
// };

exports.getMassages = async (req,res,next) => {
        let query;
        const reqQuery = {...req.query};
        const removeFields=['select','sort','page','limit'];
        removeFields.forEach(param=>delete reqQuery[param]);
        console.log(reqQuery);
        let queryStr=JSON.stringify(reqQuery);

        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,
        match=>`$${match}`);

        query=Massage.find(JSON.parse(queryStr)).populate('appointments');
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }
        const page = parseInt(req.query.page,10)||1;
        const limit = parseInt(req.query.limit,10)||25;
        const startIndex = (page-1)*limit;
        const endIndex=page*limit;
    try{
        const total = await Massage.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const massages = await query;
        const pagination = {};
        if(endIndex<total){ //still have next page
            pagination.next={page:page+1,limit}
        }
        if(startIndex>0){
            pagination.prev={page:page-1,limit}
        }
        //console.log(req.query);
        res.status(200).json({success:true, count: massages.length, pagination, data:massages});
    } catch(err){
        res.status(400).json({success:false});
    }
}; 

//@desc Get single massage
//@route GET api/v1/massages/:id
//@access Public
exports.getMassage = async (req,res,next)=>{
    try{
        const massage = await Massage.findById(req.params.id);
        if(!massage){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:massage});
    } catch(err){
        res.status(400).json({success:false});
    }
}; 

//@desc Create new massage
//@route POST api/v1/massages
//@access Private
exports.createMassage = async (req,res,next) => {
    const massage = await Massage.create(req.body);
    res.status(201).json({success:true, data:massage});
}; 

//@desc Update massage
//@route PUT api/v1/massages/:id
//@access Private
exports.updateMassage = async (req,res,next) => {
    try{
        const massage = await Massage.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!massage){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:massage});
    } catch(err){
        res.status(400).json({success:false});
    }
}; 

//@desc Delete massage
//@route DELETE api/v1/massages/:id
//@access Private
exports.deleteMassage = async (req,res,next) => {
    try{
        const massage = await Massage.findById(req.params.id);

        if(!massage){
            return res.status(400).json({success:false});
        }
        massage.remove();
        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false});
    }
}; 