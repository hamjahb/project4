const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    default: 'patient',
    enum: ["patient", "assistant", "admin"]
   },

   assistant:{
          carDescription:{type:String} ,
          availability: { type :Boolean,default:true}
   },
   patient: {
        healthConditions:{type:Array }
   },


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
