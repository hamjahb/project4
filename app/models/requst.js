const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    assistantId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  trip:{
      start:String,
      destination:String
  },

  carDescription:String,
  
  specialNeeds:{
    type:Array
  },
  
  package:{
      type:Boolean,
      default:false
  },
  
  requestStatus:{
        type:String,
        default: 'pending',
        enum: ["pending", "accepted", "closed","canceled"]
  },
  completed:{
      type:Boolean,
      default:false  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Request', exampleSchema)
