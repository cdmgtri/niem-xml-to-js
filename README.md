
# NIEM XML to JSON

Build the JSON representation of a NIEM IEPD from a sample XML instance.  This allows developers to use NIEM XML-only tools like the [SSGT](https://tools.niem.gov/niemtools/ssgt/index.iepd) (generate NIEM subsets) and [ConTesA](https://tools.niem.gov/contesa/) (check NDR conformance) to model an exchange without later having to model the JSON representation manually.

See the current guidance on [NIEM JSON](http://niem.github.io/json) for more information on the JSON representation of an IEPD.

## NIEM Transformations

- [x] Convert a XML instance to JSON using the [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) library with the following options:
  - [x] create arrays only when multiple values are provided in an instance
  - [x] convert "true" and "false" strings to booleans
  - [x] use `rdf:value` as the name of the value key for an XML element with both a value and attributes
  - [x] optionally replace string data with empty quotes to create a JSON template
- [x] Convert and move root-level XML namespace prefix declarations to a new `@context` property
- [x] Move augmentation properties from augmentation containers to the parent objects
- [x] Convert `structures:id`, `structures:ref` and `structures:uri` attributes to `@id`

## Installation

```sh
npm i cdmgtri/niem-xml-to-json
```

## Usage

See the `test/output` folder for sample results.

```js
let fs = require("fs");
let niemXMLtoJSON = require("niem-xml2json");

let xml = fs.readFileSync(xmlFilePath, "utf-8");

// Option 1:
let results = await niemXMLtoJSON(xml);

// Option 2: Destructure and assign what you need from the results
let {originalJSON, niemJSON, niemTemplateJSON, jsonSchema} = await niemXMLtoJSON(xml);
```
