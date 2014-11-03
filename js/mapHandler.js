if (window.jQuery) {  console.log('Maphandler'); }
new jvm.Map({
    container: $('#map'),
	map: 'world_mill_en',
	onRegionClick: function(event, code) {
		window.location = '#/country/' + code;
		console.log(code);
	},
	onMarkerClick: function(event, code) {
		console.log(event);
		console.log(code);
		window.location = '#/about/' + code;
	},
	markers: [
		{
			fill: 'black',
			latLng: [50,50],
			r: 5,
			stroke: '#505050',
			article: 'aaa',
			name: 'aaa'
		},
		{
			fill: 'grey',
			latLng: [25,25],
			r: 5,
			stroke: '#505050',
			article: 'bbb',
			name: 'bbb'			
		},
		{
			fill: 'grey',
			latLng: [0, 0],
			r: 5,
			stroke: '#505050',
			article: 'bbb',
			name: 'ccc'			
		},
		{
			fill: 'grey',
			latLng: [52,4],
			r: 5,
			stroke: '#505050',
			article: 'bbb',
			name: 'ddd'			
		}				
	],
	regionStyle: {
		initial: {
			fill: 'beige',
			stroke: 'navy',
			"stroke-width": 0
		}
	},
	backgroundColor: '#4682B4'
});
console.log('dafasd');

$('.jvectormap-marker').on('click', function() {
	window.location = '#/about';
});