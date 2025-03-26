var doc;
var width, height;

// Get document type from arguments
var docType = arguments[0].toLowerCase();

switch (docType) {
    case "postcard":
        width = 1000;
        height = 640;
        break;
    case "poster":
        width = 1296;
        height = 1728;
        break;
    case "book cover":
        width = 1296;
        height = 1728;
        break;
    case "business card":
        width = 1000;
        height = 640;
        break;
    default:
        throw new Error("Invalid document type.");
}

// Convert dimensions from points to inches
// width = width / 72;
// height = height / 72;

// Create a new document in Photoshop with the specified dimensions
doc = app.documents.add(width, height, 300, docType.charAt(0).toUpperCase() + docType.slice(1), NewDocumentMode.RGB, DocumentFill.WHITE);

runMenuItem(app.charIDToTypeID("FtOn"));