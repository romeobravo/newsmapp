var markerData = {};
var countries = {};
var lastCountry;

function redraw() {
	for(var mid in markerData) {
		if(!markerData[mid].show.search || !markerData[mid].show.category) {
			markerData[mid].circle.hide();
			$(markerData[mid].item).fadeOut();
		} else {
			markerData[mid].circle.show();
			$(markerData[mid].item).fadeIn();
		}
	}
}

function markerClick(marker) {
	var code = $(marker).attr('data-index');
	window.location = './#/article/' + code + '/' + map.markers[code].config.title ;	
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
	//console.log("query", query);
	query = query.toLowerCase();
	for(var mid in markerData) {
		var data = markerData[mid];
		var haystack = data.category + ' ';
		haystack += data.headline + ' ';
		haystack += data.summary + ' ';
		haystack += data.provider + ' ';
		haystack += data.title + ' ';
		data.country.forEach(function(code) {
			haystack += map.mapData.paths[code].name + ' ';
			haystack += code + ' ';
		});
		haystack = haystack.toLowerCase();
		if(haystack.indexOf(query) == -1) {
			$(this).hide();
			data.show.search = false;
		} else {
			$(this).show();
			data.show.search = true;
		}
		redraw();		
	}
	map.clearSelectedRegions();
	$('.countryFound').remove();
	if(query.length > 1) {
		var result = [];
		for(var c in countries) {
			var haystack = c + ' ';
			haystack += countries[c].config.name;
			haystack = haystack.toLowerCase();
			if(haystack.indexOf(query) > -1) {
				result.push({
					'code' : c,
					'priority' : haystack.indexOf(query)
				});
			}
		}	
		//console.log(result);
		result.sort(function(a, b) {return a['priority'] - b['priority']});
		var countryArray = [];
		var html = "";
		for(var c in result) {
			countryArray.push(result[c].code);
			html += '<a href="./#/country/' + result[c].code + '"><div class="countryFound"><span>' + countries[result[c].code].config.name + '</span></div></a>';
		}
		//console.log(result);
		//console.log(countryArray);
		console.log(html);
		$('.page2').prepend(html);
		map.setSelectedRegions(countryArray);
	}

}

if (window.jQuery) {  console.log('Maphandler'); }

var map = new jvm.Map({
    container: $('#map'),
	map: 'world_mill_en',
	onRegionClick: function(event, code) {
		window.location = './#/country/' + code;
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
		countries = map.regions;
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
			markerData[mid].marker = map.markers[marker._id];
			markerData[mid].circle = $('circle[data-index="' + marker._id + '"]');
			markerData[mid].show = {};
			markerData[mid].show.search = true;
			markerData[mid].show.category = true;
			markerData[mid].item = '.marker-' + marker._id;
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
			.on('input', '.tool-search-bar', function() {
				filter($(this).val());
			});
		$('.tool-search-svg')
			.on('click', function() {
				if($('.navsearch').hasClass('navsearch-open')) {
					$('.navsearch').removeClass('navsearch-open');
					$('.tool-search-bar').removeClass('tool-open');
					$('.tool-search-bar').val('');
					filter('');
				} else {
					$('.navsearch').addClass('navsearch-open');
					$('.tool-search-bar').addClass('tool-open');
					setTimeout(function() {
						$('.tool-search-bar').focus();
					}, 50);
				}
			});		
	}).error(function(err) {
		console.log(err);
	});
	map.container.click(function(e){
		console.log(map.pointToLatLng(e.offsetX, e.offsetY));
	});
});