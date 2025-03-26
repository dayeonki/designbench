if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt the user for the image file name
    var fileName = arguments[0];
    var layerName = arguments[1];

    if (fileName) {
        var desktopFolder = Folder.desktop + "/";
        var filePath = desktopFolder + fileName;
        var imageFile = File(filePath);

        if (imageFile.exists) {

            if (layerName) {
                placeImageInMiddle(imageFile, layerName);
            } else {
                throw new Error("No layer name entered. Layer renaming cancelled.");
            }
        } else {
            throw new Error("File " + filePath + " does not exist.");
        }
    } else {
        throw new Error("No file name entered. Import cancelled.");
    }
} else {
    throw new Error("No active document to import the image into.");
}

function placeImageInMiddle(file, layerName) {
    // Add a new layer with the specified name
    var layer = doc.layers.add();
    layer.name = layerName;
    doc.pages.item(0).place(file)[0];
}