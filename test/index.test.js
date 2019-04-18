
let fs = require("fs");
let path = require("path");

let niemXMLtoJS = require("../src/index");

let xmlFilePath = path.join(__dirname, "sample.xml");
let outputFolder = path.join(__dirname, "output/");

// Read the sample XML message
let xml = fs.readFileSync(xmlFilePath, "utf-8");

let niemXML = new niemXMLtoJS(xml);

describe("NIEM XML conversions", () => {

  beforeAll( async() => {
    await niemXML.convertXML();
  });

  test("object", () => {
    let obj = niemXML.jsObject();
    expect(obj["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("George");
  });

  test("json", () => {
    let json = niemXML.json();
    saveFile("sample.json", json);

    let objJSON = JSON.stringify( niemXML.jsObject(), null, 2 );
    expect(json).toEqual(objJSON);
  });

  test("jsonSchema", () => {
    let jsonSchema = niemXML.jsonSchema();
    saveFile("sample.schema.json", jsonSchema);

    let schema = JSON.parse(jsonSchema);
    expect(schema.properties["ext:PassportExchange"].type).toEqual("object");
  })

  test("jsFileString", () => {
    let jsFileString = niemXML.jsFileString();
    saveFile("sample.js", jsFileString);

    let iepd = require("./output/sample.js");
    expect(iepd["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("George");
  });


  test("object template", () => {
    let template = niemXML.jsObject(true);
    saveFile("template.json", template, true);

    expect(template["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("");
  });
});

function saveFile(fileName, data, stringify=false) {
  let text = stringify ? JSON.stringify(data, null, 2) : data;
  fs.writeFileSync(outputFolder + fileName, text);
}
