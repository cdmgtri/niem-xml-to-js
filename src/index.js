
let { parseString, defaults } = require("xml2js");
let toJsonSchema = require("to-json-schema");

// Note: xml2jsb boolean value processor currently returns null so created custom fn
// let { parseBooleans, parseNumbers } = require("xml2js/lib/processors");

let niemTransform = require("./niem-transform");
let Parsers = require("./parsers/index");


class niemXMLtoJS {

  /**
   * @param {string} xml
   */
  constructor(xml) {
    this.xml = xml;

    /** @type {ObjectConstructor} */
    this.unconvertedObj = undefined;

    /** @type {ObjectConstructor} */
    this.niemObj = undefined;

    /** @type {ObjectConstructor} */
    this.niemTemplate = undefined;
  }

  async convertXML() {
    if (!this.niemObj) {
      this.unconvertedObj = await convertXMLtoJS(this.xml, false);
      this.niemObj = niemTransform(this.unconvertedObj);

      let unconvertedTemplate = await convertXMLtoJS(this.xml, true);
      this.niemTemplate = niemTransform(unconvertedTemplate);
    }
    return Promise.resolve(this.niemObj);
  }

  jsObject(template=false) {
    if (!this.niemObj) throw new Error("Convert XML first");
    let obj = template ? this.niemTemplate : this.niemObj;
    return obj;
  }

  json(template=false, indentSpaces=2) {
    if (!this.niemObj) throw new Error("Convert XML first");
    let obj = template ? this.niemTemplate : this.niemObj;
    return JSON.stringify(obj, null, indentSpaces);
  }

  jsonSchema() {
    if (!this.niemObj) throw new Error("Convert XML first");
    let schema = toJsonSchema(this.niemObj);
    return JSON.stringify(schema, null, 2);
  }

  jsFileString(template=false, varName="IEPD") {
    if (!this.niemObj) throw new Error("Convert XML first");

    let json = this.json(template);

    let js= `\nlet ${varName} = ${json};\n\n`;
    js += `module.exports = ${varName};\n`
    return js;
  }

  originalObject() {
    if (!this.niemObj) throw new Error("Convert XML first");
    return this.unconvertedObj;
  }

}




/**
 * Convert the given XML instance to a NIEM JavaScript object
 *
 * @param {string} xml
 * @param {boolean} [template=false] - True if data should be replaced with empty values
 * @returns {ObjectConstructor}
 */
async function convertXMLtoJS(xml, template=false) {

  // Set up parsers based on whether data or empty strings should be returned
  let valueProcessors = template ? [Parsers.parseTemplate] : [Parsers.parseBooleans];

  let OPTS = defaults["0.2"];

  /** @type {OPTS} */
  let options = {
    trim: true,
    explicitArray: false,
    mergeAttrs: true ,
    charkey: "rdf:value",
    valueProcessors,
    attrValueProcessors: valueProcessors,
    attrNameProcessors: [Parsers.parseID],
  };

  // Use xml2js to convert the XML string into a JavaScript object.
  let convertedObj = undefined;
  await parseString(xml, options, (err, result) => {
    convertedObj = result;
  });

  return convertedObj;
}


module.exports = niemXMLtoJS;
