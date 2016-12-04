var SENATOR_LIST = {
    "senators": [{
            "personid": 412582,
            "bioguideid": "K000384",
            "firstname": "Timothy",
            "lastname": "Kaine",
            "image": "https://www.govtrack.us/data/photos/412582-200px.jpeg",
            "party": "Democrat",
            "state": "VA",
            "chairman_rankingmember": ["Senate Committee on Armed Services", "Senate Committee on Foreign Relations"],
            "start_date": "2013",
            "rank": "junior",
            "leadership_title": null,
            "total points": 10,
        },

        {
            "personid": 412573,
            "bioguideid": "C001098",
            "firstname": "Ted",
            "lastname": "Cruz",
            "image": "https://www.govtrack.us/data/photos/412573-200px.jpeg",
            "party": "Republican",
            "state": "TX",
            "chairman_rankingmember": ["Senate Committee on Commerce, Science, and Transportation", "Senate Committee on the Judiciary"],
            "start_date": "2013",
            "rank": "junior",
            "leadership_title": null,
            "total points": 15,
        },

        {
            "personid": 412556,
            "bioguideid": "F000463",
            "firstname": "Deb",
            "lastname": "Fischer",
            "image": "https://www.govtrack.us/data/photos/412556-200px.jpeg",
            "party": "Republican",
            "state": "NE",
            "chairman_rankingmember": ["Senate Committee on Commerce, Science, and Transportation", "Senate Committee on Armed Services"],
            "start_date": "2013",
            "rank": "senior",
            "leadership_title": null,
            "total points": 20,
        }
    ]
};


// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function() {
        callbackFn(SENATOR_LIST);
    }, 100);
}

// this function stays the same when we connect
// to real API later
function displaySenators(data) {
    for (var index in data.senators) {
        $('body').append("<img src="+ data.senators[index].image + '>');
        $('body').append('<p>' + data.senators[index].firstname + ' ' + data.senators[index].lastname + '</p>');
        $('body').append('<p> Rank: ' + data.senators[index].rank + '</p>');
        $('body').append('<p> Party: ' + data.senators[index].party + '</p>');
        $('body').append('<p> State: ' + data.senators[index].state + '</p>');
        $('body').append('<p> Chairman/Ranking Member:' + data.senators[index].chairman_rankingmember + '</p>');
        $('body').append('<p> Points:' + data.senators[index].points + '</p>');
        if (data.senators[index].leadership_title) {
        $('body').append('<p> Points:' + data.senators[index].points + '</p>');
      }
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displaySenators);
}

//  on page load do this
$(function() {
    getAndDisplayStatusUpdates();
});
