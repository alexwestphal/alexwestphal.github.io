(function(Knots) {

    //var skinTexture = THREE.ImageUtils.loadTexture("skin.jpg");
    //skinTexture.wrapS = skinTexture.wrapT = THREE.RepeatWrapping;
    var skinMaterial = new THREE.MeshPhongMaterial({ color: 0xF0F0F0});
    var jointMaterial = new THREE.MeshPhongMaterial({ color: 0x666666, specular: 0x888888, shininess: 20, metal: true});

    Knots.Finger = function(sections, factor, debug) {
        THREE.Object3D.call(this);
        this.sections = sections;
        this.add(new THREE.Mesh(new THREE.SphereGeometry(1.2), jointMaterial));

        var section;
        if(1 < sections) {
            section = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 4*factor, 24), skinMaterial);
            section.translateY(0.5+2*factor);
            var next = this.next = new Knots.Finger(sections-1, factor, debug);
            next.translateY(1+4*factor); this.add(section, next);
        } else {
            section = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 3, 24), skinMaterial);
            var tip = new THREE.Mesh(new THREE.SphereGeometry(1.3, 24), skinMaterial);
            section.translateY(2);tip.translateY(3.5);
            this.add(section, tip);
        }
        if(debug) {
            this.add(new THREE.Mesh(
                new THREE.PlaneGeometry(0.1, 100),
                new THREE.MeshLambertMaterial({color: 0xFF0000, side: THREE.DoubleSide})));
        }
    };
    Knots.Finger.prototype = Object.create(THREE.Object3D.prototype);
    Knots.Finger.prototype.bend = function(angles) {
        this.rotateX(angles[this.sections-1]*Math.PI/2);
        if(1 < this.sections) this.next.bend(angles);
    };
    Knots.Finger.prototype.spread = function(angle) {
        this.rotateZ(angle*Math.PI/4);
    };

    Knots.Thumb = function(sections, debug) {
        THREE.Object3D.call(this);
        this.sections = sections;
        this.add(new THREE.Mesh(new THREE.SphereGeometry(1.4), jointMaterial));

        var section;
        if(1 < sections) {
            section = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 4, 24), skinMaterial);
            section.translateY(2.5);
            var next = this.next = new Knots.Thumb(sections-1, debug);
            next.translateY(5); this.add(section, next);
        } else {
            section = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.75, 3, 24), skinMaterial);
            var tip = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24), skinMaterial);
            section.translateY(2); tip.translateY(3.5);
            this.add(section, tip);
        }
        if(debug) {
            this.add(new THREE.Mesh(
                new THREE.PlaneGeometry(0.1, 100),
                new THREE.MeshLambertMaterial({color: 0xFF0000, side: THREE.DoubleSide})));
        }
    };
    Knots.Thumb.prototype = Object.create(THREE.Object3D.prototype);
    Knots.Thumb.prototype.bend = function(angles) {
        this.rotateX(angles[this.sections-1]*Math.PI/2);
        if(1 < this.sections) this.next.bend(angles);
    };

    Knots.Hand = function() {
        THREE.Object3D.call(this);

        var handGeometry = new THREE.BoxGeometry(12, 12, 3);
        handGeometry.merge(new THREE.BoxGeometry(9, 2, 3), new THREE.Matrix4().makeTranslation(-1.5, 5.5, 0));
        handGeometry.merge(new THREE.BoxGeometry(3, 2, 3), new THREE.Matrix4().makeTranslation(-1.5, 6, 0));
//        handGeometry.merge(new THREE.BoxGeometry(4, 4, 3), new THREE.Matrix4().makeTranslation(-6, 0, 0)
//            .multiply(new THREE.Matrix4().makeRotationZ(Math.PI/4)));

        var hand = new THREE.Mesh(handGeometry, skinMaterial);
        var thumb = this.thumb = new Knots.Thumb(3);
        var finger1 = this.finger1 = new Knots.Finger(3, 0.8);
        var finger2 = this.finger2 = new Knots.Finger(3, 1);
        var finger3 = this.finger3 = new Knots.Finger(3, 0.9);
        var finger4 = this.finger4 = new Knots.Finger(3, 0.7);

        thumb.translateY(1); thumb.translateX(-6);
        thumb.translateZ(1); thumb.rotateZ(Math.PI/4);

        finger1.translateY(7); finger1.translateX(-4.5);
        finger2.translateY(7.5); finger2.translateX(-1.5);
        finger3.translateY(7); finger3.translateX(1.5);
        finger4.translateY(6.5); finger4.translateX(4.5);
        this.add(hand, thumb, finger1, finger2, finger3, finger4);
    }
    Knots.Hand.prototype = Object.create(THREE.Object3D.prototype);
    Knots.Hand.prototype.pinch = function(t) {
        t = t || 1;
        this.finger1.bend([0.1,0.2,0.9]); this.finger1.spread(0.1);
        this.finger2.bend([0.1,0.2,0.3]);
        this.finger3.bend([0.1,0.2,0.3]);
        this.finger4.bend([0.1,0.2,0.3]);


        this.thumb.rotateZ(Math.PI/3);
        this.thumb.bend([0.4,0.5,0.6]);
    };
    Knots.Hand.prototype.scoutSign = function(t) {
        t = t || 1;
        this.thumb.bend([0.3*t, 0.8*t, 1.2*t]);
        this.thumb.rotateY(Math.PI*t/2.5);
        this.finger4.bend([0.8*t, 1.1*t, 0.15*t]);
    };

})(window.Knots = window.Knots || {});