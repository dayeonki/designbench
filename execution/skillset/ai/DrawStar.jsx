if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var numPoints = parseInt(arguments[1]);
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

        if (!isNaN(numPoints) && numPoints >= 5 &&
            !isNaN(radius) && radius > 0 &&
            !isNaN(red) && red >= 0 && red <= 255 &&
            !isNaN(green) && green >= 0 && green <= 255 &&
            !isNaN(blue) && blue >= 0 && blue <= 255) {
            createStar(doc, layer, numPoints, radius, red, green, blue);
        } else {
            throw new Error("Invalid input. Please enter valid number of points, radius, and RGB color components.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add the star.");
}

function createStar(doc, layer, numPoints, radius, red, green, blue) {
    // Get the dimensions of the artboard
    var artboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
    var artboardRect = artboard.artboardRect;
    var artboardWidth = artboardRect[2] - artboardRect[0];
    var artboardHeight = artboardRect[1] - artboardRect[3];

    // Calculate the star position (center of the artboard)
    var xPos = artboardRect[0] + artboardWidth / 2;
    var yPos = artboardRect[1] - artboardHeight / 2;

    // Create the star
    var star = layer.pathItems.add();
    star.setEntirePath(getStarPath(xPos, yPos, numPoints, radius));

    // Set the fill color
    star.filled = true;
    star.fillColor = createRGBColor(red, green, blue);

    // Optionally, you can set other properties for the star here
    star.stroked = false; // Disable stroke or adjust as necessary
}

function getStarPath(centerX, centerY, numPoints, radius) {
    var path = [];
    var angleStep = 360 / numPoints;
    var outerRadius = radius;
    var innerRadius = radius / 2;

    for (var i = 0; i < numPoints * 2; i++) {
        var angle = i * angleStep / 2;
        var radiusValue = (i % 2 === 0) ? outerRadius : innerRadius;
        var x = centerX + radiusValue * Math.cos(degreesToRadians(angle));
        var y = centerY - radiusValue * Math.sin(degreesToRadians(angle));
        path.push([x, y]);
    }

    path.push(path[0]); // Close the path
    return path;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}