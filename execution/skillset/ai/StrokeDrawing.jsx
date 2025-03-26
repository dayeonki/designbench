if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var strokeWidth = parseFloat(arguments[1]);
    var red = parseInt(arguments[2]);
    var green = parseInt(arguments[3]);
    var blue = parseInt(arguments[4]);

    if (layerName) {
        var layer = doc.layers.getByName(layerName);

        if (layer && layer.pathItems.length > 0) {
            if (!isNaN(strokeWidth) && strokeWidth > 0 && 
                !isNaN(red) && red >= 0 && red <= 255 && 
                !isNaN(green) && green >= 0 && green <= 255 && 
                !isNaN(blue) && blue >= 0 && blue <= 255) {
                adjustStroke(layer.pathItems, strokeWidth, red, green, blue);
            } else {
                throw new Error("Invalid stroke width or RGB values entered.");
            }
        } else {
            throw new Error("No path items found in the specified layer.");
        }
    } else {
        throw new Error("No layer name entered. Stroke adjustment cancelled.");
    }
} else {
    throw new Error("No active document to adjust the stroke.");
}

function adjustStroke(items, strokeWidth, red, green, blue) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.strokeWidth = strokeWidth;
        
        var strokeColor = new RGBColor();
        strokeColor.red = red;
        strokeColor.green = green;
        strokeColor.blue = blue;
        
        item.strokeColor = strokeColor;
    }
}