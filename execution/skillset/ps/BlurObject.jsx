if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt for the layer name to apply the blur
    var layerName = arguments[0];
    var blurAmount = parseFloat(arguments[1]);
    
    if (layerName !== null) {
        var layer;
        try {
            layer = doc.artLayers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            
            if (!isNaN(blurAmount) && blurAmount > 0) {
                // Make the specified layer the active layer
                doc.activeLayer = layer;
                
                // Apply Gaussian Blur with the specified radius
                layer.applyGaussianBlur(blurAmount);
            } else {
                throw new Error("Invalid blur amount entered. Please enter a positive number.");
            }
        } else {
            throw new Error("No layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to apply the blur.");
}