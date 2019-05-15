var Canvas = document.getElementById("canvas");
var label = document.getElementById("text");
//Array of existing images
var images = [];
//How many images have loaded
var imagesLoaded = 0;

//Color stop used for creating gradients
var colorStop = function(location, color) {
    this.location = location;
    this.color = color;
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function toHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//console.log("" + toHex(255, 100, 50));

var distance = function(x1, y1, x2, y2) {
    var a = Math.pow(x2 - x1, 2);
    var b = Math.pow(y2 - y1, 2);
    return Math.sqrt(a + b);
};

var constrain = function(value, min, max) {
    if (value >= max) {
        return max;
    }
    else if (value <= min) {
        return min;
    }
    else {
        return value
    }
};
//Declare the Canvas Object
var Artist = function(src) {
    //Function to see if a line is colliding with a certain point Has an accuracy of about 1 pixel
    this.lineIsColliding = function(startX, startY, endX, endY, testX, testY) {
        const v1 = {
            x: endX - startX,
            y: endY - startY
        };
        const l2 = v1.x * v1.x + v1.y * v1.y;
        if (l2 === 0) {
            return false;
        } // line has no length so can't be near anything
        const v2 = {
            x: testX - startX,
            y: testY - startY
        };
        const u = (v1.x * v2.x + v1.y * v2.y) / l2;
        return u >= 0 && u <= 1 && Math.abs((v1.x * v2.y - v1.y * v2.x) / Math.sqrt(l2)) < 1;
    };
    var self = this;
    //The Canvas to draw on
    this.src = src;
    //The context of source(used for drawing)
    this.ctx = this.src.getContext("2d");
    //The Mouse Move Function
    this.showCoordinates = function(e) {
        label.innerHTML = "<b>x: </b>" + e.offsetX + " <b>y: </b>" + e.offsetY;
    };
    //Show coordinates variable
    this.showCoordinatesBool = false;
    //The boolean to tell if we should use stroke
    this.useStroke = true;
    //The fill style and stroke style(can be color, pattern, or gradient)
    this.fillStyle = "#000000";
    this.strokeStyle = "#000000";
    //The Line cap style (can be butt, square, or round)
    this.lineCap = "butt";
    //The Stroke Weight (how wide the strokes are)
    this.strokeWeightVar = "default";
    //The corner style (how the corners are drawn)
    this.cornerStyle = "miter";
    //The Shadow Color
    this.shadowColorVar = "#000000";
    //The shadow Blur
    this.shadowBlurVar = 0;
    //The shadow Offsets
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    //The style of the current font
    this.fontStyle = "normal";
    //The variant of the current font
    this.fontVariant = "normal";
    //The thickness of the current font
    this.fontThickness = "normal";
    //The height/size of the current font
    this.fontSize = 10;
    //The family of the current font
    this.fontFamily = "sans-serif";
    //The boolean to tell if the pen is down. used ONLY in the walkTo command
    this.pen = false;
    //The scale x factor Scale is in relation to the original. For example, if you scaled at 200% and then 200
    this.scaleAmountX = 1.0;
    this.scaleAmountY = 1.0;
    //The amount of transparency for the canvas. a Higher number is less transparent.
    this.transparencyVar = 1.0;
    //Function to set the fill style
    this.fill = function(style) {
        this.fillStyle = style;
        this.ctx.fillStyle = style;
    };

    //Function to set the stroke style
    this.stroke = function(style) {
        this.useStroke = true;
        this.strokeStyle = style;
        this.ctx.strokeStyle = style;
    };

    //Function to delete the stroke
    this.noStroke = function() {
        this.useStroke = false;
    };

    //Function to draw a rectangle
    this.rect = function(x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
        if (this.useStroke) {
            this.ctx.strokeRect(x, y, width, height);
        }

    };

    //Function to draw a corner
    this.corner = function(style, centerX, centerY, x1, y1, x2, y2) {
        this.ctx.lineJoin = style;
        this.cornerStyle = style;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    };

    //Function to draw a hollow rectangle
    this.hollowRect = function(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.strokeRect(x, y, width, height);
    };

    //Function to set the canvas background 
    this.background = function(style) {
        this.fillStyle = style;
        this.ctx.fillStyle = style;
        this.ctx.clearRect(0, 0, this.src.width, this.src.height);
        this.src.style.backgroundColor = style;
    };

    //Function to draw a line
    this.line = function(startX, startY, endX, endY) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    };

    //Function to change line style
    this.lineCap = function(mode) {
        this.ctx.lineCap = mode;
        this.lineCap = mode;
    };

    //Function to change stroke weight
    this.strokeWeight = function(weight) {
        this.useStroke = true;
        this.ctx.lineWidth = weight;
        this.strokeWeightVar = weight;
    };

    //Function to clear a certain area
    this.clearArea = function(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
    };
    //Turn the show coordinate function on
    this.enableCoordinates = function() {
        this.showCoordinatesBool = true;
        this.src.addEventListener("mousemove", this.showCoordinates);
    };
    /*Shadows*/

    //Set the shadow color
    this.shadowColor = function(color) {
        this.shadowColorVar = color;
        this.ctx.shadowColor = color;
    };
    //Set the shadow blur
    this.shadowBlur = function(blur) {
        this.shadowBlurVar = blur;
        this.ctx.shadowBlur = blur;
    };
    //Set the shadow offset
    this.shadowOffset = function(offsetX, offsetY) {
        this.shadowOffsetX = offsetX;
        this.shadowOffsetY = offsetY;
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY;
    };
    //Remove shadows
    this.noShadow = function() {
        this.shadowOffset(0, 0);
        this.shadowColor("#000000");
        this.shadowBlur(0);
    };

    //Function to see if a rectangle is colliding with a specific point
    this.rectIsColliding = function(rectX, rectY, rectWidth, rectHeight, testX, testY) {
        this.ctx.rect(rectX, rectY, rectWidth, rectHeight);
        return this.ctx.isPointInPath(testX, testY);
    };
    //Function that returns a custom linear gradient
    this.linearGradient = function(startX, startY, endX, endY, colorStops) {
        var gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
        for (var i = 0; i < colorStops.length; i++) {
            gradient.addColorStop(colorStops[i].location, colorStops[i].color);
        }
        return gradient;
    };
    //Function that returns a custom radial gradient
    this.radialGradient = function(x0, y0, r0, x1, y1, r1, colorStops) {
        var radialGradientVar = this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i = 0; i < colorStops.length; i++) {
            radialGradientVar.addColorStop(colorStops[i].location, colorStops[i].color);
        }
        return radialGradientVar;
    };
    //Function that allows you to create a pattern
    this.pattern = function(image, mode) {
        var pat = this.ctx.createPattern(image, mode);
        return pat;
    };
    //Function that allows you to make text. Optional width parameter to limit the width of the text. Optional font parameter if you would like to set it manually.
    this.text = function(text, x, y, width, font) {
        if (font) {
            this.ctx.font = font;
        }
        else {
            this.ctx.font = this.fontStyle + " " + this.fontVariant + " " + this.fontThickness + " " + this.fontSize + "px " + this.fontFamily;
            //console.log(this.ctx.font);
            //console.log(this.fontStyle + " " + this.fontVariant + " " + this.fontThickness + " " + this.fontSize + "px " + this.fontFamily);
        }
        if (width) {
            this.ctx.fillText(text, x, y, width);
            if (this.useStroke) {
                this.ctx.strokeText(text, x, y, width);
            }
        }
        else {
            this.ctx.fillText(text, x, y);
            if (this.useStroke) {
                this.ctx.strokeText(text, x, y);
            }
        }

    };
    //Function that allows you to make hollow text. Optional width parameter to limit the width of the text. Optional font parameter if you would like to set it manually. Font Size MUIST be an INTEGER if you do not specify the font parameter
    this.hollowText = function(text, x, y, width, font) {
        if (font) {
            this.ctx.font = font;
        }
        else {
            this.ctx.font = this.fontStyle + " " + this.fontVariant + " " + this.fontThickness + " " + this.fontSize + "px " + this.fontFamily;
            //console.log(this.ctx.font);
            //console.log(this.fontStyle + " " + this.fontVariant + " " + this.fontThickness + " " + this.fontSize + "px " + this.fontFamily);
        }
        this.ctx.strokeText(text, x, y, width);
    };
    this.textWidth = function(text) {
        return this.ctx.measureText(text).width;
    };
    //Function to draw a single curve. R is the radius. A1 and A2 refer to start and end angles. Optional boolean to go counter clockwise. X and y refer to the center of the circle the curve is on.
    this.curve = function(x, y, r, a1, a2, counterC) {
        this.ctx.beginPath();
        if (counterC) {
            this.ctx.arc(x, y, r, a1 * (Math.PI / 180), a2 * (Math.PI / 180), counterC);
        }
        else {
            this.ctx.arc(x, y, r, a1 * (Math.PI / 180), a2 * (Math.PI / 180));
        }
        this.ctx.stroke();

    };
    //Draw a filled circle. x and y refer to the center of the circle.
    this.circle = function(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        if (this.useStroke) {
            this.ctx.stroke();
        }
        this.ctx.fill();
    };
    //Draw a hollow circle. x and y refer to the center of the circle.
    this.hollowCircle = function(x, y, r) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    };
    //Similar to the circle function, but can be independantly rotated, has a seperate width and height parameter, and can be drawn partially.
    this.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterC) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, radiusX, radiusY, rotation * (Math.PI / 180), startAngle * (Math.PI / 180), endAngle * (Math.PI / 180), counterC);
        if (this.useStroke) {
            this.ctx.stroke();
        }
        this.ctx.fill();
    };
    //Similar to the hollow circle function, but can be independantly rotated, has a seperate width and height parameter, and can be drawn partially.
    this.hollowEllipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterC) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, radiusX, radiusY, rotation * (Math.PI / 180), startAngle * (Math.PI / 180), endAngle * (Math.PI / 180), counterC);
        this.ctx.stroke();
    };
    //Draws a parabola from a certain spot to another spot. cpx and cpy refer to the conrol point. An example of what control point does is here: https: //www.w3schools.com/tags/img_quadraticcurve.gif
    this.parabola = function(startX, startY, endX, endY, cpx, cpy) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.quadraticCurveTo(cpx, cpy, endX, endY);
    };
    //Draws a bezier curve from a certain spot to another spot. This function is similar to parabola, but it has 2 control points. An example of what the control points do is here: https://www.w3schools.com/tags/img_beziercurve.gif
    this.bezierCurve = function(startX, startY, endX, endY, cp1x, cp1y, cp2x, cp2y) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    };

    /*Path commands*/
    //MUST be called BEFORE choosing a starting location for the path.
    this.beginPath = function() {
        this.ctx.beginPath();
    };

    //Go to a certain point
    this.walkTo = function(x, y) {
        if (this.pen) {
            this.ctx.lineTo(x, y);
        }
        else {
            this.ctx.moveTo(x, y);
        }
    };
    //Pen up or down
    this.togglePen = function() {
        this.pen = !this.pen;
    };

    //Draws a line back to wherever the path started
    this.toStart = function() {
        this.ctx.closePath();
    };
    //Draws a parabola to a certain spot. cpx and cpy refer to the conrol point. An example of what control point does is here: https://www.w3schools.com/tags/img_quadraticcurve.gif
    this.parabolaTo = function(x, y, cpx, cpy) {
        this.ctx.quadraticCurveTo(cpx, cpy, x, y);
    };
    //Draws a bezier curve to a specific point. This function is similar to parabolaTo, but it has 2 control points. An example of what the control points do is here: https://www.w3schools.com/tags/img_beziercurve.gif 
    this.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    };
    //Draws a curve between 2 tangeants. r is the radius of the circle the curve is on.
    this.curveTo = function(x1, y1, x2, y2, r) {
        this.ctx.arcTo(x1, y1, x2, y2, r);
    };
    //Draws the current path on the canvas
    this.strokePath = function() {
        this.ctx.stroke();
    };
    //Fills the inside of the path you created
    this.fillPath = function() {
        this.ctx.fill();
    };
    //Creates an irregular polygon based on the points in the Xs and Ys arrays, closes it, and fills it if the fill boolean is true. If the fill boolean is false, AND the stroke is none, then nothing will show up.
    this.createPolygon = function(startX, startY, Xs, Ys, fill) {
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        for (var i = 0; i < Xs.length; i++) {
            this.ctx.lineTo(Xs[i], Ys[i]);
        }
        this.ctx.closePath();
        if (this.useStroke) {
            this.ctx.stroke();
        }
        if (fill) {
            this.ctx.fill();
        }
    };

    //Save the current state to the saves list
    this.save = function() {
        this.ctx.save();
    };
    //Restore a save from one of the slots
    this.restore = function() {
        this.ctx.restore();
        this.fillStyle = this.ctx.fillStyle;
        this.lineCap = this.ctx.lineCap;
        this.cornerStyle = this.ctx.lineJoin;
        this.shadowBlurVar = this.ctx.shadowBlur;
        this.shadowOffsetX = this.ctx.shadowOffsetX;
        this.shadowOffsetY = this.ctx.shadowOffsetY;
        this.strokeStyle = this.ctx.strokeStyle;
        this.shadowColorVar = this.ctx.shadowColor;
        this.strokeWeightVar = this.ctx.lineWidth;
    };
    //Move the center of the canvas to the position you specify
    this.translate = function(x, y) {
        this.ctx.translate(x, y);
    };
    //Scale the drawing. Can have seperate values for x and y. Values in percent.
    this.scale = function(sx, sy) {
        this.scaleAmountX *= (sx / 100) || (sy / 100);
        this.scaleAmountY *= (sy / 100) || (sx / 100);
        this.ctx.scale((sx / 100) || (sy / 100), (sy / 100) || (sx / 100));
    };
    //Rotate the current drawing
    this.rotate = function(angle) {
        this.ctx.rotate(angle * (Math.PI / 180));
    };
    //Draw an image
    this.image = function(img, x, y) {
        this.ctx.drawImage(img, x, y);
    };
    //Draw an image with width/height
    this.imageWithDimensions = function(img, x, y, width, height) {
        this.ctx.drawImage(img, x, y, width, height);
    };
    //Draw an image with cropping 
    this.imageWithCrop = function(img, x, y, sx, sy, swidth, sheight, width, height) {
        this.ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    };
    //Draw an image with all options
    this.imagegWithAll = function(img, x, y, sx, sy, swidth, sheight, width, height) {
        this.ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    };
    //Change the amount of transparency for the canvas. Value in PERCENT!
    this.transparency = function(transparency) {
        this.ctx.globalAlpha = transparency / 100;
        this.transparencyVar = transparency / 100;
    };
    //Go to the front layer of the canvas
    this.frontLayer = function() {
        this.ctx.globalCompositeOperation = "source-over";
    };
    //Go to the back layer of the canvas
    this.backLayer = function() {
        this.ctx.globalCompositeOperation = "destination-over";
    };
    //Toggle the mode where colors on top of other colors are mixed instead of overwritten.
    this.toggleColorMixMode = function() {
        if (this.ctx.globalCompositeOperation === "lighter") {
            this.ctx.globalCompositeOperation = "source-over";
        }
        else {
            this.ctx.globalCompositeOperation = "lighter";
        }
    };
    /*Image Data*/
    //Returns an image with a background. The background is optional. If not specified, the image will be transparent.
    this.createImageData = function(width, height, backgroundR, backgroundG, backgroundB, backgroundTransparency) {
        var img = this.ctx.createImageData(width, height);
        if (backgroundR && backgroundG && backgroundB) {
            for (var i = 0; i < img.data.length; i += 4) {
                img.data[i + 0] = backgroundR;
                img.data[i + 1] = backgroundG;
                img.data[i + 2] = backgroundB;
                img.data[i + 3] = 255 * (backgroundTransparency / 100);
            }
        }
        return img;
    };
    //Write a pixel with color onto an image data object
    this.writePixel = function(img, x, y, R, G, B, transparency) {
        var idOfPixel = (x * 4) + (y * (img.width * 4));
        img.data[idOfPixel] = R;
        img.data[idOfPixel + 1] = G;
        img.data[idOfPixel + 2] = B;
        img.data[idOfPixel + 3] = 255 * (transparency / 100);
    };
    //Get the imageData object of a certain part of the canvas
    this.clipImageData = function(x, y, width, height) {
        return this.ctx.getImageData(x, y, width, height);
    };
    //Draw the image data onto the canvas
    this.drawImageData = function(img, x, y) {
        this.ctx.putImageData(img, x, y);
    };

    //Draw Fnction
    this.draw = function(e) {

    };
    //Add the loop for the draw function
    window.setInterval(function() {
        self.draw();
    }, 1000 / 60);

    //Mouse Move Function
    this.mousemove = function(e) {

    };

    //Add the event for the mouse move function
    this.src.addEventListener("mousemove", function(e) {
        self.mousemove({ x: e.offsetX, y: e.offsetY, mouseDown: e.mouseDown, controlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey });
    });

    //Click function
    this.onClick = function(e) {

    };

    //Add the event listener for the click function
    this.src.addEventListener("click", function(e) {
        self.onClick({ x: e.offsetX, y: e.offsetY, mouseDown: e.mouseDown, controlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey });
    });

    //Keyboard down funtion
    this.keyDown = function(e) {

    };

    //Add the event listener for the key down function
    window.addEventListener("keydown", function(e) {
        self.keyDown({ key: e.key, code: e.code, controlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey });
    });

    //Keyboard pressed funtion
    this.keyPress = function(e) {

    };

    //Add the event listener for the key down function
    window.addEventListener("keypress", function(e) {
        self.keyPress({ key: e.key, code: e.code, controlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey });
    });

    //Keyboard up function
    this.keyUp = function(e) {

    };

    //Add the event listener for the keyboard up function
    window.addEventListener("keyup", function(e) {
        self.keyUp({ key: e.key, code: e.code, controlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey });
    });
};
//The following code is for testing purposes ONLY!
var start = function(imageList) {
    //Create a new canvas
    var myArtist = new Artist(Canvas);
    //Set the Background Color
    myArtist.background("#ff0000");
    //Set the fill color
    myArtist.fill("#0000ff");
    //Set the Stroke Color
    myArtist.stroke("#00ff00");
    //Draw a rectangle
    myArtist.rect(164, 153, 50, 100);
    //Draw a hollow rectangle
    myArtist.hollowRect(300, 300, 50, 50);
    //Disable the Stroke
    myArtist.noStroke();
    //Draw a rectangle with no stroke
    myArtist.rect(21, 18, 50, 50);
    //Change the Stroke color
    myArtist.stroke("#ffff00");
    //Change the stroke weight
    myArtist.strokeWeight(10);
    //Change the line cap
    myArtist.lineCap("round");
    //Draw a line
    myArtist.line(350, 30, 250, 80);
    //Draw a corner
    myArtist.corner("miter", 50, 135, 100, 185, 100, 110);
    //Enable the Coordinates
    myArtist.enableCoordinates();
    //Clear a space from the canvas
    myArtist.clearArea(6, 245, 100, 100);
    //Set the Shadow Color
    myArtist.shadowColor("black");
    //Set the shadow Blur
    myArtist.shadowBlur(20);
    //Set the shadow offset
    myArtist.shadowOffset(10, 0);
    //Set the stroke
    myArtist.noStroke();
    //Set the fill color
    myArtist.fill("orange");
    //Draw a rectangle
    myArtist.rect(268, 167, 30, 30);
    //Remove the shadow
    myArtist.noShadow();
    //Test if the rectangle is colliding with a specific point
    if (myArtist.rectIsColliding(268, 167, 30, 30, 290, 170)) {
        myArtist.fill("green");
        myArtist.rect(358, 0, 50, 46);
    }
    else {
        myArtist.fill("yellow");
        myArtist.rect(362, 0, 50, 46);
    }


    //Test if a line is colliding with a certain point
    //console.log("function returned: " + myArtist.lineIsColliding(358, 277, 365, 268, 362, 271));
    if (myArtist.lineIsColliding(358, 277, 365, 268, 362, 271)) {
        //console.log("line is colliding!");
        myArtist.line(358, 277, 365, 268);
    }
    else {
        // console.log("line is not colliding!");

    }

    myArtist.line(0, 0, 50, 10);
    //console.log(distance(0, 0, 50, 10));

    myArtist.fill(myArtist.linearGradient(259, 77, 359, 127, [new colorStop(0.0, "green"), new colorStop(1.0, "blue")]));
    myArtist.rect(259, 87, 100, 50);
    myArtist.fill(myArtist.radialGradient(309, 225, 10, 309, 225, 50, [new colorStop(0.0, "yellow"), new colorStop(1.0, "green")]));
    myArtist.rect(259, 200, 100, 50);
    var pattern = myArtist.pattern(imageList[0], "repeat");
    myArtist.fill(pattern);
    myArtist.rect(132, 33, 100, 100);
    myArtist.fill(toHex(0, 0, 0));
    //Setup text
    myArtist.fontSize = 50;
    myArtist.fontStyle = "oblique";
    myArtist.fontVariant = "small-caps";
    myArtist.fontThickness = 900;
    myArtist.fontFamily = "sans";
    //Draw text
    myArtist.text("Test", 200, 200);
    //Change the font thickness
    myArtist.fontThickness = 5;
    //Change the font size
    myArtist.fontSize = 12;
    //Draw hollow text
    myArtist.hollowText("Test", 26, 364);
    //console.log(myArtist.textWidth("Test"));
    //Create a path
    myArtist.beginPath();
    //Set fill color
    myArtist.stroke(toHex(100, 246, 150));
    //Set the stroke color
    myArtist.stroke(toHex(200, 155, 46));
    //Go to a certain spot
    myArtist.walkTo(150, 298);
    //Put the pen down
    myArtist.togglePen();
    //Walk to another spot. Will leave a line because pen is down.
    myArtist.walkTo(218, 286);
    //Walk in a parabola motion to another spot
    myArtist.parabolaTo(255, 310, 226, 384);
    //Walk  in a bezier curve motion to another spot
    myArtist.bezierCurveTo(219, 259, 321, 265, 256, 255);
    //Walk in a curve motion to another spot.
    myArtist.curveTo(151, 257, 90, 270, 50);
    //Go back to the beginning
    myArtist.toStart();
    //Draw the Path
    myArtist.strokePath();
    //Set the fill color
    myArtist.fill(toHex(100, 246, 150));
    //Fill the Path
    myArtist.fillPath();
    //Make a polygon
    myArtist.createPolygon(8, 207, [27, 71, 28], [180, 187, 218], true);
    //Draw a curve
    myArtist.curve(178, 338, 25, 0, 90);
    //Draw a circle
    myArtist.circle(319, 375, 15);
    //Draw a hollow circle
    myArtist.hollowCircle(274, 13, 15);
    //Change the fill color
    myArtist.fill(toHex(255, 156, 100));
    //Save the current values
    myArtist.save();
    //Draw a rectangle
    myArtist.rect(429, 250, 50, 50);
    //Change the fill color again
    myArtist.fill(toHex(100, 255, 100));
    //Draw another rectangle
    myArtist.rect(433, 153, 50, 50);
    //Restore the previously saved values
    myArtist.restore();
    //Draw a last rectangle
    myArtist.rect(425, 339, 50, 50);
    //Draw an ellipse with a rotation of 110 degrees 
    myArtist.ellipse(503, 63, 25, 50, 110, 0, 360, false);
    //Draw a hollow ellipse with a rotation of 130 degrees. Only stroke to the 320th degree. This is another way to draw a curve
    myArtist.hollowEllipse(453, 97, 25, 50, 130, 0, 320, false);
    //Change the fill color
    myArtist.fill("black");
    //Change the stroke color
    myArtist.stroke(toHex(255, 102, 153));
    //Change the stroke weight
    myArtist.strokeWeight(1);
    //Scale to 200% on both axis'
    myArtist.scale(200);
    //console.log(myArtist.scaleAmountX + "," + myArtist.scaleAmountY);
    //Draw a rectangle
    myArtist.rect(12, 215, 50, 25);
    //Scale to 200% on the x axis. Keep the y axis at 100%
    myArtist.scale(200, 100);
    //console.log(myArtist.scaleAmountX + "," + myArtist.scaleAmountY);
    //Draw the same rectangle on a different x offset
    myArtist.rect(12, 250, 50, 25);
    //Scale 25% on the x axis and 50% on the y axis to reset the dimensions.
    myArtist.scale(25, 50);
    //console.log(myArtist.scaleAmountX + "," + myArtist.scaleAmountY);
    //Draw a full image on the canvas
    myArtist.image(imageList[1], 300, 300);
    //Draw the same image with dimensions
    myArtist.imageWithDimensions(imageList[1], 300, 300, 50, 50);
    //Draw another image with cropping and dimensions
    myArtist.imageWithCrop(imageList[0], 315, 428, 0, 0, 50, 25, 100, 100);
    //Change the transparency value to 20%
    myArtist.transparency(20);
    //Draw a rectangle
    myArtist.rect(430, 193, 100, 50);
    //Change the transparency back to 100%
    myArtist.transparency(100);
    //Go to the back layer of the canvas
    myArtist.backLayer();
    //Draw a rectangle behind one of the existing rectacngles
    myArtist.rect(359, 0, 100, 50);
    //Toggle color mixing mode
    myArtist.toggleColorMixMode();
    //Change the fill color to blue
    myArtist.fill("blue");
    //Draw one more rectangle over an existing one
    myArtist.rect(67, 255, 100, 50);
    //Toggle color mixing mode again
    myArtist.toggleColorMixMode();
    //Go back to the front layer
    myArtist.frontLayer();
    //Create a set of image data with a green background
    var img = myArtist.createImageData(100, 100, 0, 255, 0, 100);
    //Write some semi-transparent green pixels onto the image
    for (var y = 0; y < 50; y++) {
        for (var x = 0; x < 100; x++) {
            myArtist.writePixel(img, x, y, 0, 255, 0, 50);
        }
    }
    //Write some semi-transparent blue pixels onto the image
    for (var y = 50; y < 100; y++) {
        for (var x = 0; x < 100; x++) {
            myArtist.writePixel(img, x, y, 0, 0, 255, 50);
        }
    }
    //Draw the image
    myArtist.drawImageData(img, 183, 383);
    //Make a variable called current frame
    var currentFrame = 0;
    //Initialize a draw function
    myArtist.draw = function() {

        switch (currentFrame % 100) {
            //Will run every 100 frames
            case 0:
                //Draw a rectangle
                myArtist.rect(445, 441, 50, 50);
                break;
                //Will run every 50 frames
            case 50:
                //Make the rectangle disappear
                myArtist.clearArea(435, 431, 62, 62);
                break;
        }
        //Iterate the current frame
        currentFrame++;
    };
    //Initialize a key down function
    myArtist.keyDown = function(e) {
        //If the key was ? and the control key was down
        if (e.controlKey == true && e.key == "/") {
            //Draw some text
            myArtist.text("/", 62, 385, 100);
        }
        else {
            //Remove the text
            myArtist.clearArea(52, 370, 110, 50);
        }

        //console.log(e.key);
    };
};
//Function to add an image to que
var createImage = function(src) {
    var img = document.createElement("img");
    img.src = src;
    //console.log(img);
    //Add image to list
    images.push(img);
    //When the image loads
    img.addEventListener("load", function() {
        //Update imagesLoaded
        imagesLoaded++;
        //If all images have loaded
        if (imagesLoaded === images.length) {
            //Call start. Pass the array of images to the function.
            start(images);
        }
    });
};

createImage("Images/test.png");
createImage("Images/test1.png");
