var SENATOR_LIST = {
    "senators": [{
            "personid": 412582,
            "bioguideid": K000384,
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
            "bioguideid": C001098,
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
            "bioguideid": F000463,
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
    }, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (var index in data.senators) {
        $('body').append(
            '<p>' + data.senators[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

//  on page load do this
$(function() {
    getAndDisplayStatusUpdates();
});
