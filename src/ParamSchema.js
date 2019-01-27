import React, { useState, useEffect } from "react";
import queryString from "query-string";
import pick from "lodash/pick";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";

function coerceAfterParse(schema, param) {
  let coercedParam;
  if (param === null) {
    coercedParam = null;
  } else if (schema.type === "number") {
    coercedParam = Number(param);
    if (Number.isNaN(coercedParam)) {
      throw new Error("Not a number");
    }
  } else if (schema.type === "boolean") {
    if (param === "false") {
      coercedParam = false;
    } else {
      coercedParam = !!param;
    }
  } else if (schema.type === "array") {
    coercedParam = JSON.parse(param);
  } else if (schema.type === "object") {
    coercedParam = JSON.parse(param);
  } else {
    coercedParam = param;
  }
  return coercedParam;
}

function coerceBeforeStringify(schema, param) {
  let coercedParam = param;
  if (schema.type === "array" || schema.type === "object") {
    coercedParam = JSON.stringify(param);
  }
  return coercedParam;
}

class ParamSchema {
  constructor(schemas) {
    this.validateSchemas(schemas);
    this.schemas = schemas;
  }

  validateSchemas = schemas => {
    let errors = schemas.map(schema => {
      if (typeof schema.defaultValue === schema.type) {
        return;
      } else {
        if (schema.type === "array") {
          if (Array.isArray(schema.defaultValue)) {
            return;
          }
        }
        if (schema.defaultValue === null || schema.defaultValue === undefined) {
          return;
        }
        return `defaultValue for ${schema.name} does not match type`;
      }
    });
    errors = errors.filter(e => !!e);
    if (errors.length) {
      throw new Error(errors);
    }
  };

  processAfterParse = (schema, param) => {
    try {
      param = coerceAfterParse(schema, param);
      param = param === undefined ? schema.defaultValue : param;
    } catch (e) {
      param = schema.defaultValue;
    }
    return param;
  };

  processParamBeforeStringify = (schema, param) => {
    return coerceBeforeStringify(schema, param);
  };

  parse = (queryStr, { includeExcess = false } = {}) => {
    let rawParams = queryString.parse(queryStr);
    let processedParams = {};
    this.schemas.forEach(schema => {
      let key = schema.name;
      processedParams[key] = this.processAfterParse(schema, rawParams[key]);
    });
    if (includeExcess) {
      return {
        ...rawParams,
        ...processedParams
      };
    }
    return processedParams;
  };

  stringify = (rawParams, { includeExcess = false } = {}) => {
    let processedParams = {};
    this.schemas.forEach(schema => {
      let key = schema.name;
      processedParams[key] = this.processParamBeforeStringify(
        schema,
        rawParams[key]
      );
    });
    if (includeExcess) {
      return queryString.stringify({
        ...rawParams,
        ...processedParams
      });
    }
    return queryString.stringify(processedParams);
  };
}

export default ParamSchema;
