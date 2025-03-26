if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var majorRadius = parseFloat(arguments[1]);
    var minorRadius = parseFloat(arguments[2]);
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

        if (!isNaN(majorRadius) && majorRadius > 0 &&
            !isNaN(minorRadius) && minorRadius > 0 &&
            !isNaN(red) && red >= 0 && red <= 255 &&
            !isNaN(green) && green >= 0 && green <= 255 &&
            !isNaN(blue) && blue >= 0 && blue <= 255) {
            createEllipse(doc, layer, majorRadius, minorRadius, red, green, blue);
        } else {
            throw new Error("Invalid input. Please enter valid radii and RGB color components.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add the ellipse.");
}

function createEllipse(doc, layer, majorRadius, minorRadius, red, green, blue) {
    // Get the dimensions of the artboard
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardRect = artboard.artboardRect;
    var artboardWidth = artboardRect[2] - artboardRect[0];
    var artboardHeight = artboardRect[1] - artboardRect[3];

    // Calculate the ellipse position (center of the artboard)
    var xPos = artboardRect[0] + artboardWidth / 2;
    var yPos = artboardRect[1] - artboardHeight / 2;

    // Create the ellipse
    var ellipse = layer.pathItems.ellipse(yPos + minorRadius, xPos - majorRadius, 2 * majorRadius, 2 * minorRadius);

    // Set the fill color
    ellipse.filled = true;
    ellipse.fillColor = createRGBColor(red, green, blue);

    // Optionally, you can set other properties for the ellipse here
    ellipse.stroked = false; // Disable stroke or adjust as necessary
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}