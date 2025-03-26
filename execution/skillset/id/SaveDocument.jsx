if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Get file name and format from arguments
    var fileName = arguments[0];
    var format = arguments[1].toLowerCase();  // Convert format to lowercase for consistency
    
    if (fileName) {
        // Check if the file name already includes Folder.desktop
        var saveLocation;
        // saveLocation = Folder.desktop + "/" + fileName;
        var desktopFolder = Folder.desktop + "/";
        saveLocation = desktopFolder + fileName;

        if (fileName.substr(-format.length - 1) !== "." + format) {
            fileName += "." + format;
        }

        // Check if the fileName already ends with the format extension
        // if (!fileName.toLowerCase().endsWith("." + format)) {
        //     saveLocation += "." + format;
        // }
        
        var saveFile = new File(saveLocation);

        if (format === "indd") {
            // Save as INDD
            doc.save(saveFile);
        } else if (format === "pdf") {
            // PDF Export Preset
            var pdfExportPreset = app.pdfExportPresets.item("[High Quality Print]");

            // Export as PDF
            doc.exportFile(ExportFormat.pdfType, saveFile, false, pdfExportPreset);
        } else if (format === "png") {
            // Export as PNG
            var pngExportOptions = new ExportOptionsPNG24();
            pngExportOptions.antiAlias = true;
            pngExportOptions.transparentBackground = true;
            pngExportOptions.horizontalScale = 100;
            pngExportOptions.verticalScale = 100;

            // Export the first page as PNG
            doc.pages.item(0).exportFile(ExportFormat.PNG_FORMAT, saveFile, false, pngExportOptions);
        } else if (format === "jpeg") {
            // Export as JPEG
            var jpegExportOptions = new ExportOptionsJPEG();
            jpegExportOptions.qualitySetting = 100; // Highest quality
            jpegExportOptions.exportResolution = 300; // 300 DPI

            // Export the first page as JPEG
            doc.pages.item(0).exportFile(ExportFormat.JPG, saveFile, false, jpegExportOptions);
        } else {
            throw new Error("Invalid format. Please enter 'indd', 'pdf', 'png', or 'jpeg'.");
        }
    } else {
        throw new Error("Save cancelled.");
    }
} else {
    throw new Error("No active document to save.");
}