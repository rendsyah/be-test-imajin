import { ZodSchema, ZodTypeDef } from 'zod';
import { ZodDto, zodToOpenAPI } from 'nestjs-zod';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// Helper to check if the input is a SchemaObject and not a $ref
const isSchemaObject = (input: SchemaObject | ReferenceObject): input is SchemaObject => {
  return !('$ref' in input);
};

// Recursively mark required properties in the OpenAPI schema
const updateRequiredProperties = (
  properties?: SchemaObject['properties'],
  required?: SchemaObject['required'],
): SchemaObject['properties'] | undefined => {
  if (!properties) return properties;

  const requiredArray = Array.isArray(required) ? required : [];

  Object.entries(properties).forEach(([key, value]) => {
    if (isSchemaObject(value)) {
      if (value.type === 'object') {
        updateRequiredProperties(value.properties, value.required);
      }
      Object.assign(value, { required: requiredArray.includes(key) });
    }
  });

  return properties;
};

// Main function to create a custom Zod-based DTO
export const createZodCustomDto = <
  TOutput = unknown,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(
  schema: ZodSchema<TOutput, TDef, TInput>,
) => {
  // Generate the final DTO class with OpenAPI metadata and Zod validation
  class AugmentedZodDto {
    static isZodDto = true;
    static schema = schema;

    // Used by Swagger to generate OpenAPI documentation
    static _OPENAPI_METADATA_FACTORY(): Record<string, unknown> | undefined {
      const schemaObject = zodToOpenAPI(this.schema);

      schemaObject.properties = {
        ...schemaObject.properties,
      };

      schemaObject.required = [...(schemaObject.required ?? [])];

      updateRequiredProperties(schemaObject.properties, schemaObject.required);
      return schemaObject.properties;
    }

    // Validate and parse input using the original Zod schema
    static create(input: TInput) {
      return this.schema.parse(input);
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
};
