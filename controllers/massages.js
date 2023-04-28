const mongoose = require('mongoose');
const Massage = require('../models/Massage');

exports.getMassages = async (req,res,next) => {
        const {openHours} = req.body;
        //if(req.body!=null) {openHours = req.body};
        // const {openHours}=req.body;
        //console.log("openHours: " + openHours);
        let open = null; let close = null;
        if(openHours!=undefined){
            open = parseInt(openHours.open);
            close = parseInt(openHours.close);
            console.log("open: " + open + " close: "+ close);
        }

        let query; const value = {};
        const reqQuery = {...req.query};
        let searchAddress = reqQuery.address; //if not address = undefined
        //console.log(searchAddress);
        let regex = "";
        if(searchAddress!=undefined){
            regex = new RegExp(`${searchAddress}`, "i");
        }
        //console.log("RegExp: "+ regex);
        if (searchAddress !== undefined) {
            value["address"] = { $regex: regex };
        }
        //console.log("value: "+ value);
        const removeFields=['select','sort','page','limit'];
        removeFields.forEach(param=>delete reqQuery[param]);
        //console.log(reqQuery);
        //let queryStr=JSON.stringify(reqQuery);
        let queryStr;
        if ('openHours' in req.body) {
            queryStr = JSON.stringify({
                ...reqQuery,
                "openHours.open": { $gt: open },
                "openHours.close": { $lt: close }
            });
        } else {
            queryStr=JSON.stringify(reqQuery);
        }
        // queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,
        // match=>`$${match}`);
        console.log(queryStr);
        //console.log(": " + JSON.parse(queryStr).populate('appointments'));
        //JSON.parse(queryStr)).populate('appointments')
        if(searchAddress!=undefined){
            query = Massage.find(value);
        } else {
            query = Massage.find(JSON.parse(queryStr)); //an address
        }

        //console.log(query);
        //query = Massage.find(value);
        // if(req.query.select){
        //     const fields = req.query.select.split(',').join(' ');
        //     query = query.select(fields);
        // }
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // }else{
        //     query = query.sort('-createdAt');
        // }
        //

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
        console.log(err);
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
    try{
        const massage = await Massage.create(req.body);
        res.status(201).json({success:true, data:massage});
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