var markerData;

function markerClick(code) {
	console.log(map.markers[code].config.title)
	window.location = '/#/article/' + code + '/' + map.markers[code].config.title ;	
	markerLeave();
}

function markerEnter(marker, label) {
	if($(marker).attr('class').indexOf('circle-hover') < 0) {
		$(marker).attr('class', $(marker).attr('class') + ' circle-hover');
	}
	if(label) {
		var offset = $(marker).offset();
		var index = $(marker).attr('data-index');
		var data = $.grep(markerData, function(e){ return e._id == index; });
		$('.labeltext').html(data[0].title);
		$('.label').css('top', offset.top - 85);
		var left = offset.left - $('.label').outerWidth() / 2;
		if(left < 10) {
			left = 10;
		}
		$('.label').css('left', left);
		if(!$('.label').hasClass('visible')) {
			$('.label').addClass('visible');
		}
		switch(data[0].category) {
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

if (window.jQuery) {  console.log('Maphandler'); }
var map = new jvm.Map({
    container: $('#map'),
	map: 'world_mill_en',
	onRegionClick: function(event, code) {
		window.location = '#/country/' + code;
		console.log(code);
	},
	onMarkerClick: function(event, code) {
		markerClick(code);
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
console.log('dafasd');

$(window).on('load', function() {
	$.ajax({
		url: "/api/post/all"
	}).done(function(data) {
		markerData = data;
		console.log("markerData", markerData);
		data.forEach(function(marker) {
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
			.on('mouseenter', function() {
				markerEnter(this, true);
			})
			.on('mouseleave', function() {
				markerLeave(this, true);
			});
		$('body')
			.on('mouseenter', '.item', function() {
				var classString = $(this).attr("class");
				var id = classString.substring(classString.length - 2);
				var ele = $('circle[data-index=' + id + ']').get(0);
				markerEnter(ele, false);
			})
			.on('mouseleave', '.item', function() {
				var classString = $(this).attr("class");
				var id = classString.substring(classString.length - 2);
				var ele = $('circle[data-index=' + id + ']').get(0);				
				markerLeave(ele, false);
			});			
	}).error(function(err) {
		console.log(err);
	});
	map.container.click(function(e){
		console.log(map.pointToLatLng(e.offsetX, e.offsetY));
	});
});