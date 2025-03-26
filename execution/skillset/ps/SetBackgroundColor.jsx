if (app.documents.length > 0) {
    var doc = app.activeDocument;

    try {
        var backgroundLayer = doc.backgroundLayer;

        // Check if the layer is indeed a background layer
        if (backgroundLayer.isBackgroundLayer) {
            doc.activeLayer = backgroundLayer;
            doc.activeLayer.isBackgroundLayer = false; // Convert to normal layer
            doc.activeLayer.name = "Background"; // Rename the layer for consistency
        }
    } catch (e) {
        backgroundLayer = doc.layers[doc.layers.length - 1];
        backgroundLayer.name = "Background"; // Rename for consistency
        var backgroundLayer = backgroundLayer
    }

    // Prompt user for new RGB color values
    var args = [].slice.call(arguments);
    var red = parseInt(args[0]);
    var green = parseInt(args[1]);
    var blue = parseInt(args[2]);

    if (!isNaN(red) && red >= 0 && red <= 255 &&
        !isNaN(green) && green >= 0 && green <= 255 &&
        !isNaN(blue) && blue >= 0 && blue <= 255) {

        // Create the solid color
        var solidColor = new SolidColor();
        solidColor.rgb.red = red;
        solidColor.rgb.green = green;
        solidColor.rgb.blue = blue;

        // Fill the layer with the solid color
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.fill(solidColor);
        app.activeDocument.selection.deselect();
    } else {
        throw new Error("Invalid RGB values. Please enter values between 0 and 255.");
    }
} else {
    throw new Error("No open document. Please open a document to change the background color.");
}