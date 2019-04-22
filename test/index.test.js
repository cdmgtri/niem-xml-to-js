
let fs = require("fs");
let path = require("path");

let niemXMLtoJSON = require("../src/index");

let dataFolder;

let originalJSON;
let niemJSON;
let niemTemplateJSON;
let jsonSchema;

describe("NIEM Passport XML conversions", () => {

  beforeAll( async() => {
    dataFolder = path.join(__dirname, "passport/");

    // Read the sample XML message
    let xml = fs.readFileSync(dataFolder + "_passport.xml", "utf-8");

    // Convert the XML to NIEM JSON
    let results = await niemXMLtoJSON(xml);

    originalJSON = results.originalJSON;
    niemJSON = results.niemJSON;
    niemTemplateJSON = results.niemTemplateJSON;
    jsonSchema = results.jsonSchema;

    // Save the results to JSON files
    saveFile("passport.json", niemJSON);
    saveFile("passport.original.json", originalJSON);
    saveFile("passport.template.json", niemTemplateJSON);
    saveFile("passport.schema.json", jsonSchema);
  });


  test("Original JSON", () => {
    let obj = JSON.parse(originalJSON);

    // Should be the same as the NIEM JSON version
    expect(obj["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("George");

    // Should have the original augmentation
    expect(obj["ext:PassportExchange"]["nc:Passport"]).toHaveProperty("ext:PassportAugmentation");

    // Should have the original structures:id
    expect(obj["ext:PassportExchange"]["nc:Passport"]["nc:DocumentEffectiveDate"]["nc:Date"]).toHaveProperty("structures:id");
  });


  test("NIEM JSON", () => {
    let niemObj = JSON.parse(niemJSON);

    // Should be the same as the original JSON version
    expect(niemObj["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("George");

    // Should have refactored namespace prefix declarations into @context
    expect(niemObj).toHaveProperty("@context");
    expect(niemObj["@context"]).toHaveProperty("ext");

    // Should have refactored augmentations
    expect(niemObj["ext:PassportExchange"]["nc:Passport"]).not.toHaveProperty("ext:PassportAugmentation");
    expect(niemObj["ext:PassportExchange"]["nc:Passport"]).toHaveProperty("ext:PassportExpeditedIndicator");

    // Should have converted structures:id to @id
    expect(niemObj["ext:PassportExchange"]["nc:Passport"]["nc:DocumentEffectiveDate"]["nc:Date"]).not.toHaveProperty("structures:id");
    expect(niemObj["ext:PassportExchange"]["nc:Passport"]["nc:DocumentEffectiveDate"]["nc:Date"]).toHaveProperty("@id");

  });


  test("NIEM Template JSON", () => {
    let templateObj = JSON.parse(niemTemplateJSON);
    expect(templateObj["ext:PassportExchange"]["nc:Passport"]["nc:PersonName"]["nc:PersonGivenName"]).toEqual("");
  });


  test("JSON Schema", () => {
    let schemaObj = JSON.parse(jsonSchema);
    expect(schemaObj.properties["ext:PassportExchange"].type).toEqual("object");
  })

});

describe("NIEM CrashDriver XML Conversions", () => {

  beforeAll( async() => {
    dataFolder = path.join(__dirname, "crashDriver/");

    // Read the sample XML message
    let xml = fs.readFileSync(dataFolder + "_crashDriver.xml", "utf-8");

    // Convert the XML to NIEM JSON
    let results = await niemXMLtoJSON(xml);

    originalJSON = results.originalJSON;
    niemJSON = results.niemJSON;
    niemTemplateJSON = results.niemTemplateJSON;
    jsonSchema = results.jsonSchema;

    // Save the results to JSON files
    saveFile("crashDriver.json", results.niemJSON);
    saveFile("crashDriver.original.json", results.originalJSON);
    saveFile("crashDriver.template.json", results.niemTemplateJSON);
    saveFile("crashDriver.schema.json", results.jsonSchema);

  });

  test("NIEM JSON", () => {
    let ntacJSON = fs.readFileSync(dataFolder + "_ntac-solution.json", "utf-8");
    expect(niemJSON).toEqual(ntacJSON);
  });


});

function saveFile(fileName, data, stringify=false) {
  let text = stringify ? JSON.stringify(data, null, 2) : data;
  fs.writeFileSync(dataFolder + fileName, text);
}
