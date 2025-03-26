if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var textString = arguments[1];
    
    if (layerName !== null && textString !== null) {
        // Add a new text layer
        var textLayerRef = doc.artLayers.add();
        textLayerRef.name = layerName;
        textLayerRef.kind = LayerKind.TEXT;

        // Access the text item properties
        var textItemRef = textLayerRef.textItem;
        textItemRef.contents = textString;
        
        // Set font size and name
        textItemRef.size = 30;
        textItemRef.font = "ArialMT";

        // Set text justification
        textItemRef.justification = Justification.CENTER; // Change as needed
    } else {
        throw new Error("No layer name or text provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to add text.");
}