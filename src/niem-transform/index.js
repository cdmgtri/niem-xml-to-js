

/**
 * Transform the XML -> JS object to meet NIEM JSON guidance
 */
function niemify(obj) {

  let niemObj = {

    "@context": {},

    // Clone the original attribute (deep copy)
    ...JSON.parse( JSON.stringify(obj) )
  };

  transformXMLHeader(niemObj);
  transformAugmentations(niemObj);

  return niemObj;
}

/**
 * Moves XML namespace prefix declaration properties to a new '@context' property
 *
 * @param {ObjectConstructor} obj
 */
function transformXMLHeader(obj) {

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
 * Recurse over object, moving augmentation properties out of each
 * augmentation container.
 *
 * @param {*} obj
 */
function transformAugmentations(obj) {

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
      transformAugmentations(obj[key]);
    }

  }
}

module.exports = niemify;
