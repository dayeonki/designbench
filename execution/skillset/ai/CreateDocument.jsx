var doc;
var width, height;

// Get document type from arguments
var docType = arguments[0];

switch (docType.toLowerCase()) {
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
        throw new Error("Invalid document type");
}

if (app.documents.length == 0) {
    doc = app.documents.add(DocumentColorSpace.RGB, width, height);
} else {
    doc = app.activeDocument;
}
app.executeMenuCommand ('fitall');

doc.defaultFilled = true;
doc.defaultStroked = true;