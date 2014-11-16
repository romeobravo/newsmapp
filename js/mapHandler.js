function markerClick(code) {
	console.log(map.markers[code].config.title)
	window.location = '/#/article/' + code + '/' + map.markers[code].config.title ;	
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
	backgroundColor: '#4682B4'
});
console.log('dafasd');

$(window).on('load', function() {
	$.ajax({
		url: "/api/post/all"
	}).done(function(data) {
		console.log(data);
		data.forEach(function(marker) {
			map.addMarker(
				marker._id,		
				{
					fill: 'black',
					latLng: [marker.lat, marker.lng],
					r: 5,
					stroke: '#505050',
					title: marker.title,
				},
				[]
			);
		});
	}).error(function(err) {
		console.log(err);
	});
});