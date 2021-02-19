var canvas = document.querySelector('canvas');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var controls = new THREE.OrbitControls(camera, renderer.domElement);

const RATIO = 12_000_000;
const M = 1_000_000;
const SENSITIVITY = 1000;

var MOUSE_LOCKED = false;

renderer.setClearColor("#101010");
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.y = 10;
camera.updateProjectionMatrix();
controls.target = new THREE.Vector3(0,0,0);
controls.maxDistance = 450;
controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

document.addEventListener("wheel", (event) => {
	camera.position.y += (event.wheelDelta / -150) * (camera.position.y / 7);
	if (camera.position.y < 1) {
		camera.position.y = 1;
	}
	if (camera.position.y > 612) {
		camera.position.y = 612;
	}
});

function rgb(red, green, blue) {
	return new THREE.Color("rgb(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")");
}

function regulate(number) {
	return number / RATIO;
}

function rad(deg) {
	return deg * Math.PI / 180;
}

function Planet(colour, diameter, orbit_time, inclination, aphelion, perihelion, eccentricity) {
	this.colour = colour;
	this.diameter = diameter;
	this.aphelion = aphelion;
	this.perihelion = perihelion;
	this.eccentricity = eccentricity;
	this.inclination = inclination

	this.semiMajor = (aphelion + perihelion) / 2;
	this.center = this.semiMajor - this.perihelion;
	this.yRadius = this.semiMajor * Math.sqrt(1 - Math.pow(eccentricity, 2));

	this.drawRing = function() {
		const curve = new THREE.EllipseCurve(
			this.center,  0,            // x, y
			this.semiMajor, this.yRadius,           // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			rad(7)                // aRotation
		);

		const points = curve.getPoints(100);
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({color: this.colour});
		const ellipse = new THREE.Line(geometry, material);
		ellipse.rotation.x += rad(90);

		scene.add(ellipse);
	}

}

function createSun() {
	var geometry = new THREE.SphereGeometry(regulate(1.3927 * M), 100, 100);  // distance, vertical vertices, horizontal vertices
	var material = new THREE.MeshLambertMaterial({color: rgb(255,165,0)});
	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.set(0,0,0);
	scene.add(mesh);
}

function setLight() {
	var light = new THREE.PointLight(0xFFFFFF, 1, 1000);  // colour, intensity, distance
	light.position.set(0,0,0);  // x y z
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);  // colour, intensity, distance
	light.position.set(0,25,0);  // x y z
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);
	light.position.set(0,-25,0);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);
	light.position.set(25,-25,0);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);
	light.position.set(-25,25,0);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);
	light.position.set(0,25,-25);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 5, 1000);
	light.position.set(0,25,25);
	scene.add(light);
}

var planets = [new Planet(rgb(219,206,202), 5, 5, 7, regulate(69.817 * M), regulate(46.002 * M), 0.2056), // Mercury
				new Planet(rgb(205,133,63), 5, 5, 3.4, regulate(108.94 * M), regulate(107.48 * M), 0.0068), // Venus
			   new Planet(rgb(34, 139, 34), 5, 5, 0, regulate(152.1 * M), regulate(147.1 * M), 0.0167086), // Earth
			   new Planet(rgb(161, 37, 27), 5, 5, 1.9, regulate(206.7 * M), regulate(249.2 * M), 0.0934), // Mars
			   new Planet(rgb(227, 110, 75), 5, 5, 1.3, regulate(816.618 * M), regulate(740.522 * M), 0.0489), // Jupiter
			   new Planet(rgb(255,218,185), 5, 5, 2.5, regulate(1514.504 * M), regulate(1352.55 * M), 0.0565), // Saturn
			   new Planet(rgb(79, 208, 231), 5, 5, 0.8, regulate(3003.625 * M), regulate(2741.302 * M), 0.0457), // Uranus
			   new Planet(rgb(142, 195, 195), 5, 5, 1.8, regulate(4545.671 * M), regulate(4444.449 * M), 0.0113)]; // Neptune


setLight();
createSun();

for (let planet of planets) {
	planet.drawRing();
}

var render = function() {
	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
}

render();
