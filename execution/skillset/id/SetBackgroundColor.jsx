if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt user for new RGB color values
    var args = [].slice.call(arguments);
    var red = parseInt(args[0]);
    var green = parseInt(args[1]);
    var blue = parseInt(args[2]);

    if (!isNaN(red) && red >= 0 && red <= 255 &&
        !isNaN(green) && green >= 0 && green <= 255 &&
        !isNaN(blue) && blue >= 0 && blue <= 255) {

        // Create the color swatch
        var newColor = doc.colors.add();
        newColor.model = ColorModel.process;
        newColor.space = ColorSpace.RGB;
        newColor.colorValue = [red, green, blue];
        newColor.name = "BackgroundColor";

        // Apply the color to the background of the first page
        var firstPage = doc.pages.item(0);
        var pageBounds = firstPage.bounds;

        // Create a rectangle that covers the entire page
        var rect = firstPage.rectangles.add();
        rect.geometricBounds = [pageBounds[0], pageBounds[1], pageBounds[2], pageBounds[3]];
        rect.fillColor = newColor;
        rect.strokeColor = doc.swatches.item("None"); // No stroke

        // Send the rectangle to the back
        rect.sendToBack();
    } else {
        throw new Error("Invalid RGB values. Please enter values between 0 and 255.");
    }
} else {
    throw new Error("No open document. Please open a document to change the background color.");
}