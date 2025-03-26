// Get width and height from arguments
var width = arguments[0];
var height = arguments[1];

if (!width || !height || isNaN(width) || isNaN(height)) {
    throw new Error("Invalid width or height. Please enter numeric values.");
    throw new Error("Invalid width or height");
}

// Create a new InDesign document
var myDocument = app.documents.add();

// Set up document preferences
with (myDocument.documentPreferences) {
    pageWidth = Number(width) + "pt";       // Set the page width
    pageHeight = Number(height) + "pt";     // Set the page height
    facingPages = false;                    // Set whether the document has facing pages
    pagesPerDocument = 1;                   // Set the number of pages in the document
}
