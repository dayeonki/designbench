if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var args = [].slice.call(arguments);
    var red = parseInt(args[0]);
    var green = parseInt(args[1]);
    var blue = parseInt(args[2]);

    if (!isNaN(red) && red >= 0 && red <= 255 &&
        !isNaN(green) && green >= 0 && green <= 255 &&
        !isNaN(blue) && blue >= 0 && blue <= 255) {
        
        setBackgroundColor(doc, red, green, blue);
    } else {
        throw new Error("Invalid color values. Please enter values between 0 and 255 for each color component.");
    }
} else {
    throw new Error("No open document. Please open a document to set the background color.");
}

function setBackgroundColor(doc, red, green, blue) {
    // Get the active artboard dimensions
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardRect = artboard.artboardRect;
    var artboardWidth = artboardRect[2] - artboardRect[0];
    var artboardHeight = artboardRect[1] - artboardRect[3];

    // Create a rectangle that covers the entire artboard
    var rect = doc.pathItems.rectangle(artboardRect[1], artboardRect[0], artboardWidth, artboardHeight);
    
    // Set the fill color
    var fillColor = createRGBColor(red, green, blue);
    rect.filled = true;
    rect.fillColor = fillColor;
    
    // Send the rectangle to the back to serve as the background
    rect.zOrder(ZOrderMethod.SENDTOBACK);
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}