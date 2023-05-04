const mongoose = require('mongoose');
const Massage = require('../models/Massage');

exports.getMassages = async (req, res, next) => {
    const { openHours } = req.body;
    let open = null;
    let close = null;
    if (openHours !== undefined) {
        open = parseInt(openHours.open);
        close = parseInt(openHours.close);
        console.log("open: " + open + " close: " + close);
    }
    const checktime = open < close

    const reqQuery = { ...req.query };
    let searchAddress = reqQuery.address;
    let regex = "";
    if (searchAddress !== undefined) {
        regex = new RegExp(`${searchAddress}`, "i");
    }

    let value = {};
    if (searchAddress !== undefined) {
        value["address"] = { $regex: regex };
    }

    if (openHours !== undefined) {
        value = {
            ...value,
            $and: [
                { "openHours.open": { $gte: open } },
                { "openHours.close": { $lte: close } },
            ],
        };
    }

    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    if (openHours !== undefined) {
        queryStr = JSON.stringify({
            ...reqQuery,
            "openHours.open": { $gte: open },
            "openHours.close": { $lte: close },
        });
    }

    if (searchAddress !== undefined) {
        query = Massage.find(value).sort({"available":-1}).populate({
            path: 'appointments',
            select: '_id'
        });
    } else {
        query = Massage.find(JSON.parse(queryStr)).sort({"available":-1}).populate({
            path: 'appointments',
            select: '_id'
        });
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
        if(checktime) res.status(200).json({success:true, count: massages.length, pagination, data:massages});
        else {
            res.status(400).json({success:false, message:'Opening hours must be less than closing hours'});
        }
    } catch(err){
        console.log(err);
        res.status(400).json({success:false});
    }
}; 

//@desc Get single massage
//@route GET api/v1/massages/:id
//@access Public
exports.getMassage = async (req,res,next)=>{
    try{
        const massage = await Massage.findById(req.params.id).populate({
            path: 'appointments',
            select: '_id'
        });
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
    try{
        const massage = await Massage.create(req.body);
        console.log(massage.openHours.open)
        if(massage.openHours.open < massage.openHours.close)res.status(201).json({success:true, data:massage});
        else res.status(400).json({success:false, message:'Opening hours must be less than closing hours'});
    }
    catch(err){
        console.log(err)
        res.status(400).json({success:false,message:err.errors.openHours.message})
    }
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