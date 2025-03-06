const mongoose = require('mongoose');


const userAdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },

});

const UserAdmin = mongoose.model('UserAdmin', userAdminSchema);

module.exports = UserAdmin;
