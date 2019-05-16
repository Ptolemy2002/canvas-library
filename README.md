# canvas-library

This is a library designed to make working with the HTML Canvas element much easier, written completely in Javascript.

The library is implemented through an object called "Artist" that wraps around an HTML canvas element.

To instantiate an artist, use the following syntax:
```javascript
var myArtist = new Artist(canvas);
```

You can then invoke a number of methods onto myArtist, such as "fill", "background", and "stroke".

The "AristExample.js" file contains the entire library along with many test functions performed on the canvas. The "Artist.js" file contains the library alone without any test functions. Run the "Main.html" file to view the canvas. The "ArtistExample.js" file includes comments describing the function of every segment of code.

The "Editor.html" file contains a canvas and a text box. Inside the text box, you can insert javascript code to control the canvas. The editor will automatically create pairs of quotes and brackets for you. All error messages are logged in the console of your browser.

If you would like to use images with your program, you must implement the "start" function. The start function will run once all the images you have specified are prepared for use. To load an image, use the "createImage" function with the source path as a parameter. The start function is passed an array containing all loaded images when it is called. You can retrieve your image from there.

To override the start function, use the following syntax:

```javascript
start = function(imageList) {
	...
}
```
