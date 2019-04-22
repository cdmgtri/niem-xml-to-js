

/**
 * Transform the XML -> JS object to meet NIEM JSON guidance
 *
 * @param {boolean} [isTemplate=false] True if data should be transferred; false if template
 */
function niemify(obj, isTemplate=false) {

  let niemObj = {

    "@context": {},

    // Clone the original attribute (deep copy)
    ...JSON.parse( JSON.stringify(obj) )
  };

  dropNils(niemObj);
  refactorXMLHeader(niemObj);
  applyAugmentations(niemObj);
  processMetadata(niemObj, niemObj["@context"]);
  addRDF(niemObj, isTemplate);

  return niemObj;
}

/**
 * Moves XML namespace prefix declaration properties to a new '@context' property
 *
 * @param {ObjectConstructor} obj
 */
function refactorXMLHeader(obj) {

  let root = Object.values(obj)[1];

  if (!root) {
    return obj;
  }

  let context = {};

  for (let key in root) {
    if (key == "xsi:schemaLocation" || key == "xmlns:xsi") {
      // Drop XML-specific prefix declarations
      delete root[key];
    }
    else if (key == "xmlns") {
      // TODO: How should we handle a default namespace in @context?
      context.default = root[key];
      delete root[key];
    }
    else if (key.startsWith("xmlns:")) {
      let prefix = key.replace("xmlns:", "");

      let value = root[key];
      if (value.length > 0 && !value.endsWith("#")) {
        // Append a # if not an empty string and does not already end with #
        value = value + "#";
      }

      context[prefix] = value;
      delete root[key];
    }
  }

  obj["@context"] = context;

}

/**
 * Adds rdf to the `@context` object.
 *
 * @param {ObjectConstructor} obj
 * @param {boolean} [isTemplate=false] True if data should be transferred; false if template
 */
function addRDF(obj, isTemplate=false) {

  let rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  obj["@context"].rdf = isTemplate ? "" : rdf;

}

/**
 * Recurse over object, moving augmentation properties out of each
 * augmentation container.
 *
 * @param {*} obj
 */
function applyAugmentations(obj) {

  if (typeof obj != "object") {
    return;
  }

  for (let key in obj) {

    if (key.endsWith("Augmentation")) {

      /** @type {ObjectConstructor} */
      let aug = obj[key];

      for (let augKey in aug) {
        // Add each augmentation property in the container to the container's parent
        obj[augKey] = aug[augKey];
      }

      // Delete the augmentation container
      delete obj[key];

    }
    else {
      // Recurse
      applyAugmentations(obj[key]);
    }

  }
}

/**
 * Recurse over the object, dropping all `xsi:nil` properties.
 */
function dropNils(obj) {

  if (typeof obj != "object") {
    // Leaf reached - stop recursion
    return;
  }

  for (let key in obj) {
    if (key == "xsi:nil") {
      // Delete `xsi:nil` property
      delete obj[key];
    }
    else {
      // Recurse over sub-property
      dropNils(obj[key]);
    }
  }
}

/**
 * Convert each `structures:metadata` space-delimited string of metadata IDs to
 * an array of metadata IDs.  Add the type of `structures:metadata` to `@context` to
 * enable proper referencing.
 */
function processMetadata(obj, context) {

  if (typeof obj != "object") {
    // Leaf reached - stop recursion
    return;
  }

  for (let key in obj) {

    if (key == "structures:metadata") {

      // Add the type of `structures:metadata` to the `@context` property
      context["structures:metadata"] = {
        "@type": "@id"
      };

      /** @type {string} */
      let metadataIDs = obj[key];

      // Convert the space-delimited ID string to an array of ID strings
      obj[key] = metadataIDs.split(" ");

      return;
    }
    else {
      // Recurse over the sub-object
      processMetadata(obj[key], context);
    }
  }
}

module.exports = niemify;
