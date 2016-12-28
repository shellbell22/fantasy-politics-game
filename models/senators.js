var mongoose = require('mongoose');

var SenatorSchema = new mongoose.Schema({
    firstname: {type: String, required: true },
    lastname: {type: String, required: true},
    personid: {type: String, required: true},
    party: {type: String, required: false}
});

var Senator = mongoose.model('Senator', SenatorSchema);

module.exports = Senator;
