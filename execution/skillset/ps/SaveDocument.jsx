if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Get file name and format from arguments
    var fileName = arguments[0];
    var format = arguments[1];
    
    if (fileName) {
        var saveLocation;
        var desktopFolder = Folder.desktop + "/";
        saveLocation = desktopFolder + fileName;
        
        if (fileName.substr(-format.length - 1) !== "." + format) {
            fileName += "." + format;
        }

        if (format.toLowerCase() === "psd") {
            var saveFile = new File(saveLocation);

            var psdSaveOptions = new PhotoshopSaveOptions();
            psdSaveOptions.layers = true;

            doc.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);
        } else if (format.toLowerCase() === "png") {
            doc.flatten();
            doc.artLayers.add();
            
            // saveLocation += ".png";
            var saveFile = new File(saveLocation);

            var pngSaveOptions = new PNGSaveOptions();
            pngSaveOptions.interlaced = false;

            doc.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
        } else if (format.toLowerCase() === "pdf") {
            // saveLocation += ".pdf";
            var saveFile = new File(saveLocation);

            var pdfSaveOptions = new PDFSaveOptions();
            pdfSaveOptions.PDFStandard = PDFStandard.PDFX1A2001;

            doc.saveAs(saveFile, pdfSaveOptions, true, Extension.LOWERCASE);
        } else {
            throw new Error("Invalid format. Please enter 'psd', 'png', or 'pdf'.");
        }
    } else {
        throw new Error("Save cancelled.");
    }
} else {
    throw new Error("No active document to save.");
}