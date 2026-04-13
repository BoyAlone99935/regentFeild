const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },

  type : {
    type : String,
    enum : ['Credit' , 'Debit' , 'Alert' , 'Reminder'],
    required : true
  }, 
  message : {
    type : String,
    required : true
  }
})

module.exports = mongoose.model('Notification', NotificationSchema)