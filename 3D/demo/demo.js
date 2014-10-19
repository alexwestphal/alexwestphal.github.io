(function(Knots) {

var scene, controls, screen;
var redRope, blueRope;

Knots.Screen = function(opt) {
    var width = window.innerWidth - 360,
        height = window.innerHeight;

    var renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    var camera = this.camera = new THREE.PerspectiveCamera(opt.view || 60, width / height, 0.1, opt.far || 5000);
    camera.position.x = opt.x || 0;
    camera.position.y = opt.y || 80;
    camera.position.z = opt.z || 400;

    if(opt.resize) window.addEventListener('resize', function() {
        var width = window.innerWidth - 360,
            height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
};
Knots.Screen.prototype.render = function(scene) {
    this.renderer.render(scene, this.camera);
};

Knots.Rope = function(path, opt) {
    var material = new THREE.MeshPhongMaterial({color: opt.color || 0, side: THREE.DoubleSide});

    var points = path.getPoints();
    for(var i=0; i<points.length; i++) {
        points[i] = new THREE.Vector3(points[i].x, points[i].y, 0);
    }
    var f = function(i) { return 10*Math.sin(3*i*Math.PI/(points.length-2)); }
    for(i=1; i<points.length-1; i++) points[i].z = f(i);

    var geometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 64, 4);
    THREE.Mesh.call(this, geometry, material);
}
Knots.Rope.prototype = Object.create(THREE.Mesh.prototype);


var init = function() {

    screen = new Knots.Screen({resize: true});

    scene = new THREE.Scene();
    scene.add(screen.camera);

    scene.add(new THREE.HemisphereLight(0x888888, 0xD0D0D0, 0.6));
    scene.add(new Knots.ScoutHall());

    var path = new THREE.Path([new THREE.Vector2(-100, -10)]);
    path.lineTo(-40,-10);
    path.bezierCurveTo(-10,-10, -10,-30, 20,-30);
    path.bezierCurveTo(50,-30, 50,30, 20,30);
    path.bezierCurveTo(-10,30, -10,10, -40,10);
    path.lineTo(-70, 10);

    redRope = new Knots.Rope(path, {color: 0xDD4444});
    blueRope = new Knots.Rope(path, {color: 0x2222DD});

    blueRope.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
    scene.add(redRope, blueRope);

    var hand = new Knots.Hand(); hand.scale.set(3,3,3);
    hand.translateX(80); hand.translateY(-1);
    hand.translateZ(-35);
    scene.add(hand);
    hand.pinch(1);

    controls = new THREE.OrbitControls(screen.camera, screen.renderer.domElement);
    controls.minPolarAngle = Math.PI/3.2;
    controls.maxPolarAngle = Math.PI/1.75;
    controls.minDistance = 0;
    controls.maxDistance = 450;
    //controls.dollyIn(4);
    //controls.autoRotate = true;
};


var render = function(timestamp) {
    window.requestAnimationFrame(render);

    //redRope.rotation.y += 0.005;
    //blueRope.rotation.y -= 0.005;

    screen.render(scene);
    controls.update();
};

init();
render();

})(window.Knots);