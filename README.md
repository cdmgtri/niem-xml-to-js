
# NIEM XML to JSON

[![Build Status](https://github.com/cdmgtri/niem-xml-to-json/workflows/build/badge.svg?branch=dev)](https://github.com/cdmgtri/niem-xml-to-json/actions)
[![Coverage Status](https://coveralls.io/repos/github/cdmgtri/niem-xml-to-json/badge.svg?branch=dev)](https://coveralls.io/github/cdmgtri/niem-xml-to-json?branch=dev)

Build the JSON representation of a NIEM IEPD from a sample XML instance.  This allows developers to use NIEM XML-only tools like the [SSGT](https://tools.niem.gov/niemtools/ssgt/index.iepd) (generate NIEM subsets) and [ConTesA](https://tools.niem.gov/contesa/) (check NDR conformance) to model an exchange without later having to model the JSON representation manually.

See the current guidance on [NIEM JSON](http://niem.github.io/json) for more information on the JSON representation of an IEPD.

- [NIEM Transformations](#niem-transformations)
- [Installation](#installation)
- [Usage](#usage)
- [Results](#results)
- [Examples](#examples)
  - [Sample XML input](#sample-xml-input)
  - [Output: Sample NIEM JSON](#output-sample-niem-json)
  - [Output: NIEM JSON Template](#output-niem-json-template)
  - [Output: JSON Schema](#output-json-schema)
- [JSON-LD syntax references](#json-ld-syntax-references)

## NIEM Transformations

- [x] Convert a XML instance to JSON using the [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) library with the following options:
  - [x] convert number strings to numbers
  - [x] convert "true" and "false" strings to booleans
  - [x] create arrays only when multiple values are provided in an instance
  - [x] use `rdf:value` as the name of the value key for an XML element with both a value and attributes
- [x] Namespace declarations
  - [x] Move root-level XML namespace prefix declarations to a new `@context` property
  - [x] Add a `#` to the end of target namespaces if not already present
  - [x] Add the `rdf` namespace to the `@context` property
- [x] Move augmentation properties from augmentation containers to the parent objects
- [x] Convert `structures:id`, `structures:ref` and `structures:uri` XML attributes to `@id`
- [x] Drop XML-specific `xsi:nil` attributes
- [x] Enable `structures:metadata` references, if applicable
  - [x] convert `structures:metadata` space-delimited string to array of values
  - [x] define `structures:metadata` type in `@context` as `@id` so values are treated as references, not strings




## Installation

```sh
npm i cdmgtri/niem-xml-to-json
```

## Usage

```js
let fs = require("fs");
let niemXMLtoJSON = require("niem-xml2json");

let xml = fs.readFileSync(xmlFilePath, "utf-8");

// Option 1:
let results = await niemXMLtoJSON(xml);

// Option 2: Destructure and assign what you need from the results
let {niemJSON, niemTemplateJSON, jsonSchema} = await niemXMLtoJSON(xml);
```

## Results

Given a sample NIEM XML instance, the utility returns an object containing the following properties:

Return object | Description
------------- | -----------
niemJSON | NIEM XML to NIEM JSON
niemTemplateJSON | NIEM JSON, with values converted to empty strings for use as a template
jsonSchema | JSON schema generated from the NIEM JSON representation

## Examples

See the [test](./test) folder for more.

### Sample XML input

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ext:PassportExchange
  xmlns:ext="http://example.com/exchanges/passport-exchange/extension/1.0"
  xmlns:nc="http://release.niem.gov/niem/niem-core/4.0/"
  xmlns:j="http://release.niem.gov/niem/domains/jxdm/6.1/"
  xmlns:structures="http://release.niem.gov/niem/structures/4.0/">

  <nc:Passport structures:metadata="m1 m2">
    <nc:DocumentEffectiveDate>
      <nc:Date structures:id="d1">2010-05-16</nc:Date>
    </nc:DocumentEffectiveDate>
    <nc:DocumentExpirationDate>
      <nc:Date>2020-05-15</nc:Date>
    </nc:DocumentExpirationDate>
    <nc:PassportNumberIdentification>
      <nc:IdentificationID>C00001549</nc:IdentificationID>
    </nc:PassportNumberIdentification>
    <nc:PersonName>
      <nc:PersonGivenName>George</nc:PersonGivenName>
      <nc:PersonMiddleName>P</nc:PersonMiddleName>
      <nc:PersonMiddleName>Q</nc:PersonMiddleName>
      <nc:PersonSurName>Burdell</nc:PersonSurName>
    </nc:PersonName>
    <nc:PersonBirthDate>
      <nc:Date>1970-01-01</nc:Date>
    </nc:PersonBirthDate>
    <nc:PersonBirthLocation>
      <nc:Address>
        <nc:LocationState>
          <nc:StateISO3166Code>US-NY</nc:StateISO3166Code>
        </nc:LocationState>
        <nc:LocationCountry>
          <nc:LocationCountryISO3166Alpha3Code>USA</nc:LocationCountryISO3166Alpha3Code>
        </nc:LocationCountry>
      </nc:Address>
    </nc:PersonBirthLocation>
    <nc:PassportCategoryCode>Individual</nc:PassportCategoryCode>
    <ext:PersonCitizenshipISO3166Alpha3Code>USA</ext:PersonCitizenshipISO3166Alpha3Code>
    <nc:PassportIssuingOrganization>
      <nc:OrganizationName>United States Department of State</nc:OrganizationName>
    </nc:PassportIssuingOrganization>
    <j:PersonSexCode>M</j:PersonSexCode>
    <ext:PassportAugmentation>
      <ext:PassportMinorIndicator>false</ext:PassportMinorIndicator>
      <ext:PassportExpeditedIndicator>false</ext:PassportExpeditedIndicator>
      <ext:PassportRenewalIndicator>true</ext:PassportRenewalIndicator>
    </ext:PassportAugmentation>
  </nc:Passport>

  <nc:Metadata structures:id="m1">
    <nc:ReportedDate>
      <nc:Date>2010-05-15</nc:Date>
    </nc:ReportedDate>
    <nc:ReportingPersonText>Alice Smith</nc:ReportingPersonText>
  </nc:Metadata>

  <nc:Metadata structures:id="m2">
    <nc:ReportedDate>
      <nc:Date>2012-02-25</nc:Date>
    </nc:ReportedDate>
    <nc:ReportingPersonText>Bob Brooks</nc:ReportingPersonText>
  </nc:Metadata>
</ext:PassportExchange>
```

### Output: Sample NIEM JSON

```json
{
  "@context": {
    "ext": "http://example.com/exchanges/passport-exchange/extension/1.0#",
    "nc": "http://release.niem.gov/niem/niem-core/4.0/#",
    "j": "http://release.niem.gov/niem/domains/jxdm/6.1/#",
    "structures": "http://release.niem.gov/niem/structures/4.0/#",
    "structures:metadata": {
      "@type": "@id"
    },
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  },
  "ext:PassportExchange": {
    "nc:Passport": {
      "structures:metadata": [
        "m1",
        "m2"
      ],
      "nc:DocumentEffectiveDate": {
        "nc:Date": {
          "rdf:value": "2010-05-16",
          "@id": "d1"
        }
      },
      "nc:DocumentExpirationDate": {
        "nc:Date": "2020-05-15"
      },
      "nc:PassportNumberIdentification": {
        "nc:IdentificationID": "C00001549"
      },
      "nc:PersonName": {
        "nc:PersonGivenName": "George",
        "nc:PersonMiddleName": [
          "P",
          "Q"
        ],
        "nc:PersonSurName": "Burdell"
      },
      "nc:PersonBirthDate": {
        "nc:Date": "1970-01-01"
      },
      "nc:PersonBirthLocation": {
        "nc:Address": {
          "nc:LocationState": {
            "nc:StateISO3166Code": "US-NY"
          },
          "nc:LocationCountry": {
            "nc:LocationCountryISO3166Alpha3Code": "USA"
          }
        }
      },
      "nc:PassportCategoryCode": "Individual",
      "ext:PersonCitizenshipISO3166Alpha3Code": "USA",
      "nc:PassportIssuingOrganization": {
        "nc:OrganizationName": "United States Department of State"
      },
      "j:PersonSexCode": "M",
      "ext:PassportMinorIndicator": false,
      "ext:PassportExpeditedIndicator": false,
      "ext:PassportRenewalIndicator": true
    },
    "nc:Metadata": [
      {
        "@id": "m1",
        "nc:ReportedDate": {
          "nc:Date": "2010-05-15"
        },
        "nc:ReportingPersonText": "Alice Smith"
      },
      {
        "@id": "m2",
        "nc:ReportedDate": {
          "nc:Date": "2012-02-25"
        },
        "nc:ReportingPersonText": "Bob Brooks"
      }
    ]
  }
}
```

### Output: NIEM JSON Template

```json
{
  "@context": {
    "ext": "",
    "nc": "",
    "j": "",
    "structures": "",
    "structures:metadata": {
      "@type": "@id"
    },
    "rdf": ""
  },
  "ext:PassportExchange": {
    "nc:Passport": {
      "structures:metadata": [
        ""
      ],
      "nc:DocumentEffectiveDate": {
        "nc:Date": {
          "rdf:value": "",
          "@id": ""
        }
      },
      "nc:DocumentExpirationDate": {
        "nc:Date": ""
      },
      "nc:PassportNumberIdentification": {
        "nc:IdentificationID": ""
      },
      "nc:PersonName": {
        "nc:PersonGivenName": "",
        "nc:PersonMiddleName": [
          "",
          ""
        ],
        "nc:PersonSurName": ""
      },
      "nc:PersonBirthDate": {
        "nc:Date": ""
      },
      "nc:PersonBirthLocation": {
        "nc:Address": {
          "nc:LocationState": {
            "nc:StateISO3166Code": ""
          },
          "nc:LocationCountry": {
            "nc:LocationCountryISO3166Alpha3Code": ""
          }
        }
      },
      "nc:PassportCategoryCode": "",
      "ext:PersonCitizenshipISO3166Alpha3Code": "",
      "nc:PassportIssuingOrganization": {
        "nc:OrganizationName": ""
      },
      "j:PersonSexCode": "",
      "ext:PassportMinorIndicator": false,
      "ext:PassportExpeditedIndicator": false,
      "ext:PassportRenewalIndicator": false
    },
    "nc:Metadata": [
      {
        "@id": "",
        "nc:ReportedDate": {
          "nc:Date": ""
        },
        "nc:ReportingPersonText": ""
      },
      {
        "@id": "",
        "nc:ReportedDate": {
          "nc:Date": ""
        },
        "nc:ReportingPersonText": ""
      }
    ]
  }
}
```

### Output: JSON Schema

See [example Passport exchange JSON schema](./test/passport/passport.schema.json) for a sample JSON schema.

## JSON-LD syntax references

See the references below for other ideas for the NIEM JSON representation:

- Default namespace prefix using @context/@vocab
  - https://w3c.github.io/json-ld-syntax/#default-vocabulary
- Other references
  - https://www.w3.org/TR/json-ld/#sets-and-lists
  - https://stackoverflow.com/questions/52877462/how-to-enforce-an-array-on-type-in-jsonld
  - https://w3c.github.io/json-ld-syntax/#typed-values
  - https://w3c.github.io/json-ld-syntax/#embedding
