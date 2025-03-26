if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var linkURL = arguments[1];

    if (layerName !== null && layerName !== "" && linkURL !== null && linkURL !== "") {
        generateQRCode(layerName, linkURL);
    } else {
        throw new Error("No valid layer name or URL provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to generate a QR code.");
}

function generateQRCode(layerName, url) {
    // Create or get the layer
    var qrLayer;
    try {
        qrLayer = doc.layers.item(layerName);
        qrLayer.name; // This will throw an error if the layer doesn't exist
    } catch (e) {
        qrLayer = doc.layers.add({name: layerName});
    }

    // Add a new rectangle to the first page on the specified layer
    var page = doc.pages.item(0);
    var qrRect = page.rectangles.add({
        geometricBounds: [10, 10, 50, 50], // Adjust the size and position as needed
        itemLayer: qrLayer
    });

    // Add a QR code to the rectangle
    qrRect.createHyperlinkQRCode(url);

    // Set the fill color of the rectangle to none
    qrRect.fillColor = doc.swatches.itemByName("None");
    qrRect.strokeColor = doc.swatches.itemByName("None"); // Set the stroke color to none

    // Explicitly set the stroke weight to 0pt
    qrRect.strokeWeight = 0;
}