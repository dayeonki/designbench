if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var sides = parseInt(arguments[1]);
    var radius = parseFloat(arguments[2]);
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

        if (!isNaN(sides) && sides >= 3 &&
            !isNaN(radius) && radius > 0 &&
            !isNaN(red) && red >= 0 && red <= 255 &&
            !isNaN(green) && green >= 0 && green <= 255 &&
            !isNaN(blue) && blue >= 0 && blue <= 255) {
            // Create the polygon
            createPolygon(doc, layer, sides, radius, red, green, blue);
        } else {
            throw new Error("Invalid input. Please enter valid number of sides, radius, and RGB color components.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add the polygon.");
}

function createPolygon(doc, layer, sides, radius, red, green, blue) {
    // Get the dimensions of the artboard
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardRect = artboard.artboardRect;
    var artboardWidth = artboardRect[2] - artboardRect[0];
    var artboardHeight = artboardRect[1] - artboardRect[3];

    // Calculate the polygon position (center of the artboard)
    var xPos = artboardRect[0] + artboardWidth / 2;
    var yPos = artboardRect[1] - artboardHeight / 2;

    // Calculate the points of the polygon
    var points = [];
    for (var i = 0; i < sides; i++) {
        var angle = (i / sides) * 2 * Math.PI;
        var x = xPos + radius * Math.cos(angle);
        var y = yPos + radius * Math.sin(angle);
        points.push([x, y]);
    }

    // Create the polygon
    var polygon = layer.pathItems.add();
    polygon.setEntirePath(points);
    polygon.closed = true;

    // Set the fill color
    polygon.filled = true;
    polygon.fillColor = createRGBColor(red, green, blue);

    // Optionally, you can set other properties for the polygon here
    polygon.stroked = false; // Disable stroke or adjust as necessary
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}