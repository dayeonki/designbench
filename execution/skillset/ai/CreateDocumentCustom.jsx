var doc;

// Get width and height from arguments
var width = parseInt(arguments[0]);
var height = parseInt(arguments[1]);

if (isNaN(width) || isNaN(height)) {
  throw new Error("Invalid input. Please enter numeric values for width and height.");
} else {
  if (app.documents.length == 0) {
    doc = app.documents.add(DocumentColorSpace.RGB, width, height);
  } else {
    doc = app.activeDocument;
  }

  doc.defaultFilled = true;
  doc.defaultStroked = true;
}
app.executeMenuCommand ('fitall');