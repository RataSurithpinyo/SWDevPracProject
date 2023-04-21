const mongoose = require('mongoose');
const MassageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },

    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength: [5, 'Postal code can not be more than 5 digits']
    },
    tel:{
        type: String
    },
    region:{
        type: String,
        required: [true,'Please add a region']
    },
    limit:{
        type: Number,
        required: [true,'Please set a limit to how many appointment can a massage shop take']
    }
},{
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});
MassageSchema.pre('remove', async function(next){
    console.log(`Appointments being removed from massage shop ${this._id}`);
    await this.model('Appointment').deleteMany({massage: this._id});
    next();
});
MassageSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'massage',
    justOne: false
});
module.exports=mongoose.model('Massage',MassageSchema);