var markerData = {};
var lastCountry;

function markerClick(marker) {
	var code = $(marker).attr('data-index');
	window.location = '/#/article/' + code + '/' + map.markers[code].config.title ;	
	markerLeave(marker);
}

function markerEnter(marker, label) {
	if($(marker).attr('class').indexOf('circle-hover') < 0) {
		$(marker).attr('class', $(marker).attr('class') + ' circle-hover');
	}
	if(label) {
		var offset = $(marker).offset();
		var index = $(marker).attr('data-index');
		var data = markerData['m' + index];

		$('.labeltext').html(data.title);
		$('.label').css('top', offset.top - 80);
		$('.labelpointer').css('top', offset.top - 25);
		var left = offset.left - $('.label').outerWidth() / 2;
		if(left < 10) {
			left = 10;
		}
		$('.label').css('left', left);
		$('.labelpointer').css('left', offset.left - 15);

		if(!$('.label').hasClass('visible')) {
			$('.label').addClass('visible');
		}
		switch(data.category) {
			case "politics":
				$('.label').css('border-color', '#2AB633');
				break;
			case "technology":
				$('.label').css('border-color', '#2D5898');
				break;
			case "conflict":
				$('.label').css('border-color', '#C0392B');
				break;
			case "economy":
				$('.label').css('border-color', '#E7A535');
				break;
			case "sports":
				$('.label').css('border-color', '#2c3e50');
				break;

			default:
				$('.label').css('border-color', '#000000');
				break;
		}	
	}
}

function markerLeave(marker) {
	$('.label').removeClass('visible');
	if($(marker).attr('class').indexOf('circle-hover') > -1) {
		var classList = $(marker).attr('class');
		classList = classList.replace(' circle-hover', '');
		$(marker).attr('class', classList);
	}
}

function filter(query) {
	console.log("query", query);
	query = query.toLowerCase();
	$('.item').each(function() {
		var classString = $(this).attr("class");
		var mid = 'm' + classString.substring(12);
		var data = markerData[mid];
		var haystack = data.category + ' ';
		haystack += data.headline + ' ';
		haystack += data.summary + ' ';
		haystack += data.provider + ' ';
		haystack += data.title + ' ';
		data.country.forEach(function(code) {
			haystack += map.mapData.paths[code].name + ' ';
		});
		haystack = haystack.toLowerCase();
		if(haystack.indexOf(query) == -1) {
			$(this).hide();
		} else {
			$(this).show();
		}
	});		
}

if (window.jQuery) {  console.log('Maphandler'); }
var map = new jvm.Map({
    container: $('#map'),
	map: 'world_mill_en',
	onRegionClick: function(event, code) {
		window.location = '#/country/' + code;
		console.log(code);
	},
	regionStyle: {
		initial: {
			fill: '#ffffff'
		},
		selected: {
			fill: '#cccccc'
		}
	},
	//backgroundColor: '#4682B4'
	backgroundColor: '#306AA3'
});

$(window).on('load', function() {
	$.ajax({
		url: "/api/post/all"
	}).done(function(data) {
		data.forEach(function(marker) {
			var mid = 'm' + marker._id;
			markerData[mid] = marker;
			map.addMarker(
				marker._id,		
				{
					initial: {
						fill: '#2D5898',
						stroke: '#2D5898'
					},			
					latLng: [marker.lat, marker.lng],
					title: marker.title,
					type: 'circle',
					category: marker.category
				},
				[]
			);
		});
		$('.jvectormap-marker')
			.on('click', function() {
				//console.log(this);
				markerClick(this);				
			})
			.on('mouseenter', function() {
				//console.log(this);
				markerEnter(this, true);
			})
			.on('mouseleave', function() {
				//console.log(this);
				markerLeave(this);
			});
		$('body')
			.on('click', '.item', function() {
				var classString = $(this).attr("class");
				var id = classString.substring(12);
				var marker = $('circle[data-index=' + id + ']').get(0);				
				markerLeave(marker);				
			})
			.on('mouseenter', '.item', function() {
				var classString = $(this).attr("class");
				var id = classString.substring(12);
				var marker = $('circle[data-index=' + id + ']').get(0);
				markerEnter(marker, false);
			})
			.on('mouseleave', '.item', function() {
				var classString = $(this).attr("class");
				var id = classString.substring(12);
				var marker = $('circle[data-index=' + id + ']').get(0);				
				markerLeave(marker);
			})
			.on('click', '.tool-search-svg-container', function() {
				if($('.tool-search-bar').hasClass('tool-folded')) {
					$('.tool-search-bar').removeClass('tool-folded');
					$('.tool-search-bar').val('');
					filter('');
				} else {
					console.log('fold open');
					$('.tool-search-bar').addClass('tool-folded');
					setTimeout(function() {
						$('.tool-search-bar').focus();
					}, 50);
				}
			})
			.on('input', '.tool-search-bar', function() {
				filter($(this).val());
			});		
	}).error(function(err) {
		console.log(err);
	});
	map.container.click(function(e){
		console.log(map.pointToLatLng(e.offsetX, e.offsetY));
	});
});