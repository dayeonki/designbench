if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var layerName = arguments[0];
    var gradientName = arguments[1];
    var angle = parseFloat(arguments[2]);

    var startRed = parseInt(arguments[3]);
    var startGreen = parseInt(arguments[4]);
    var startBlue = parseInt(arguments[5]);
    var endRed = parseInt(arguments[6]);
    var endGreen = parseInt(arguments[7]);
    var endBlue = parseInt(arguments[8]);

    if (layerName !== null) {
        var layer;
        try {
            layer = doc.layers.getByName(layerName);
        } catch (e) {
            throw new Error("Layer with the name '" + layerName + "' does not exist.");
            layer = null;
        }

        if (layer) {
            if (!isNaN(red1) && red1 >= 0 && red1 <= 255 &&
                !isNaN(green1) && green1 >= 0 && green1 <= 255 &&
                !isNaN(blue1) && blue1 >= 0 && blue1 <= 255 &&
                !isNaN(red2) && red2 >= 0 && red2 <= 255 &&
                !isNaN(green2) && green2 >= 0 && green2 <= 255 &&
                !isNaN(blue2) && blue2 >= 0 && blue2 <= 255 &&
                !isNaN(angle) && angle >= 0 && angle <= 360) {
                // Create and apply the gradient
                applyGradientToLayer(doc, layer, gradientName, red1, green1, blue1, red2, green2, blue2, angle);
            } else {
                throw new Error("Invalid input. Please enter valid RGB color components and gradient angle.");
            }
        }
    } else {
        throw new Error("No layer name provided. Operation cancelled.");
    }
} else {
    throw new Error("No open document. Please open a document to apply the gradient.");
}

function applyGradientToLayer(doc, layer, gradientName, red1, green1, blue1, red2, green2, blue2, angle) {
    if (layer.pathItems.length > 0) {
        // Check if gradient with the given name already exists
        var gradient;
        try {
            gradient = doc.gradients.getByName(gradientName);
        } catch (e) {
            // Create the gradient if it doesn't exist
            gradient = doc.gradients.add();
            gradient.name = gradientName;
            gradient.type = GradientType.LINEAR;

            // Set gradient stops
            var stop1 = gradient.gradientStops.add();
            stop1.rampPoint = 0;
            stop1.color = createRGBColor(red1, green1, blue1);

            var stop2 = gradient.gradientStops.add();
            stop2.rampPoint = 100;
            stop2.color = createRGBColor(red2, green2, blue2);
        }

        // Apply the gradient fill to each path item in the layer
        for (var i = 0; i < layer.pathItems.length; i++) {
            var shape = layer.pathItems[i];
            var gradientFill = new GradientColor();
            gradientFill.gradient = gradient;
            
            shape.fillColor = gradientFill;
            shape.filled = true;

            // Adjust gradient angle
            adjustGradientAngle(shape, angle);
        }
    } else {
        throw new Error("No path items found in the specified layer.");
    }
}

function createRGBColor(red, green, blue) {
    var rgbColor = new RGBColor();
    rgbColor.red = red;
    rgbColor.green = green;
    rgbColor.blue = blue;
    return rgbColor;
}

function adjustGradientAngle(shape, angle) {
    // Adjust gradient angle directly on the gradient
    var gradientFill = shape.fillColor;
    if (gradientFill.typename === "GradientColor") {
        gradientFill.gradient.angle = angle;
        shape.fillColor = gradientFill; // Reapply the gradient with the new angle
    }
}