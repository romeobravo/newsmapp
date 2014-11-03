function markerClick(code) {
	console.log(map.markers[code].config.article)
	window.location = '#/article/' + code + '/' + map.markers[code].config.article;	
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
				marker.id,		
				{
					fill: 'black',
					latLng: [0,0],
					r: 5,
					stroke: '#505050',
					article: 'The Lorum Ipsum has been voted to parlement',
				},
				[]
			);
		});
	}).error(function(err) {
		console.log(err);
	});
	map.addMarker(
		"123",		
		{
			fill: 'black',
			latLng: [0,0],
			r: 5,
			stroke: '#505050',
			article: 'The Lorum Ipsum has been voted to parlement',
		},
		[]
	);	
});