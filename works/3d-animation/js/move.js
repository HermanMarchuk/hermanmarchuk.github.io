(function() {
	'use strict';

	var carousel = document.querySelector('.carousel');
	var i = 0;
	setInterval(function() {
		if (i === 360) {
			i = 0;
		}
		
		var computedCoordinates = 'rotateX(0deg) rotateY(' + i + 'deg) rotateZ(0deg)';

		carousel.style.transform = computedCoordinates;
		i += 5;
		console.log('computedCoordinates', computedCoordinates);
	}, 30);

	

})();