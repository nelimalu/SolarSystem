var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

var center = {
	x: canvas.width / 2,
	y: canvas.height / 2
};

const M = Math.pow(10, 6);


function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

function regulate(number) {
	return number / 12_000_000;
}

function ellipse(x, y, left, right, eccentricity) {
	var up = ((left + right) / 2) * Math.sqrt(1 - Math.pow(eccentricity, 2));
	var down = up;


	c.beginPath();
	c.ellipse(x, y, right, down, degToRad(0), 0, Math.PI * 0.5);
	c.stroke();

	c.beginPath();
	c.ellipse(x, y, up, right, degToRad(-90), 0, Math.PI * 0.5);
	c.stroke();

	c.beginPath();
	c.ellipse(x, y, left, up, degToRad(180), 0, Math.PI * 0.5);
	c.stroke();

	c.beginPath();
	c.ellipse(x, y, down, left, degToRad(90), 0, Math.PI * 0.5);
	c.stroke();
}

function resetCenter() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	center = {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
}


function Planet(colour, diameter, orbit_length, aphelion, perihelion, eccentricity) {
	this.colour = colour;
	this.diameter = diameter;
	this.aphelion = aphelion;
	this.perihelion = perihelion;
	this.eccentricity = eccentricity;
	this.orbit_length = orbit_length;

	this.draw_orbit = function() {
		c.strokeStyle = this.colour;
		ellipse(center.x, center.y, this.aphelion, this.perihelion, this.eccentricity);
	}
}


var planets = [new Planet("gray", 5, 5, regulate(69.817 * M), regulate(46.002 * M), 0.2056),
			   new Planet("lime", 5, 5, regulate(152.1 * M), regulate(147.1 * M), 0.0167086),
			   new Planet("orange", 5, 5, regulate(206.7 * M), regulate(249.2 * M), 0.0934),
			   new Planet("red", 5, 5, regulate(108.94 * M), regulate(107.48 * M), 0.0068),
			   new Planet("burlywood", 5, 5, regulate(816.618 * M), regulate(740.522 * M), 0.0489),
			   new Planet("peachpuff", 5, 5, regulate(1514.504 * M), regulate(1352.55 * M), 0.0565),
			   new Planet("paleturquoise", 5, 5, regulate(3003.625 * M), regulate(2741.302 * M), 0.0457),
			   new Planet("blue", 5, 5, regulate(4545.671 * M), regulate(4444.449 * M), 0.0113)]

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	resetCenter();

	for (let planet of planets) {
		planet.draw_orbit();
	}

	c.beginPath();
	c.arc(center.x, center.y, regulate(1.3927 * M), 0, Math.PI * 2, false);
	c.fillStyle = "orange";
	c.fill();

}
animate();
