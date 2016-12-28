var SENATOR_LIST = {
    "senators": [{
            "personid": "K000384",
            "firstname": "Timothy",
            "lastname": "Kaine",
            "image": "https://www.congress.gov/img/member/k000384.jpg",
            "party": "D",
            "state": "VA",
            "seniority": "3",
            "nextelection": "2018",
            "missedvoteper": "3.19",
            "twitter": "timkaine",
            "totalpoints": "10",
        },

        {
            "personid": "C001098",
            "firstname": "Ted",
            "lastname": "Cruz",
            "image": "https://www.congress.gov/img/member/c001098.jpg",
            "party": "R",
            "state": "TX",
            "seniority": "3",
            "nextelection": "2018",
            "missedvoterper": "32.27",
            "twitter": "SenTedCruz",
            "totalpoints": "15",
        },

        {
            "personid": "F000463",
            "firstname": "Deb",
            "lastname": "Fischer",
            "image": "https://www.congress.gov/img/member/f000463.jpg",
            "party": "R",
            "state": "NE",
            "seniority": "3",
            "nextelection": "2018",
            "missedvoterper": "0.00",
            "twitter": "SenatorFischer",
            "totalpoints": "20",
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

    $.get('/senators', function(data) {
        callbackFn(data);
        console.log(data);
    });

}

// this function stays the same when we connect
// to real API later
function displaySenators(data) {
    for (var index in data.senators) {
        var template = $('.templates .senator').clone();
        template = $(template);
        template.find('.card-title').text(data.senators[index].firstname + ' ' + data.senators[index].lastname);
        template.find('img').attr('src', "https://www.congress.gov/img/member/" + data.senators[index].personid.toLowerCase() + '.jpg');
        template.find('.card-content').text('Party:' + data.senators[index].party);

        $('#senators').append(template);
        //$('body').append("<img src='https://www.congress.gov/img/member/" + data.senators[index].personid.toLowerCase() + ".jpg'>");
        //  $('body').append('<p>' + data.senators[index].firstname + ' ' + data.senators[index].lastname + '</p>');
        //$('body').append('<p> Party: ' + data.senators[index].party + '</p>');
        //  $('body').append('<p> State: ' + data.senators[index].state + '</p>');
        //$('body').append('<p> Points:' + data.senators[index].totalpoints + '</p>');
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

    $('#loginform').submit(function(event) {
        event.preventDefault();
        $.post({
            url: '/login',
            data:JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val()
            }),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function(data) {
                console.log(data);
            }
        });

    });

});
