
/**
 * xml2js value parser function
 * Convert "true" and "false" property values to booleans.
 */
function parseBooleans(value, name) {

  if (value == "true") {
    return true;
  }
  else if (value == "false") {
    return false;
  }
  return value;
}

/**
 * xml2js value parser function
 * Convert booleans to false as default.
 * Convert strings to "".
 */
function parseTemplate(value, name) {
  if (value == "true" || value == "false") {
    return false;
  }
  return "";
}

/**
 * xml2js attribute name parser function
 * Convert structures:id, structures:ref, and structures:uri to "@id".
 */
function parseID(name) {
  if (name == "structures:id" || name == "structures:ref" || name == "structures:uri") {
    return "@id";
  }
  return name;
}


module.exports = {
  parseBooleans,
  parseTemplate,
  parseID
}
