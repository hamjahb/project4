const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  name: {
    type: String,
   
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  }, 
  active: {
    type: Boolean,
    default:false
    
  },
  role: {
    type: String,
   
    enum: ["Patient", "Assistant", "Admin"]
   },

   assistant:{
          carDescription:{type:String} ,
          availability: { type :Boolean,default:true}
   },
   patient: {
        healthConditions:{type:Array },
    
    
   },
   age:{type:Number},
   phone:{type:String},
   
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

userSchema.virtual('examples', {
  ref: 'Example',
  localField: '_id',
  foreignField: 'owner'
});

module.exports = mongoose.model('User', userSchema)
