
//***  GLOBAL VARIABLES

var playGame = false;
var gameOver = false;
var helpScreen = false;
var homeScreen = true;

var ballX = 225;
var ballY = 200;

var keyPressSpace = false;
var highscore = 0;
var score = 0;
var count = 0;
var ax5 = 0
var ay5 = 500
var ax6 = 900
var ay6 = 100

var groundX = 0;
var groundX1 = -1636;
var groundY = 502;

// Creating a new tube object, this will
var top_tube = new Tube(900, -250); 
var bottom_tube = new Tube(900, 300);
var top_tubes = [top_tube];
var bottom_tubes = [bottom_tube];

var tubebottom = new Image();
tubebottom.src="images/tube.png";

var tubetop = new Image();
tubetop.src="images/tube1.png";

var background = new Image();
background.src="images/Eclipse.jpg";

var ground = new Image();
ground.src="images/ground.png";

var bird = new Image();
bird.src="images/spacebird.png";


/*
 * Customize the look of the canvas app
 */
function init() {
// CUSTOMIZE YOUR APP
	setTitle("Terrible Space Bird"); // set title

	setCanvasSize(900,600);

	setButton1("Play"); // ("" if not using)
	setButton2("Help"); // ("" if not using)

	setTimer(20); 
// END OF CUSTOMIZATIONS
}

//*****************************
//KEYBOARD INPUT SECTION
//*****************************

/*
 * Changes the direction of the appropriate player
 * 
 * @param (number) code The key code of the key pressed 
 * @param (string) char A single character string for the key pressed
 */
function keyDown(code, char) {
//debugOut("key press, code="+code+" char="+char);

	 if (code == 32) {
		keyPressSpace = true;
	}
}

function Tube(x, y) {
	this.x = x;
	this.y = y;
	// This returns the x of a tube object
	this.get_x = function() {
		return this.x;
	};
	// This returns the y of a tube object
	this.get_y = function() {
		return this.y;
	};
	// This sets the new x value of a tube object
	this.set_x = function(new_x) {
		this.x = new_x;
	};
	// This sets the new y value of a tube object
	this.set_y = function(new_y) {
		this.y = new_y;
	};
}	


/*
 * Unused
 */
function keyPress(code, char) {
	if (code == 32) {
		keyPressSpace = true;
	} else {
		keyPressSpace = false;
	}
}

/*
 * Stops player movement when a key is lifted
 * 
 * @param (number) code The key code of the key released 
 * @param (string) char A single character string for the key released
 */
function keyUp(code, char) {
//debugOut("key up, code="+code+" char="+char);

	if (code == 32) {
		keyPressSpace = false;
	}
} 


//*****************************
//MOUSE INPUT SECTION -- UNUSED
//*****************************
function mouseDown(x, y, button) { +5};
function mouseUp(x, y, button) {}
function mouseMove(x, y) {}
function mouseOver(x, y) {}
function mouseOut(x, y) {}

//*****************************
//BUTTON INPUT SECTION
//*****************************

/*
 * Start the game
 * 
 * @param (number) button The mouse button clicked (usually 0)
 */
function button1Click(button) {
	gameOver = false;
	helpScreen = false;
	homeScreen = false;
	playGame = true;
}

function button2Click(button) {
	gameOver = false;
	playGame = false;
	homeScreen = false;
	helpScreen = true;
}

function getHighscore(score) {
	if (score > highscore) {
		highscore = score;
	}
	return highscore;
}

function resetEverything() {
	ballX = 225;
	ballY = 200;
	top_tube.set_x(900);
	top_tube.set_y(-250); 
	bottom_tube.set_x(900);
	bottom_tube.set_y(300);
	top_tubes = [top_tube];
	bottom_tubes = [bottom_tube];
}

function collisionHelper(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
	//top-left
	if (bx1 <= ax1 && ax1 < bx2){
		if (by1 < ay1 && ay1 < by2) {
			return true;
		}
	}
	//top-right
    if (bx1 <= ax2 && ax2 <= bx2) { 
		if (by1 <= ay1 && ay1 <= by2) { 
            return true;
		}
	}

    // bottom-right (ax2, ay2)
    if (bx1 <= ax2 && ax2 <= bx2) {
        if (by1 <= ay2 && ay2 <= by2) { 
            return true;
		}
	}

    // bottom_left (ax1, ay2)
    if (bx1 <= ax1 && ax1 <= bx2) {
        if (by1 <= ay2 && ay2 <= by2) { 
            return true;
		}
	}
	return false;
}

function collision(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    var first;
    var second;
    
    first = collisionHelper(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
    second = collisionHelper(bx1, by1, bx2, by2, ax1, ay1, ax2, ay2);
    
    if (first || second) {
        return true;
	}
    else {
        return false;
    }
}

function collisionDetect(x1, y1) {
	if (collision(ballX, ballY, (ballX + 50), (ballY + 54), x1, y1, (x1 + 61), (y1 + 420))){
		ballX = 225;
		objectCollision = true;
		gameOver = true;
		playGame = false;
		//console.log("collision");
	} else {
		objectCollision = false;
	}		
}

function floorCollision() {
	if (collision(ballX, ballY, (ballX + 100), (ballY + 33), ax5, ay5, (ax5 + 900), (ay5 + 100))){
		objectCollision = true;
		gameOver = true;
		playGame = false;
		//console.log("collision");
	} else {
		objectCollision = false;		
	}	
}

//****************************
//TIMER SECTION
//****************************

/*
 * Main game method. Moves, checks collisions, and draws screen
 */
function clockTickEvent() {
//debugOut("tick");
	canvas.drawImage (background, 0, 0);
	if (homeScreen == true) {
		canvas.fillStyle = "black";
		canvas.font = "50px Impact";
		canvas.fillText("Press play to play the game", 200,150);
		canvas.fillText("Press help to get instructions", 175,225);
	} else if (playGame == true) {
		if (count == 0) {
			count = 1;
			score = 0;
		}
		if (keyPressSpace == true) {
			ballY = ballY - 9;
		} else {
			ballY = ballY + 4; 
		}
		
		if (ballY < 0) {
			ballY = 1;
		} 
		
		if (groundX == 1636) {
			groundX = -1636;
		}
		
		if (groundX1 == 1636) {
			groundX1 = -1636;
		}
		
		groundX += 2;
		groundX1 += 2;
		
		floorCollision();
		
		// Index to loop through both arrays, top tubes and bottom tubes arrays
		index = 0;
		// While there are tubes in the array, both arrays have same size therefore it doesnt
		// matter which array length we check
		while(index < top_tubes.length) {
			// ***** MOVEMENT ***** //
			// First set the new x of the tube to the previous subtract 5 for the top tube
			top_tubes[index].set_x(top_tubes[index].get_x()-5);
			// Set the new x of the tube to the previous subtract 5 for the bottom tube
			bottom_tubes[index].set_x(bottom_tubes[index].get_x()-5);
			
			// ***** DRAWING ***** //
			// This part draws both the tubes to the screen, the top tube followed by the bottom tube
			canvas.drawImage (tubetop, top_tubes[index].get_x(), top_tubes[index].get_y());
			canvas.drawImage (tubebottom, bottom_tubes[index].get_x(), bottom_tubes[index].get_y());
			
			// ***** DELETING ***** //
			// If the top tube or the bottom tube (it doesnt matter which) hits a certain x value
			// in this x = -100 (meaning it goes off screen) then this if statement will run
			if (top_tubes[index].get_x() <= -100|| bottom_tubes[index].get_x() <= -100) {
				// We delete the first top tube in the array of top tubes
				top_tubes.splice(0, 1);
				// We delete the first bottom tube in the array of bottom tubes
				bottom_tubes.splice(0, 1);
			}
			
			// ***** ADDING ***** //
			// If a top or bottom tube hits a certain x value, in this case x = 500 then this if statement will run
			if (top_tubes[index].get_x() == 500 || bottom_tubes[index].get_x() == 500) {
				// First we get a random number in the range of 100-300, this is so we can add new tubes to both
				// the top tube and bottom tube arrays
				newHeightTop = Math.floor(Math.random() * 300)+100;
				// We add a new top tube to the top tube array with a y that is set to the negative value of the
				// random number we got above
				top_tubes.push(new Tube(900, -newHeightTop));
				// We add a new bottom tube to the bottom tube array with a y value of at least 130 units seperation
				// between the two tubes
				bottom_tubes.push(new Tube(900, -newHeightTop+550));
			}
			
			// ***** COLLISION ***** //
			// Here we use the collision detection on both the tubes
			collisionDetect(top_tubes[index].get_x(), top_tubes[index].get_y());
			collisionDetect(bottom_tubes[index].get_x(), bottom_tubes[index].get_y());
			// Increment the index by 1
			index++;
		}

		//debugOut("hi");	
		canvas.drawImage (ground, groundX, groundY);
		canvas.drawImage (ground, groundX1, groundY);
		canvas.font = "55px Impact";
		canvas.fillStyle = "black";
		canvas.fillText(score, 425, 100);
		score += 1;
		canvas.drawImage (bird, ballX, ballY);
	} else if (gameOver == true) {
		canvas.fillStyle = "black";
		canvas.font = "100px Impact";
		canvas.fillText("GAME OVER!", 215,150);
		canvas.font = "40px Impact";
		canvas.fillStyle = "black";
		canvas.fillText("SCORE: " + score, 375, 225);
		canvas.fillText("HIGHSCORE: " + getHighscore(score), 340, 270);
		count = 0;
		resetEverything();
	} else if (helpScreen == true) {
		resetEverything();
		canvas.fillStyle = "black";
		canvas.font = "80px Impact";
		canvas.fillText("Instructions", 250,150);
		canvas.font = "50px Impact";
		canvas.fillText("Press space to jump", 250,250);
		canvas.fillText("Hold to gain height faster", 190,350);
	}
} 
