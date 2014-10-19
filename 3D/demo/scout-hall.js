(function(Knots) {

    Knots.Floor = function() {
        THREE.Object3D.call(this);

        var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");

        var material = new THREE.MeshPhongMaterial({color: 0xD0D0D0, map: texture});
        var ringMaterial = new THREE.MeshLambertMaterial({color: 0xE0E0E0});

        var floor = new THREE.Mesh(new THREE.PlaneGeometry(1600, 800), material);
        var ring  = new THREE.Mesh(new THREE.RingGeometry(230, 250, 64, 8), ringMaterial);

        ring.translateZ(1);

        this.add(floor, ring);
        this.rotateX(-Math.PI/2);
        this.translateZ(-120);
    };
    Knots.Floor.prototype = Object.create(THREE.Object3D.prototype);


    Knots.Ceiling = function() {
        THREE.Object3D.call(this);

        var geometry = new THREE.PlaneGeometry(1600, 1000);
        var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

        var north = new THREE.Mesh(geometry, material);
        var south = new THREE.Mesh(geometry, material);
        north.rotateX(Math.PI/2.5); south.rotateX(-Math.PI/2.5);
        this.add(north, south);
        this.translateY(370);
    };
    Knots.Ceiling.prototype = Object.create(THREE.Object3D.prototype);


    Knots.Walls = function() {
        THREE.Object3D.call(this);

        var longGeometry = new THREE.PlaneGeometry(1600, 400);
        var shortGeometry = new THREE.PlaneGeometry(800, 600);
        var signGeometry = new THREE.PlaneGeometry(437, 158);

        var shortTexture = THREE.ImageUtils.loadTexture("brick-wall.jpg");
        var longTexture = THREE.ImageUtils.loadTexture("brick-wall.jpg");
        var signTexture = THREE.ImageUtils.loadTexture("scout_logo.jpg");

        shortTexture.wrapS = shortTexture.wrapT = THREE.RepeatWrapping;
        longTexture.wrapS = longTexture.wrapT = THREE.RepeatWrapping;
        shortTexture.repeat.set(2,2); longTexture.repeat.set(4,1.5);

        var shortMaterial = new THREE.MeshLambertMaterial({map: shortTexture});
        var longMaterial = new THREE.MeshLambertMaterial({map: longTexture});
        var signMaterial = new THREE.MeshLambertMaterial({map: signTexture});

        var north = new THREE.Mesh(longGeometry, longMaterial);
        var east = new THREE.Mesh(shortGeometry, shortMaterial);
        var south = new THREE.Mesh(longGeometry, longMaterial);
        var west = new THREE.Mesh(shortGeometry, shortMaterial);
        var sign = new THREE.Mesh(signGeometry, signMaterial);

        north.translateZ(-400);
        east.translateX(800); east.rotateY(-Math.PI/2);
        south.translateZ(400); south.rotateY(Math.PI);
        west.translateX(-800); west.rotateY(Math.PI/2);
        sign.translateZ(-398);

        this.add(north, east, south, west, sign);
        this.translateY(40);
    };
    Knots.Walls.prototype = Object.create(THREE.Object3D.prototype);


    Knots.Truss = function() {
        THREE.Object3D.call(this);

        var geometry = new THREE.BoxGeometry(20, 30, 800);
        var innerGeometry = new THREE.BoxGeometry(20, 30, 200);
        var texture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
        var material = new THREE.MeshPhongMaterial({color: 0xA0A0A0, map: texture});

        var beam = new THREE.Mesh(geometry, material);
        var northSlope = new THREE.Mesh(geometry, material);
        var southSlope = new THREE.Mesh(geometry, material);
        var northInner = new THREE.Mesh(innerGeometry, material);
        var southInner = new THREE.Mesh(innerGeometry, material);

        northSlope.rotateX(Math.PI/2 - Math.PI/2.5);
        southSlope.rotateX(Math.PI/2 + Math.PI/2.5);
        northInner.rotateX(Math.PI/2 - Math.PI/2.5);
        southInner.rotateX(Math.PI/2 + Math.PI/2.5);

        northSlope.translateY(120);
        southSlope.translateY(-120);
        northInner.translateZ(-100);
        southInner.translateZ(-100);
        this.add(beam, northSlope, southSlope, northInner, southInner);
        this.translateY(240);
    }
    Knots.Truss.prototype = Object.create(THREE.Object3D.prototype);


    Knots.Lamp = function() {
        THREE.Object3D.call(this);

        var shadeGeometry = new THREE.CylinderGeometry(10, 40, 30, 40, 2, true);
        var texture = THREE.ImageUtils.loadTexture("metal-rust.jpg");
        var shadeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, map: texture});
        var shade = new THREE.Mesh(shadeGeometry, shadeMaterial);

        var bulbMaterial = new THREE.MeshPhongMaterial({emissive: 0xD0D0D0});
        var bulb = new THREE.Mesh(new THREE.SphereGeometry( 15, 32, 32 ), bulbMaterial);
        var light = this.light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI/2);

        this.add( shade, bulb, light );
        this.translateY(220);
    };
    Knots.Lamp.prototype = Object.create(THREE.Object3D.prototype);


    Knots.Door = function() {
        THREE.Object3D.call(this);

        var frameTexture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
        var doorTexture = THREE.ImageUtils.loadTexture("metal-rust.jpg");

        var frameMaterial = new THREE.MeshPhongMaterial({color: 0xA0A0A0, map: frameTexture});
        var doorMaterial = new THREE.MeshLambertMaterial({color: 0xC88B40, map: doorTexture});
        var seamMaterial = new THREE.MeshLambertMaterial({color: 0x202020});
        var fittingMaterial = new THREE.MeshPhongMaterial({color: 0x666666, specular: 0xA0A0A0});

        var topFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 240), frameMaterial);
        var leftFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 240, 10), frameMaterial);
        var rightFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 240, 10), frameMaterial);

        var doorGeometry = new THREE.BoxGeometry(2, 236, 120);
        var leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        var rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);

        var verticalSeamGeometry = new THREE.BoxGeometry(3, 240, 2);
        var middleSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);
        var leftSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);
        var rightSeam = new THREE.Mesh(verticalSeamGeometry, seamMaterial);

        var horizontalSeamGeometry = new THREE.BoxGeometry(3, 2, 240);
        var baseSeam = new THREE.Mesh(horizontalSeamGeometry, seamMaterial);
        var topSeam = new THREE.Mesh(horizontalSeamGeometry, seamMaterial);

        var handleGeometry = new THREE.SphereGeometry(5, 10, 10);
        var leftHandle = new THREE.Mesh(handleGeometry, fittingMaterial);
        var rightHandle = new THREE.Mesh(handleGeometry, fittingMaterial);

        topFrame.translateY(120);
        leftFrame.translateZ(-115); rightFrame.translateZ(115);
        leftDoor.translateZ(-60.5); rightDoor.translateZ(60.5);

        baseSeam.translateY(-119); topSeam.translateY(115);
        leftSeam.translateZ(-110); rightSeam.translateZ(110);

        leftHandle.translateX(-5); rightHandle.translateX(-5);
        leftHandle.translateZ(-10); rightHandle.translateZ(10);

        this.add(topFrame, leftFrame, rightFrame, leftDoor, rightDoor);
        this.add(middleSeam, leftSeam, rightSeam, baseSeam, topSeam);
        this.add(leftHandle, rightHandle);
    };
    Knots.Door.prototype = Object.create(THREE.Object3D.prototype);


    Knots.FlagPole = function() {
        THREE.Object3D.call(this);

        var frameTexture = THREE.ImageUtils.loadTexture("floor-wood.jpg");
        var poleTexture = THREE.ImageUtils.loadTexture("metal-rust.jpg");
        var flagTexture = THREE.ImageUtils.loadTexture("nzflag.png");

        var frameMaterial = new THREE.MeshPhongMaterial({color: 0xA0A0A0, map: frameTexture});
        var poleMaterial = new THREE.MeshPhongMaterial({map: poleTexture, specular: 0x808080});
        var flagMaterial = new THREE.MeshLambertMaterial({map: flagTexture, side: THREE.DoubleSide});

        var plate = new THREE.Mesh(new THREE.BoxGeometry(2, 60, 40), frameMaterial);
        var pole = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 150, 12, 4), poleMaterial);
        var stay = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 30), poleMaterial);
        var ball = new THREE.Mesh(new THREE.SphereGeometry(5, 10, 10), poleMaterial);
        var flag = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), flagMaterial);

        plate.translateY(15);
        pole.rotateZ(-Math.PI/4); pole.translateY(75);
        stay.translateX(15); stay.translateY(30);
        stay.rotateZ(-Math.PI/2);
        ball.rotateZ(-Math.PI/4); ball.translateY(148);
        flag.rotateZ(-Math.PI/4);
        flag.translateX(55); flag.translateY(120);

        this.add(plate, pole, stay, ball, flag);
    };
    Knots.FlagPole.prototype = Object.create(THREE.Object3D.prototype);


    Knots.ScoutHall = function() {
        THREE.Object3D.call(this);

        this.add(new Knots.Floor(), new Knots.Ceiling(), new Knots.Walls());

        var door = new Knots.Door();
        var flagPole = new Knots.FlagPole();
        door.translateX(800);
        flagPole.translateX(-798);
        this.add(door, flagPole);

        var truss1 = new Knots.Truss(); truss1.translateX(-800);
        var truss2 = new Knots.Truss(); truss2.translateX(-400);
        var truss3 = new Knots.Truss();
        var truss4 = new Knots.Truss(); truss4.translateX(400);
        var truss5 = new Knots.Truss(); truss5.translateX(800);
        this.add(truss1, truss2, truss3, truss4, truss5);

        var lamp1 = new Knots.Lamp();
        var lamp2 = new Knots.Lamp();
        var lamp3 = new Knots.Lamp();
        var lamp4 = new Knots.Lamp();
        var lamp5 = new Knots.Lamp();
        lamp1.translateX(-400); lamp1.translateZ(-200);
        lamp1.light.target.position.set(-400, 0, -200);
        lamp2.translateX(-400); lamp2.translateZ(200);
        lamp2.light.target.position.set(-400, 0, 200);
        lamp4.translateX(400); lamp4.translateZ(-200);
        lamp4.light.target.position.set(400, 0, -200);
        lamp5.translateX(400); lamp5.translateZ(200);
        lamp5.light.target.position.set(400, 0, 200);
        this.add(lamp1, lamp2, lamp3, lamp4, lamp5);
    };
    Knots.ScoutHall.prototype = Object.create(THREE.Object3D.prototype);


})(window.Knots = window.Knots || {});