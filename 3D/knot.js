

var scene, controls, fw;
var redRope, blueRope;

var Knots = {};

Knots.id = function id(x) { return x; };
Knots.fixed = function(x) { return function() { return x; }; };

Knots.Chessboard = function() {
    var SIZE = 20, WIDTH = 32, LENGTH = 32;

    var whiteMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
    var blackMaterial = new THREE.MeshPhongMaterial({color: 0x202020});

    whiteMaterial.combine = blackMaterial.combine = THREE.MixOperation;

    var whiteGeometry = new THREE.Geometry();
    var blackGeometry = new THREE.Geometry();

    for(var z=0 ; z<=LENGTH ; z++) for(var x=0; x<=WIDTH; x++) {
        whiteGeometry.vertices.push(new THREE.Vector3( x*SIZE, 0,  z*SIZE ));
        blackGeometry.vertices.push(new THREE.Vector3( x*SIZE, 0,  z*SIZE ));
    }
    for(var z=0 ; z<LENGTH ; z++) for(var x=0; x<WIDTH; x+=2) {
        var a = z * (WIDTH + 1) + (z % 2),
            b = (z + 1) * (WIDTH + 1) + (z % 2);

        whiteGeometry.faces.push(
            new THREE.Face3( a+x, b+x,   b+x+1 ),
            new THREE.Face3( a+x, b+x+1, a+x+1 )
        );

        a = z * (WIDTH + 1) + ((z + 1) % 2);
        b = (z + 1) * (WIDTH + 1) + ((z + 1) % 2);

        blackGeometry.faces.push(
            new THREE.Face3( a+x, b+x,   b+x+1 ),
            new THREE.Face3( a+x, b+x+1, a+x+1 )
        );
    }

    whiteGeometry.computeFaceNormals();
    whiteGeometry.computeVertexNormals();
    whiteGeometry.computeBoundingSphere();

    blackGeometry.computeFaceNormals();
    blackGeometry.computeVertexNormals();
    blackGeometry.computeBoundingSphere();

    this.whiteMesh = new THREE.Mesh(whiteGeometry, whiteMaterial);
    this.whiteMesh.translateX(-(WIDTH*SIZE/2));
    this.whiteMesh.translateY(-50);
    this.whiteMesh.translateZ(-(LENGTH*SIZE/2));

    this.blackMesh = new THREE.Mesh(blackGeometry, blackMaterial);
    this.blackMesh.translateX(-(WIDTH*SIZE/2));
    this.blackMesh.translateY(-50);
    this.blackMesh.translateZ(-(LENGTH*SIZE/2));
};


Knots.Floor = function() {
    var geometry = new THREE.PlaneGeometry(1000, 640);
    var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshPhongMaterial({color: 0xD0D0D0, map: texture});

    THREE.Mesh.call(this, geometry, material);
    this.rotation.x = -Math.PI/2;
    this.translateZ(-120);
};
Knots.Floor.prototype = Object.create(THREE.Mesh.prototype);

Knots.Ceiling = function() {
    THREE.Object3D.call(this);

    var geometry = new THREE.PlaneGeometry(1000, 640);
    var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

    var north = new THREE.Mesh(geometry, material);
    var south = new THREE.Mesh(geometry, material);
    north.rotateX(Math.PI/2.5); south.rotateX(-Math.PI/2.5);
    this.add(north, south);
    this.translateY(320);
};
Knots.Ceiling.prototype = Object.create(THREE.Object3D.prototype);

Knots.Walls = function() {
    THREE.Object3D.call(this);

    var geometry = new THREE.PlaneGeometry(1000, 550);
    var brickTexture = THREE.ImageUtils.loadTexture("brick-wall.jpg");
    brickTexture.wrapS = brickTexture.wrapT = THREE.RepeatWrapping;
    var brickMaterial = new THREE.MeshLambertMaterial({map: brickTexture});

    var north = new THREE.Mesh(geometry, brickMaterial);
    var east = new THREE.Mesh(geometry, brickMaterial);
    var south = new THREE.Mesh(geometry, brickMaterial);
    var west = new THREE.Mesh(geometry, brickMaterial);

    north.translateZ(-320);
    east.translateX(500); east.rotateY(-Math.PI/2);
    south.translateZ(320); south.rotateY(Math.PI);
    west.translateX(-500); west.rotateY(Math.PI/2);

    this.add(north, east, south, west);
    this.translateY(40);
};
Knots.Walls.prototype = Object.create(THREE.Object3D.prototype);


Knots.Lamp = function() {
    THREE.Object3D.call(this);

    var shadeGeometry = new THREE.CylinderGeometry(10, 40, 30, 40, 2, true);
    var texture = THREE.ImageUtils.loadTexture("metal-rust.jpg");
    var shadeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, map: texture});
    var shade = new THREE.Mesh(shadeGeometry, shadeMaterial);

    var bulbMaterial = new THREE.MeshPhongMaterial({emissive: 0xD0D0D0});
    var bulb = new THREE.Mesh(new THREE.SphereGeometry( 15, 32, 32 ), bulbMaterial);

    var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI/2);
    light.castShadow = true;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 1000;
    light.shadowCameraFov = 60;
    light.shadowCameraVisible = true;

    this.add( shade, bulb, light );
    this.translateY(180);
};
Knots.Lamp.prototype = Object.create(THREE.Object3D.prototype);

Knots.Truss = function() {
    THREE.Object3D.call(this);

    var geometry = new THREE.BoxGeometry(20, 30, 640);
    var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
    var material = new THREE.MeshPhongMaterial({color: 0xA0A0A0, map: texture});

    var beam = new THREE.Mesh(geometry, material);
    var northSlope = new THREE.Mesh(geometry, material);
    var southSlope = new THREE.Mesh(geometry, material);
    northSlope.rotateX(Math.PI/2 - Math.PI/2.5);
    southSlope.rotateX(Math.PI/2 + Math.PI/2.5);
    northSlope.translateY(100);
    southSlope.translateY(-100);
    this.add(beam, northSlope, southSlope);
    this.translateY(210);
}
Knots.Truss.prototype = Object.create((THREE.Object3D.prototype));

Knots.FullWindow = function(opt) {
    var width = window.innerWidth,
        height = window.innerHeight;

    var renderer = this.renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    var camera = this.camera = new THREE.PerspectiveCamera(opt.view || 60, width / height, 0.1, opt.far || 2000);
    camera.position.x = opt.x || 0;
    camera.position.y = opt.y || 80;
    camera.position.z = opt.z || 320;

    if(opt.resize) window.addEventListener('resize', function() {
        var width = window.innerWidth,
            height = window.innerHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
};

Knots.FullWindow.prototype.render = function(scene) {
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

    fw = new Knots.FullWindow({resize: true});

    scene = new THREE.Scene();
    scene.add(fw.camera);

    scene.add(new THREE.HemisphereLight(0x888888, 0xB4B4B4, 0.5));
    scene.add(new Knots.Floor());
    scene.add(new Knots.Ceiling());
    scene.add(new Knots.Walls());

    var truss1 = new Knots.Truss();
    var truss2 = new Knots.Truss();
    var truss3 = new Knots.Truss();
    truss1.translateX(-500);
    truss2.translateX(500);
    scene.add(truss1, truss2, truss3);

    scene.add(new Knots.Lamp());

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

    controls = new THREE.OrbitControls(fw.camera, fw.renderer.domElement);
    controls.minPolarAngle = Math.PI/3.2;
    controls.maxPolarAngle = Math.PI/1.75;
    controls.noZoom = true;
    //controls.autoRotate = true;
};


var render = function() {
    window.requestAnimationFrame(render);

    redRope.rotation.y += 0.005;
    blueRope.rotation.y -= 0.005;

    fw.render(scene);
    controls.update();
};

init();
render();