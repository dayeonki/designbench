if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Prompt for layer name and arrangement
    var layerName = arguments[0];
    var arrangement = arguments[1].toLowerCase();

    // Validate arrangement input
    if (arrangement !== "front" && arrangement !== "back" && arrangement !== "forward" && arrangement !== "backward") {
        throw new Error("Invalid arrangement option. Please enter 'front', 'back', 'forward', or 'backward'.");
    } else if (layerName !== null) {
        var foundLayer = false;

        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];

            if (layer.name === layerName) {
                foundLayer = true;
                
                switch (arrangement) {
                    case "front":
                        layer.move(LocationOptions.AT_END);
                        break;
                    case "back":
                        layer.move(LocationOptions.AT_BEGINNING);
                        break;
                    case "forward":
                        if (i < doc.layers.length - 1) {
                            layer.move(doc.layers[i + 1], ElementPlacement.PLACEBEFORE);
                        } else {
                            throw new Error("The layer is already at the top. It cannot be moved forward.");
                        }
                        break;
                    case "backward":
                        if (i > 0) {
                            layer.move(doc.layers[i - 1], ElementPlacement.PLACEAFTER);
                        } else {
                            throw new Error("The layer is already at the bottom. It cannot be moved backward.");
                        }
                        break;
                }
                break;
            }
        }

        if (!foundLayer) {
            throw new Error("No layer found with the specified name.");
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to arrange the layer.");
}
