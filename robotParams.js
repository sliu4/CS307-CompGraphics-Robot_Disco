/********************

AUTHORS: Caroline Hsu and Sheree Liu

TITLE: robotParams.js

DATE: Nov 15, 2015

CS307

PURPOSE: Creates the entire robot object with the inputted params
The origin of the object is in the middle of the robots torso (need to figure out how long legs are)

ORIGIN OF ALL OBJECTS: the origin of all the objects are in the center of the objects. they go from -size/2 to size/2

********************/

createRobot = function(params) {

	//creating the robot object to add all the components to 
	//origin of robot object: middle of his torso
	var robot = new THREE.Object3D();

	//creating materials for the body parts
	var bodyMaterial = params.bodyMaterial;
	var headMaterial = params.headMaterial;
	var armMaterial = params.armMaterial;
	var elbowMaterial = params.elbowMaterial;
	var shoulderMaterial = params.shoulderMaterial;
	var legMaterial = params.legMaterial;
	var footMaterial = params.footMaterial;
	var eyeMaterial = params.eyeMaterial;
	var noseMaterial = params.noseMaterial;
	var antennaeMaterial = params.antennaeMaterial;

	//create global variable to access them for animation 
	var leftArm, rightArm;

	//create body object and add to the robot object 
	var body = createBody(params);
	robot.add(body);

	//placing the feet at the origin of the scene 
	robot.position.set(0,params.bodyWidth * params.bodyScaleY + params.bodyWidth * 1.5,0);

	return robot;

	/********************
	creates a robots body object with arms, legs, and head so the robot is one object
	//Origin: middle of torso
	//Size: -size/2 to size/2 since the object is centered at the origin 
	********************/

	function createBody(params) {
		
		//create body object to add all the components to 
		var body = new THREE.Object3D(); 

		//parameters
		var bodyWidth = params.bodyWidth || 4;

		//creating the body geometry and mesh 
		var bodyGeom = new THREE.BoxGeometry(1.5 * bodyWidth, 1.5 * bodyWidth, 1.5 * bodyWidth);
		var bodyMesh = new THREE.Mesh(bodyGeom,bodyMaterial);

		//scaling the robot in the y direction 
		var scale = params.bodyScaleY || 1.2;
		bodyMesh.scale.y = scale;
		body.add(bodyMesh);

		//adding arms 
		leftArm = addArm(body,params,1);
		rightArm = addArm(body,params,-1);

		//adding legs
		addLeg(body,params,1);
		addLeg(body,params,-1);

		//add head
		var head = createHead(params);
	    head.position.y = bodyWidth + params.headWidth/1.25;
	    body.add(head);

	    //adding bolts to the robot to make more interesting
	    var bolt1 = createSphere(params.boltRadius,1,params.bodyMaterial);
	    var bolt2 = bolt1.clone();
	    var bolt3 = bolt1.clone();
	    var bolt4 = bolt1.clone();
	    var bolt5 = bolt1.clone();

	    bolt1.position.set(0, params.bodyWidth*.75, params.bodyWidth*.75);
	    bolt2.position.set(params.bodyWidth * 1/4, params.bodyWidth*.75, params.bodyWidth*.75);
	    bolt3.position.set(-params.bodyWidth * 1/4, params.bodyWidth*.75, params.bodyWidth*.75);
	    bolt4.position.set(params.bodyWidth * 1/2, params.bodyWidth*.75, params.bodyWidth*.75);
	    bolt5.position.set(-params.bodyWidth * 1/2, params.bodyWidth*.75, params.bodyWidth*.75);

	    body.add(bolt1);
	    body.add(bolt2);
	    body.add(bolt3);
	    body.add(bolt4);
	    body.add(bolt5);

		return body;
	}


	//creates nose Sphere
	function createNose(params) { 
		var sd = params.sphereDetail || 20;
		var radius = params.noseRadius || 0.2;
		var noseGeometry = new THREE.SphereGeometry(radius,sd,sd);
		var noseMesh = new THREE.Mesh(noseGeometry,noseMaterial);
		return noseMesh;
	}

	//adds the nose to the robot 
	function addNose(head,params) { //moves and adds nose to robot
		var noseframe = new THREE.Object3D();
		var nose = createNose(params);
		var nosePosition = params.headWidth || 5;
		nose.position.z = nosePosition; //within the noseframe
		noseframe.add(nose);
		var angle = params.noseRotation || Math.PI/12;
		noseframe.rotation.x = angle;
		head.add(noseframe);
		return head;
	}

	function createAntennae(params) { 

		//uses head parameters 
		//creates antennae sphere
		//want the antennaes to be proportional to the head so the antennae radius will be a 
		//certain percentage of the robot's head width 
		//object to add all the components to 
		var antennae = new THREE.Object3D();
		var sd = params.sphereDetail || 20;

		//make the fat cylinder attached to his head
		var fatRadius = params.headWidth/5 || 2;
		var height = params.antennaeHeight || 4;
		var fatAntennaeGeometry = new THREE.CylinderGeometry(fatRadius, fatRadius, height, sd);
		var fatAntennae = new THREE.Mesh(fatAntennaeGeometry,antennaeMaterial);
		antennae.add(fatAntennae);

		//make small cylinder 
		var smallRadius = fatRadius/3;
		var smallAntennaeGeometry = new THREE.CylinderGeometry(smallRadius, smallRadius,height, sd);
		var smallAntennae = new THREE.Mesh(smallAntennaeGeometry, antennaeMaterial);
		smallAntennae.position.y = height;
		antennae.add(smallAntennae);

		//make the ball at the end of his antennae
		var ballRadius = fatRadius/1.25;
		var ballGeometry = new THREE.SphereGeometry(ballRadius, sd, sd);
		var ball = new THREE.Mesh(ballGeometry, antennaeMaterial);
		ball.position.y = height * 1.5;
		antennae.add(ball);

		return antennae;
	}

	function addAntennae(head,params,side) { 
	    //moves and adds nose to robot 
		//side: 1 = left side, -1 = right side

		//create an object frame for the ears
		var antennaeFrame = new THREE.Object3D();
		
		var antennae = createAntennae(params);
		var antennaePositionX = params.headWidth/1.5 || 2.5;
		
		antennae.rotation.z = - side * Math.PI/2;
		antennae.position.x = side * antennaePositionX;

		antennaeFrame.add(antennae);
		head.add(antennaeFrame);
		return head;
	}

	function createEye(params) { 
		//creates eye sphere
		//we want the eyes to stay proportional to the head, so the eyes will be a certain
		//percentage of the robot's head parameters 
		var sd = params.sphereDetail || 20;
		var eyeRadius = params.headWidth/5 || 0.3;
		var eyeGeometry = new THREE.CylinderGeometry(eyeRadius, eyeRadius, 1, sd);
		var eyeMesh = new THREE.Mesh(eyeGeometry,eyeMaterial);
		eyeMesh.rotation.x = Math.PI/2
		return eyeMesh;
	}

	function addEye(head,params,side) {	
		//adds eye to the head 
		//side: 1 = left side, -1 = right side
		var eyeframe = new THREE.Object3D();
		var eye = createEye(params);
		var eyePosition = params.headWidth || 5;
		eye.position.set(side * eyePosition/3.5, eyePosition/5, eyePosition/1.5);
		
		eyeframe.add(eye);
		head.add(eyeframe);
		return head;
	}

	function createMouth(params) {
		//create the mouth of the robot 
		//mouth will be a box with an immage of square teeth on the front 
		//making the mouth with respect to the robot's head
		//mouth is same for any robot created  
		var headDimension = params.headWidth;
		var length = .75 * headDimension;
		var height = .4 * headDimension;
		var depth = .1 * headDimension;

		var mouth = new THREE.BoxGeometry(length, height, depth);


		var matArray = [];//array for the materials of the room
  		var faceColors = [0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xFFFFFF]; //array for the colors of the room
  
  		//creating the teeth texture
  		var teeth = new THREE.ImageUtils.loadTexture("teeth.png", {}, function(){}); 
  
  		//make the teeth box of the robot so the teeth are only on the front
  		for (var i=0; i<6;i++) {

   			if (i == 4){ //makes the bottom floor material for a dance floor 
     			 matArray.push(new THREE.MeshPhongMaterial({
                             	map : teeth,
                              	ambient: faceColors[i],
                              	specular: 0xFFFFFF,
                              	side: THREE.DoubleSide,
                              	shininess: 0,
                             	bumpScale : 1
                             	}));

    		} else { //creates the material for the rest of the walls 
      			matArray.push(new THREE.MeshPhongMaterial({
                              	color:faceColors[i],
                              	ambient: faceColors[i],
                             	specular: 0xFFFFFF,
                              	side: THREE.DoubleSide,
                              	shininess:0
                              	}));
    		}
  		}

  		var mouthMat = new THREE.MeshFaceMaterial (matArray);
  		var mouthMesh = new THREE.Mesh(mouth, mouthMat);
  		return mouthMesh;
	}

	function addMouth(head, params){

		var mouthFrame = new THREE.Object3D();
		var mouth = createMouth(params);
		var mouthPositionY = - params.headWidth/3 || 5;
		var mouthPositionZ = params.headWidth/1.5;
		mouth.position.set( 0, mouthPositionY, mouthPositionZ);
		
		mouthFrame.add(mouth);
		head.add(mouthFrame);
		return head;

	}

	function createHair(params){
		//planning to create spring "hair" object for later. WORK IN PROGRESS
		var points = [];

		var loops = 5;
		var slices = 10;
		var radius = .25;
		var length = params.headWidth;

		for (var i = 0; i < loops * slices; i++ ){

			var angle = 2 * Math.PI * (i / slices);
			var cos = Math.cos( angle );
			var sin = Math.sin( angle );
			var height = length;
			points.push(new THREE.Vector3(cos*radius, sin*radius, height));

		}



	}

	function createHead(params) {
		//creates the head with the eyes, antennaes, mouth, nose, and hat 
		var head = new THREE.Object3D();
		var sd = params.sphereDetail || 20;
		var radius = params.headWidth || 5;
		var headGeometry = new THREE.BoxGeometry(radius*1.4,radius*1.4,radius*1.4);
		var headMesh = new THREE.Mesh(headGeometry,headMaterial);
		head.add(headMesh);

		//antennaes
		addAntennae(head,params,1);
		addAntennae(head,params,-1);

		//eyes
		addEye(head,params,1);
		addEye(head,params,-1);

		//mouth
		addMouth(head, params);

		//neck 
		var neck = createLimb(params.headWidth/3, params.headWidth/3, params.headWidth/3, params, params.headMaterial);
		head.add(neck);

		neck.position.y = - params.headWidth/1.5;

		return head;
	}

	
	function createLimb(radiusTop,radiusBottom,length,params,material) {
		//creates a cylinder mesh (limb)
		var limb = new THREE.Object3D();
		var cd = params.cylinderDetail || 20;
		var limbGeom = new THREE.CylinderGeometry(radiusTop,radiusBottom,length,cd);
		var limbMesh = new THREE.Mesh(limbGeom,material);
		limb.add(limbMesh);
		return limb;
	}

	function addLimb(object,params,radiusTop,radiusBottom,length,material,height) {
		//want to use this to add the arms to the robot. so that they have upper and lower arm
		var limb = createLimb(radiusTop,radiusBottom,length,params,material);
		limb.position.y = height;
		object.add(limb);
	}

	function addArm(robot,params,side) {
		//creates an arm with hand and shoulder and adds it to the robot
		//parameters
		var top = params.armRadiusTop || 0.5;
		var bot = params.armRadiusBottom || 0.5;
		var len = params.armLength || 5;

		//adding the flare sleve to the end of the robots arm 
		var flareSleeve = createFlare(params, .8);

		//place the arm on the inputted object (robot in this case)
		flareSleeve.position.set(side * params.bodyWidth*.75, params.bodyWidth/2, 0); //places arm on body 
		flareSleeve.rotation.z = side * Math.PI/6;
		robot.add(flareSleeve);
	}

	function addLeg(robot,params,side) {
		// //creates a leg with a foot and adds it to the robot
		// //leg parameters
		var top = params.legRadiusTop || .75;
		var bot = params.legRadiusBottom || .75;
		var len = params.legLength || 5;

		// //create the leg and the foot (glittery shoe)
		var leg = createLimb(top,bot,len,params,params.legMaterial);
		var foot = addSphere(leg,params,side,params.footRadius,
		 	       -params.legLength,params.footMaterial,0);

		//create the flare pant
		var pantLeg = createFlare(params, 1);

		//positioning 
		var pantPosition = params.bodyWidth/2; 

		// move the leg so it is in the proper position 
		var legPosition = params.footRadius + 0.1; 
		var hx = side * pantPosition;
		leg.position.set(hx,-1.7 * params.bodyWidth,0);

		//determine which side the leg goes on
		var hx = side * pantPosition;

		//set the pant leg in it's over the legs
		pantLeg.position.set(hx,-.75 * params.bodyWidth,0); 

		//creating a bottom for the glittery shoes 
		var footBottom = new THREE.Mesh(new THREE.CircleGeometry(params.footRadius,50),params.footMaterial);
		footBottom.position.set(hx,-params.legLength - .81 ,0); 
		footBottom.rotation.x = Math.PI/2;


		//add to robot object 
		robot.add(leg);
		robot.add(pantLeg);
		robot.add(footBottom);
	}

	function createFlare(params, scalingFactor){
		//Scaling factor allows the flare to be any size
		//creates a rainbow lathe object in the shape of a flare for a pant or shirt sleeve 
		var flare = new THREE.Object3D();
		var flareGeom = new THREE.LatheGeometry(makeVertices(scalingFactor));
		var mat1;
		
		mat1 = new THREE.MeshNormalMaterial();
		var meshMaterial = new THREE.MeshNormalMaterial();
		meshMaterial.side = THREE.DoubleSide;
		var latheObj = THREE.SceneUtils.createMultiMaterialObject(flareGeom, [meshMaterial, new THREE.MeshBasicMaterial()]);
    	//latheObj = TW.createMesh(flareGeom);
    	latheObj.rotation.x = Math.PI /2;

    	flare.add(latheObj);
    	return flare;

	}


	function makeVertices(scalingFactor) {

		//Scaling factor allows the flare to be any size
		//would have done a parameter that allowed you to input your own vertices, but we kept getting the same error message
		//makes vertices for the flare object

		var i;
		var pts = [];
		var sc = scalingFactor;

		var points1 = [[1, 0, 0],
					  [1, 0, 5],
					  [1.25, 0, 7],
					  [1.5, 0, 8],
					  [2, 0, 8.5],
					  [2.7, 0, 9]];

		if (points1.length) {

			for( i=0; i< points1.length ; i++) {
				var p = new THREE.Vector3();
				p.x = sc * points1[i][0];
				p.y = sc * points1[i][1];
				p.z = sc * points1[i][2];
				pts.push( p );
			}
		}
			return pts;
	}

	function createSphere(radiusSphere,typeSphere,material) {
		//creates a sphere or half sphere based on typeSphere
		var sphere = new THREE.Object3D();
		var sd = params.sphereDetail || 10;
		var radius = radiusSphere;
		if (typeSphere == 0) { //param typeSphere: 0 for half, 1 for full
			var sphereGeom = new THREE.SphereGeometry(radius,sd,sd,0,Math.PI*2,0,Math.PI/2);
		} else {
			var sphereGeom = new THREE.SphereGeometry(radius,sd,sd);
		}
		var sphereMesh = new THREE.Mesh(sphereGeom,material);
		sphere.add(sphereMesh);
		return sphere;
	}

	function addSphere(object,params,side,radius,height,material,typeSphere) {
		//adds sphere to the desired object and at the desired height
		var sphere = createSphere(radius,typeSphere,material);
		sphere.position.y = height/2;
		object.add(sphere);
	}


}


//Creates the robot paramameters with the inputted values

robotParams = function() {

	//make it so that they only have to input a few values and it will give them different looking robots

    //parameters for the robot
	this.sphereDetail = 32;
	this.cylinderDetail = 20;
	this.torusTubSeg = 50;

	//head
	this.headWidth = 3.5;
	this.headColor = "#D6D6AB";
	this.headMaterial = new THREE.MeshPhongMaterial( {color: this.headColor,
													  side: THREE.DoubleSide,
													  shininess: 0,
													  specular: 0xFFFFFF,
													  ambient: this.headColor,
													  });

	//nose
	this.noseRadius = 0.2;
	this.noseRotation = Math.PI/12;
	this.noseColor = "#851073";
	this.noseMaterial = new THREE.MeshBasicMaterial( {color: this.noseColor});

	//eye
	this.eyeRadius = 0.3;
	this.eyeAngleX = 0;
	this.eyeAngleY = -Math.PI/10;
	this.eyeColor = "#0xFFFFFF";
	this.eyeMaterial = new THREE.MeshBasicMaterial( {color: this.eyeColor});

	//antennae
	this.antennaeRadius = .35;
	this.antennaeHeight = 1.5;
	this.antennaeColor = "#333333";
	this.antennaeTilt = Math.PI/8;
	this.antennaeMaterial = new THREE.MeshPhongMaterial( {color: this.antennaeColor,
														  side: THREE.BackSide,
														  shininess: 10,
														  specular: 0xFFFFFF,
														  ambient: this.antennaeColor,
														  });

	//arm
	this.armLength = 3;
	this.armRadiusTop = .4;
	this.armRadiusBottom = .4;
	this.armRotationZ = Math.PI/6;
	this.armColor = "#70F3FA";
	this.armMaterial = new THREE.MeshNormalMaterial();

	//hand
	this.handRadius = .5;
	this.handColor = "#FF03B3";
	this.elbowMaterial = new THREE.MeshNormalMaterial();

	//shoulder
	this.shoulderRadius = 1;
	this.shoulderColor = "#F9FFB8";
	this.shoulderMaterial = new THREE.MeshNormalMaterial();

	//leg
	this.legLength = 12;
	this.legRadiusTop = .75;
	this.legRadiusBottom = .75;
	this.legColor = "#17FFBD";
	this.legMaterial = new THREE.MeshBasicMaterial( {color: this.legColor});

	//foot
	this.footRadius = 1.5;
	this.footColor = "0xEDEDED";
	this.bumpMap = new THREE.ImageUtils.loadTexture("glitter.png", {}, function(){});
	this.footMaterial = new THREE.MeshPhongMaterial( {color: this.footColor,
													  side: THREE.DoubleSide,
													  shininess: 5,
													  specular: 0xFFFFFF,
													  ambient: this.footColor,
													  bumpMap: this.bumpMap,
													  bumpScale: .5
													  });

	//body
	this.bodyWidth = 4;
	this.bodyScaleY = 1.2;
	this.bodyColor = "#D6D6AB";
	this.bodyMaterial = new THREE.MeshPhongMaterial( {color: this.bodyColor,
													  side: THREE.DoubleSide,
													  shininess: 0,
													  specular: 0xFFFFFF,
													  ambient: this.bodyColor
													  });

	this.boltRadius = .3;

	return this;
}
