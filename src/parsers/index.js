
/**
 * xml2js value parser function
 *
 * Convert booleans to false as default.
 * Converts integers to 0 as default.
 * Converts decimals to 0.0 as default.
 * Convert strings to "".
 */
function parseTemplate(value, name) {
  if (value == "true" || value == "false") {
    return false;
  }
  else if ( /^-?\d+$/.test(value) ) {
    // Positive or negative integer
    return 0;
  }
  else if (! isNaN(value)) {
    // Decimal
    return 0.1;
  }
  return "";
}

/**
 * xml2js attribute name parser function
 *
 * Convert structures:id, structures:ref, and structures:uri to "@id".
 */
function parseID(name) {
  if (name == "structures:id" || name == "structures:ref" || name == "structures:uri") {
    return "@id";
  }
  return name;
}


module.exports = {
  parseTemplate,
  parseID
}
