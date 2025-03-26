if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var arrangement = arguments[1].toLowerCase();

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer not found. Please enter a valid layer name.");
        }

        if (layer) {

            if (arrangement !== null) {
                for (var i = 0; i < layer.textFrames.length; i++) {
                    var textFrame = layer.textFrames[i];
                    
                    switch (arrangement.toLowerCase()) {
                        case "front":
                            textFrame.move(doc, ElementPlacement.PLACEATEND); // Move to front
                            break;
                        case "back":
                            textFrame.move(doc, ElementPlacement.PLACEATBEGINNING); // Move to back
                            break;
                        case "forward":
                            textFrame.move(doc, ElementPlacement.PLACEAFTER); // Move forward by one
                            break;
                        case "backward":
                            textFrame.move(doc, ElementPlacement.PLACEBEFORE); // Move backward by one
                            break;
                        default:
                            throw new Error("Invalid arrangement provided. Operation cancelled.");
                            break;
                        }
                    }
                } else {
                    throw new Error("No arrangement arrangement provided. Operation cancelled.");
                }
            }
        } else {
            throw new Error("No layer name provided. Operation cancelled.");
        }
    } else {
        throw new Error("No open document. Please open a document to arrange the text.");
    }