var mongoose = require('mongoose');

var VotesSchema = new mongoose.Schema({
    congress: { type: String, required: true },
    session: {type: String, required: true},
    roll_call: {type: String, required: true},
    votes: [{ }]
});

var Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
