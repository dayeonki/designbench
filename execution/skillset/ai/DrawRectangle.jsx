if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var width = parseFloat(arguments[1]);
    var height = parseFloat(arguments[2]);
    var red = parseInt(arguments[3]);
    var green = parseInt(arguments[4]);
    var blue = parseInt(arguments[5]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            layer = doc.layers.add();
            layer.name = layerName;
        }

        if (!isNaN(width) && width > 0 &&
            !isNaN(height) && height > 0 &&
            !isNaN(red) && red >= 0 && red <= 255 &&
            !isNaN(green) && green >= 0 && green <= 255 &&
            !isNaN(blue) && blue >= 0 && blue <= 255) {
            createRectangle(doc, layer, width, height, red, green, blue);
        } else {
            throw new Error("Invalid input. Please enter valid width, height, and RGB color components.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add the rectangle.");
}

function createRectangle(doc, layer, width, height, red, green, blue) {
    // Get the dimensions of the artboard
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardRect = artboard.artboardRect;
    var artboardWidth = artboardRect[2] - artboardRect[0];
    var artboardHeight = artboardRect[1] - artboardRect[3];

    // Calculate the rectangle position (center of the artboard)
    var xPos = artboardRect[0] + artboardWidth / 2;
    var yPos = artboardRect[1] - artboardHeight / 2;

    // Create the rectangle
    var rectangle = layer.pathItems.rectangle(yPos + height / 2, xPos - width / 2, width, height);

    // Set the fill color
    rectangle.filled = true;
    rectangle.fillColor = createRGBColor(red, green, blue);

    // Optionally, you can set other properties for the rectangle here
    rectangle.stroked = false; // Disable stroke or adjust as necessary
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}