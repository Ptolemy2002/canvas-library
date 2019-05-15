/*global Artist*/
/*global Canvas*/
/*global start*/
/*global toHex*/
/*global constrain*/

var Joe = new Artist(Canvas);
var playerX = 200;
var playerY = 200;

start = function() {

    Joe.enableCoordinates();

    Joe.draw = function() {
        Joe.background(toHex(255, 0, 0));
        playerX = constrain(playerX, 0, Canvas.width - 50);
        playerY = constrain(playerY, 0, Canvas.height - 100);
        //Draw a guy
        Joe.fill(toHex(0, 0, 0));
        Joe.stroke(toHex(0, 0, 0));
        Joe.strokeWeight(10);
        Joe.circle(398, 238, 50);
        Joe.line(398, 238, 398, 450);
        Joe.line(397, 377, 465, 338);
        Joe.line(397, 377, 329, 338);
        Joe.line(398, 450, 450, 500);
        Joe.line(398, 450, 350, 500);
        //End Draw Guy
        Joe.strokeWeight(1);
        Joe.fontSize = 50;
        Joe.text("Example", 207, 59);
        Joe.fill(toHex(255, 255, 0));
        Joe.stroke(toHex(255, 255, 0));
        Joe.rect(playerX, playerY, 50, 100);
    };

    Joe.keyDown = function(e) {
        if (e.key == "ArrowRight") {
            playerX += 50;
        }
        else if (e.key == "ArrowLeft") {
            playerX -= 50;
        }
        else if (e.key == "ArrowUp") {
            playerY -= 50;
        }
        else if (e.key == "ArrowDown") {
            playerY += 50;
        }
    };
};
