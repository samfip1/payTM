const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://samfip:bKIAxtd3OVqJ2lQt@samfip.gdqd29e.mongodb.net/payTM');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}