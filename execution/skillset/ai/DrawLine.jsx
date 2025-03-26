if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var startX = parseFloat(arguments[1]);
    var startY = parseFloat(arguments[2]);
    var endX = parseFloat(arguments[3]);
    var endY = parseFloat(arguments[4]);
    var strokeWidth = parseFloat(arguments[5]);
    var red = parseInt(arguments[6]);
    var green = parseInt(arguments[7]);
    var blue = parseInt(arguments[8]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            layer = doc.layers.add();
            layer.name = layerName;
        }

        if (!isNaN(startX) && !isNaN(startY) && !isNaN(endX) && !isNaN(endY) &&
            !isNaN(strokeWidth) && strokeWidth >= 0.25 && strokeWidth <= 5 &&
            !isNaN(red) && red >= 0 && red <= 255 &&
            !isNaN(green) && green >= 0 && green <= 255 &&
            !isNaN(blue) && blue >= 0 && blue <= 255) {

            // Draw the line
            drawLine(doc, layer, startX, startY, endX, endY, strokeWidth, red, green, blue);
        } else {
            throw new Error("Invalid input. Please enter valid coordinates, stroke width, and RGB color components.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to draw the line.");
}

function drawLine(doc, layer, startX, startY, endX, endY, strokeWidth, red, green, blue) {
    // Create the line
    var line = layer.pathItems.add();
    line.setEntirePath([[startX, startY], [endX, endY]]);
    line.stroked = true;
    line.strokeWidth = strokeWidth;
    
    // Set the stroke color
    var strokeColor = new RGBColor();
    strokeColor.red = red;
    strokeColor.green = green;
    strokeColor.blue = blue;
    line.strokeColor = strokeColor;
    
    // Optionally, you can set other properties for the line here
    line.filled = false; // Disable fill
}