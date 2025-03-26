var doc;
var width = Number(arguments[0]);
var height = Number(arguments[1]);

// Ensure width and height are valid numbers
if (isNaN(width) || isNaN(height)) {
    throw new Error("Invalid width or height. Please provide valid numbers.");
} else {
    var doc;
    
    if (app.documents.length == 0) {
        // Create a new document with the specified width and height
        doc = app.documents.add(width, height, 72, "New Document");
    } else {
        // Use the active document
        doc = app.activeDocument;
        
        // Resize the canvas if the document is already open
        doc.resizeCanvas(width, height);
    }
    
    // Set default properties or perform further actions as needed
    doc.activeLayer.isBackgroundLayer = false;
}
runMenuItem(app.charIDToTypeID("FtOn"));