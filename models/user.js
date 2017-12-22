const mongoose = require('mongoose');

const User = mongoose.model('User', {
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    maritalStatus: {
       type: String,
       required: true 
    }
});

module.exports = {User};