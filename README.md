
# NIEM XML to JS

This project converts a XML instance to NIEM JSON, JSON Schema, and/or a JavaScript object.

## NIEM Transformations

- [x] Converts XML namespace prefix declarations to `@context` object
- [x] Moves augmentation properties out of augmentation container to the parent object
- [x] Converts `structures:id`, `structures:ref` and `structures:uri` attributes to `@id`

## To Do

- Add example outputs to the README
- Integrate with Travis and Coveralls
- Add CLI option
- Build a simple app hosted on GitHub pages so users can convert XML instances without having to run the code

## Installation

```sh
npm i cdmgtri/niem-xml-to-js
```

## Usage

See the `test/output` folder for sample results.

### Setup

```js
let fs = require("fs");
let niemXMLtoJS = require("niem-xml-to-js");

let xml = fs.readFileSync(xmlFilePath, "utf-8");

let niemXML = new niemXMLtoJS(xml)
await niemXML.convertXML();
```

### Get NIEM JavaScript object

```js
let obj = niemXML.jsObject();
```

### Get NIEM JSON

```js
let json = niemXML.json();
```

### Get JSON Schema

```js
let jsonSchema = niemXML.jsonSchema();
```

### Get NIEM JavaScript as exported object

```js
let jsFileString = niemXML.jsFileString();
```
