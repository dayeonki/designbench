if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Get file name and format from arguments
    var fileName = arguments[0];
    var format = arguments[1];

    if (fileName) {
        var saveLocation;
        var desktopFolder = Folder.desktop + "/";
        saveLocation = desktopFolder + fileName;

        if (!fileName.endsWith("." + format)) {
            saveLocation += "." + format;
        }
        
        // if (!fileName.toLowerCase().endsWith("." + format)) {
        //     saveLocation += "." + format;
        // }

        if (format.toLowerCase() === "ai") {
            // saveLocation += ".ai";
            var saveFile = new File(saveLocation);

            var aiSaveOptions = new IllustratorSaveOptions();
            aiSaveOptions.compatibility = Compatibility.ILLUSTRATOR17;
            aiSaveOptions.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;

            doc.saveAs(saveFile, aiSaveOptions);
        } else if (format.toLowerCase() === "pdf") {
            // saveLocation += ".pdf";
            var saveFile = new File(saveLocation);

            var pdfSaveOptions = new PDFSaveOptions();
            pdfSaveOptions.compatibility = PDFCompatibility.ACROBAT5; // Example option, adjust as needed

            doc.saveAs(saveFile, pdfSaveOptions);
        } else if (format.toLowerCase() === "png") {
            // saveLocation += ".png";
            var saveFile = new File(saveLocation);

            var exportOptions = new ExportOptionsPNG24();
            exportOptions.horizontalScale = 100.0;
            exportOptions.verticalScale = 100.0;
            exportOptions.transparency = true;

            doc.exportFile(saveFile, ExportType.PNG24, exportOptions);
        } else {
            throw new Error("Invalid format. Please enter 'ai', 'pdf', or 'png'.");
        }
    } else {
        throw new Error("Save cancelled.");
    }
} else {
    throw new Error("No active document to save.");
}
