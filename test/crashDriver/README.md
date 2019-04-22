
# Crash Driver example

This example is based on the [Non-Normative Guidance in Using NIEM with JSON](http://niem.github.io/json/reference/guidance/), provided by the NIEM Technical Architecture Committee (NTAC).  The guidance provides step-by-step instructions on how an XML instance can be converted to JSON.

The following examples are available at in the appendix of the guidance:

- [Full example: XML instance document](http://niem.github.io/json/reference/guidance/#full-example-xml)
- [Full example: JSON data](http://niem.github.io/json/reference/guidance/#full-example-json)

## Changes to the NTAC solution

For project testing, the XML example was used as the input.  In order to be able to use the JSON example as the reference solution for comparison against the generated JSON, the following changes were made to the NTAC's JSON example:

- XML attribute `gml:id` was not converted to JSON key `@id`.
  - Without the schema or other documentation, it cannot be determined if this attribute has type `xs:ID` (should be converted to `@id`) or is just a string (should not be converted).
- Local `@context` property was not added to `geo:LocationGeospatialPoint`.
  - There are different ways to represent external content, the solution provided is only one possibility.
  - Note:  See [JSON-LD's Default Vocabulary](https://w3c.github.io/json-ld-syntax/#default-vocabulary) section for another way to define default namespaces (`@vocab` property in `@context`).
- Bug fix:
  - Property `nc:LengthUnitCode` has been moved under `nc:ItemLengthMeasure`, matching the XML example and the NIEM 3.1 release.
- Metadata representation
  - An alternative to the NTAC recommendation has been implemented (see the main README).  The expected JSON solution has been adjusted for these changes.
