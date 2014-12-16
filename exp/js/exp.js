function timer() {
	setTimeout( function() {
		var time = localStorage.getItem('time');
		if(time) {
			localStorage.setItem('time', parseInt(time) + 1);
		} else {
			localStorage.setItem('time', 0);
		}

		if(localStorage.getItem('state') == '22') {
			if(time > 599) {
				localStorage.setItem('state', 21);
				loadPage();					
				$('.intropage').fadeIn();				
			} else {
				var timeleft = 600 - parseInt(time);
				if($('.testtimer').length > 0)
					$('.testtimer').find('span').html( parseInt(timeleft / 60) + ':' + timeleft % 60);
				timer();
			}
		}
	}, 1000);
}

function postResult() {
	var data = {};
	data._id = localStorage.getItem('id');
	data.map = localStorage.getItem('map');
	data.Q10 = localStorage.getItem('Q10');
	data.Q20 = localStorage.getItem('Q20');
	$.ajax({
		type: "POST",
		url: "/api/exp/result",
		data: JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	})	
	.done(function(msg) {
		console.log(msg);
	});
}

function loadPage() {
	var state = localStorage.getItem('state');
	switch(state) {
		case '0':
			$('.intropage').load('./states/state0.html');		
			break;
		case '10':
			$('.intropage').load('./states/state10.html');
			break;
		case '20':
		case '22':
			$('.intropage').load('./states/state20.html');
			break;
		case '21':
			$('.intropage').load('./states/state21.html');
			break;
		case '40':
			postResult();
			$('.intropage').load('./states/state40.html');
			break;			
	}	
}

$('body')
	.on('click', '.exploretest', function() {
		var Q10 = {};
		Q10.q1 = $('.q1').val();
		Q10.q2 = $('.q2').val();
		Q10.q3 = $('.q3').val();
		Q10.q4 = $('.q4').val();
		Q10.q5 = $('.q5').val();
		Q10 = JSON.stringify(Q10);
		localStorage.setItem('Q10', Q10);
		localStorage.setItem('state', 10);
		if(localStorage.getItem('map') == 'false') {
			$('.map').css('opacity', 0);
		}
		$('nav').find('ul').prepend('<li class="navitem navconflict stopexploring"><a href=""><span>STOP</span></a></li>')
		$('.intropage').fadeOut();
	})
	.on('click', '.explorecont', function() {
		if($('.stopexploring').length == 0)
			$('nav').find('ul').prepend('<li class="navitem navconflict stopexploring"><a href=""><span>STOP</span></a></li>')
		$('.intropage').fadeOut();		
	})
	.on('click', '.stopexploring', function() {
		loadPage();
		$('.intropage').fadeIn();
	})
	.on('click', '.begintest', function() {
		$('.stopexploring').remove();
		localStorage.setItem('state', 20);
		loadPage();
	})
	.on('click', '.continuetest', function() {
		if($('.testtimer').length == 0)
			$('nav').find('ul').prepend('<li class="navitem navconflict testtimer"><a href=""><span></span></a></li>')
		if(localStorage.getItem('state') == 20) {
			localStorage.setItem('state', 22);
			localStorage.setItem('time', 0);
		}
		if (localStorage.getItem('map') == false) {
			$('.map').css('opacity', 0);
		}
		$('.intropage').fadeOut();
		timer();
	})
	.on('click', '.savetest21', function() {
		var Q20 = {};
		Q20.q1 = $('.q1').val();
		Q20.q2 = $('.q2').val();
		Q20.q3 = $('.q3').val();
		Q20.q4 = $('.q4').val();
		Q20.q5 = $('.q5').val();
		Q20.q6 = $('.q6').val();
		Q20.q7 = $('.q7').val();
		Q20.q8 = $('.q8').val();
		Q20.q9 = $('.q9').val();
		Q20.q10 = $('.q10').val();
		Q20.q11 = $('.q11').val();
		Q20.q12 = $('.q12').val();
		Q20.q13 = $('.q13').val();
		Q20.q14 = $('.q14').val();
		Q20.q15 = $('.q15').val();
		Q20.q16 = $('.q16').val();
		Q20 = JSON.stringify(Q20);
		localStorage.setItem('Q20', Q20);
		localStorage.setItem('state', 40);
		loadPage();
	})
	.on('click', '.sendtest', function() {
		localStorage.clear();
		location.reload();
	})
	.on('hover', '.testtimer', function() {
		$('.testtimer').find('span').html('STOP');
	})
	.on('click', '.testtimer', function() {
		localStorage.setItem('state', 21);
		loadPage();					
		$('.intropage').fadeIn();
	});

if(!localStorage.getItem('id')) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	if(Math.random() > 0.49) {
		localStorage.setItem('map', true);
	} else {
		localStorage.setItem('map', false);
	}

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	localStorage.setItem('id', text);
	localStorage.setItem('state', 0);
}

loadPage();