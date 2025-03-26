var doc;
var width, height;

var docTypes = {
    "postcard": [1000, 640],
    "poster": [1296, 1728],
    "book cover": [1296, 1728],
    "business card": [1000, 640],
};

// Get document type from arguments
var docType = arguments[0].toLowerCase();

if (docTypes.hasOwnProperty(docType)) {
    width = docTypes[docType][0];
    height = docTypes[docType][1];
} else {
    throw new Error("Invalid document type.");
}

// Create a new InDesign document
var myDocument = app.documents.add();

// Set up document preferences
with (myDocument.documentPreferences) {
    pageWidth = width + "pt";       // Set the page width
    pageHeight = height + "pt";     // Set the page height
    facingPages = false;            // Set whether the document has facing pages
    pagesPerDocument = 1;           // Set the number of pages in the document
}