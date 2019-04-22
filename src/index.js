
let { parseString, defaults } = require("xml2js");
let toJsonSchema = require("to-json-schema");

// Note: xml2js parseBooleans value processor returned nulls so created custom fn
let { parseNumbers, parseBooleans } = require("xml2js/lib/processors");

let niemify = require("./niem-transform");
let Parsers = require("./parsers/index");

/**
 * @typedef {Object} resultObjects
 * @property {Object} originalJSON - See the direct transformation from XML to JSON
 * @property {Object} niemJSON - NIEM-specific transformations applied
 * @property {Object} niemTemplateJSON - niemJSON with data values replaced with empty strings
 * @property {Object} jsonSchema - JSON schema generated from the niemJSON representation
 */
let resultObjectsType;


/**
 * Convert the given XML string to JSON, NIEM JSON, NIEM JSON template,
 * and JSON schema.
 *
 *
 * @param {string} xml - XML instance string
 * @param {number} indentSpaces - Number of spaces to indent stringified results
 * @returns {resultObjects}
 */
async function niemXMLtoJSON(xml, indentSpaces=2) {

  // Convert XML to JS
  let originalObj = await convertXMLtoJS(xml, false, false);

  // Convert JS to NIEM JS
  let niemObj = await convertXMLtoJS(xml);
  niemObj = niemify(niemObj);

  // Convert XML to NIEM JS template (replace data with empty strings)
  let originalTemplateObj = await convertXMLtoJS(xml, true);
  let niemTemplateObj = niemify(originalTemplateObj, true);

  // Generate JSON schema from NIEM JS
  let jsonSchema = toJsonSchema(niemObj);

  /** @type {resultObjects} */
  let results = {
    originalJSON: JSON.stringify(originalObj, null, indentSpaces),
    niemJSON: JSON.stringify(niemObj, null, indentSpaces),
    niemTemplateJSON: JSON.stringify(niemTemplateObj, null, indentSpaces),
    jsonSchema: JSON.stringify(jsonSchema, null, indentSpaces)
  };

  return results;
}


/**
 * Convert the given XML instance to a JavaScript object
 *
 * @param {string} xml
 * @param {boolean} [template=false] - True if data should be replaced with empty values
 * @param {boolean} [niemify=true]   - True if NIEM parsers should be used
 * @returns {ObjectConstructor}
 */
async function convertXMLtoJS(xml, template=false, niemify=true) {

  // Convert values for an empty template, or parse booleans and numbers appropriately
  let valueProcessors = template ? [Parsers.parseTemplate] : [parseNumbers, parseBooleans];

  // If converting to NIEM, convert structures:id, ref, and uri attributes to @id
  let attrNameProcessors = niemify ? [Parsers.parseID] : [];

  let OPTS = defaults["0.2"];

  /** @type {OPTS} */
  let options = {
    trim: true,
    explicitArray: false,
    mergeAttrs: true ,
    charkey: "rdf:value",
    valueProcessors,
    attrValueProcessors: valueProcessors,
    attrNameProcessors,
  };

  // Use xml2js to convert the XML string into a JavaScript object.
  let convertedObj = undefined;
  await parseString(xml, options, (err, result) => {
    convertedObj = result;
  });

  return convertedObj;
}


module.exports = niemXMLtoJSON;
