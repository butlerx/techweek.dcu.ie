// We wait for the document to finish loading
$(document).ready( function(){

	// Get the event list from JSON (because JSON is nice) and send data to loadEvents function.
	// This call is anynchronous, meaning it will display the data once the JSON is loaded,
	// but the code continues to execute in the background
	$.getJSON('events.json', function(data){ loadEvents(data);});

	// Change the color of the header based on the amount of times you visited the page
	$('header h1 span').css({color: colors[(v+3) % 5]});

});

// This is a conditional (Ternary) Operator. It assigns a value based on some other value
// It is much shorter to write than if-else.
// How it works:
// 		localStorage allows you to store values in the client side. Its like cookies
//		but they don't get send to the server
//		1. If 'visited' is already defined:
//			a. get the 'visited' and convert it to a number (+) since
//			   localStorage stores it as a string
//			b. Add +1 to it
//		2. If 'visited' is not defined (null), set it to 1, since you are on the website
//	   	   right now.
//		3. Assign the value you chose back to the 'visited' in localStorage
localStorage['visited'] = localStorage['visited'] ? +localStorage['visited']+1 : 1;

// Assign 'visited' to variable v, because its shorter to write, and will not require
// I/O every time you use it, the above was aleady consuming...
var v = +localStorage['visited'];

// Define an array of colours, based on Material Design Color recommendations
var colors = ['#f44336', '#009688', '#4caf50', '#ffc107', '#e91e63'];


// Get the current time and the time TechWeek starts at;
var now = (new Date()).getTime();
var start = (new Date("2016-02-15T12:00:00"));
var liveActive = false;
var liveShown = false;

// Set the constants for the amount of time in each time period
var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;

// setInterval allows you to do certain action every period of time (like cronjob)
setInterval(function(){

	// Check is current time + 10 minutes smaller than the starting time
	if(now+1000*60*10 < start){

		// If it is, show the box and start counting down
		$('#countdown').show(400);
	} else {
		liveActive = true;

		// Otherwise, show the livestream and abjust the height of it to be in
		// 19:6 aspect ratio

		// When done hiding the countdown show the livestream, make it take 400ms so there is a smooth transition
		if(liveActive){

			showLive();
		}
	}

	now += 1000;



	var dist = start - now;



	var days = Math.floor(dist / _day);
	var hours = Math.floor( (dist % _day) / _hour );
	var mins = Math.floor( (dist % _hour) / _minute );
	var secs = Math.floor( (dist % _minute) / _second );

	var str  = 	(days > 0) 		? "<span>" + days + " Days</span>" 		: "";
	str +=		(hours > 0) 	? "<span>" + hours + " Hours</span>"	: "";
	str +=		(mins > 0) 		? "<span>" + mins + " Minutes</span>"	: "";
	str +=		"<span>" + secs + " Seconds</span>";

	$('#countdown .counter').html(str);

// Set the time of the interval, in ms, so 1000 (1s)
},1000);

// Show the livefeed
function showLive(){
	if(!liveShown){
		$('#countdown').hide(400, function(){
			$('#livestream').show(0, function(){
				$('video').height(0);
				$("video").animate({height: $('video').width() * (9 / 16), display: "block"}, 1000);
			});

		});
		liveShown = true;
	}

}

// Load the events from the file and add them to the page
function loadEvents(days){
	var ce = $('.events');
	for(var i = 0; i < days.length; i++){
		var day = days[i];

		var ds = day.day+"-event";
		var ul = day.day+"-events";
		var de = $('<div id="'+day.day+'" class="container day"></div>').appendTo(ce);

		de.append('<h4 class="tooltipped day-name" data-position="right" data-tooltip="'+day.description+'">'+day.day+"</h4>");

		de.append('<ul id="'+ul+'"class="collapsible" data-collepsible="accordion"></ul>');

		for(var j = 0; j < day.events.length; j++){
			var event = day.events[j];

			var by = (event.by.length === 0) ? "" : "By: <i>" + event.by + "</i>";

			$("#"+ul).append(
				"<li>"+
					"<div class='collapsible-header'>" +
						"<div class='time'>"+ event.time + "</div>" +
						"<div class='event'>" + event.name + "</div>" +
						"<div class='place'>" + event.place.id + "</div>" +
					"</div>" +
					"<div class='collapsible-body'>" +
						"<p>" + by +"</by>"+
						"<p>" + event.description + "</p>" +
					"</div>" +
				"</li>"
			);
		}
	}

	$('h4').each( function( c ){
		$(this).css({color: colors[(v+c) % 5]});
	});


	$('.collapsible').collapsible();
    	$('.tooltipped').tooltip({delay: 10});

	$('.events .collapsible-header').each(function( ix ){
		$(this).css({
			height: 'initial',
			'line-height': "1.5rem",
			"padding": "1em",
			"-webkit-transition":"all 0.2s"
		});
	});

	$('ul').each( function ( c ){
		var all = this;
		$('.collapsible-header', all).click( function(){
			$('.collapsible-header', all).not(this).css({'background-color': 'rgb(255, 255, 255)'});
			var col = ($(this).css('background-color') == 'rgb(255, 255, 255)') ? colors[(v+c)%5] : 'rgb(255, 255, 255)';
			$(this).css({'background-color': col});

		});
	});
}
