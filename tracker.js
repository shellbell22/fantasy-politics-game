var Senator = require('./models/senators');
var request = require('request');

var options;

var options = {
    url: 'https://api.propublica.org/congress/v1/114/senate/members.json',
    new: true,
    upsert: true,
    headers: {'X-API-Key': 'eRe9i2Ej9S89i9kbo7LYH67Z0lCAhB4Yap25tvaC'},
};


function updateSenator(senator) {

    var query = {
        "personid": senator.id
    };
    var update = {
        $set: {
            personid: senator.id,
            firstname: senator.first_name,
            lastname: senator.last_name,
            party: senator.party,
        }
    };

    Senator.findOneAndUpdate(query, update, options, function(err, data) {
        console.log(data);
        console.log(err);
    });
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
      console.log(body); // Show the HTML for the Google homepage.
      body = JSON.parse(body);
      body.results[0].members.forEach ( function(senator) {
        if (senator.id)
        updateSenator(senator);
      });
  }
}

var updateSenators = function() {
    request(options, callback);
};

module.exports.updateSenators = updateSenators;
