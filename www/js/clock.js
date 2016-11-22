var hourTens,
    hourUnits,
    minTens,
    minUnits = 0;

var time,
    hours,
    units;

var frozen = false;

var httpRequest;
var HTNode = document.getElementById('hour-ten');
var HUNode = document.getElementById('hour-unit');
var MTNode = document.getElementById('min-ten');
var MUNode = document.getElementById('min-unit');
var dateNode = document.getElementById('date');
var jokeNode = document.getElementById('joke');
var timeNode = document.getElementById('form-time');
var timeSubmit = document.getElementById('submit-time');

if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6 and older
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}

setInterval(checkClockUpdate, 500);

Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(), '-', !mm[1] && '0', mm, '-', !dd[1] && '0', dd].join('');
};


function checkClockUpdate() {
    time = new Date();

    hours = time.getHours();
    units = time.getMinutes();

    updateUi(
         hours >= 10? ((hours / 10) + '').split('.')[0] : 0,
         hours >= 10? ((hours / 10) + '').split('.')[1] || 0 : hours,
         units >= 10? ((units / 10) + '').split('.')[0] : 0,
         units >= 10? ((units / 10) + '').split('.')[1] || 0 : units,
         time.yyyymmdd()
    );
}


function updateUi(ht, hu, mt, mu, dateString) {
    if (frozen && mu === minUnits) {
        return;
    } else if (frozen) {
        frozen = false;
        HTNode.setAttribute('src', 'assets/hours-tens-' + ht + '.webm');
        HUNode.setAttribute('src', 'assets/hours-units-' + hu + '.webm');
        MTNode.setAttribute('src', 'assets/min-tens-' + mt + '.webm');
        MUNode.setAttribute('src', 'assets/min-unit-' + mu + '.webm');

        HTNode.play();
        HUNode.play();
        MTNode.play();
        MUNode.play();
    }

    if (ht != hourTens) {
        hourTens = ht;
        HTNode.setAttribute('src', 'assets/hours-tens-' + ht + '.webm');
        HTNode.volume = 0;
        HTNode.play();
    }

    if (hu != hourUnits) {
        hourUnits = hu;
        HUNode.setAttribute('src', 'assets/hours-units-' + hu + '.webm');
        HUNode.volume = 0;
        HUNode.play();

        httpRequest.onreadystatechange = printJoke;
        httpRequest.open('GET', 'https://api.icndb.com/jokes/random', true);
        httpRequest.send(null);
    }

    if (mt != minTens) {
        minTens = mt;
        MTNode.setAttribute('src', 'assets/min-tens-' + mt + '.webm');
        MTNode.volume = 0;
        MTNode.play();
    }

    if (mu != minUnits) {
        minUnits = mu;
        MUNode.setAttribute('src', 'assets/min-unit-' + mu + '.webm');
        MUNode.volume = 0;
        MUNode.play();
    }

    dateNode.innerHTML = dateString;
}

function printJoke() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        var res = JSON.parse(httpRequest.responseText);
        jokeNode.innerHTML = '"Joke" ' + res.value.id + ': ' + res.value.joke;
    }
}


timeSubmit.addEventListener('click', function (e) {
    var time = timeNode.value;
    frozen = true;

    HTNode.setAttribute('src', 'assets/hours-tens-' + time[0] + '.webm');
    HUNode.setAttribute('src', 'assets/hours-units-' + time[1] + '.webm');
    MTNode.setAttribute('src', 'assets/min-tens-' + time[3] + '.webm');
    MUNode.setAttribute('src', 'assets/min-unit-' + time[4] + '.webm');

    HTNode.play();
    HUNode.play();
    MTNode.play();
    MUNode.play();
});
