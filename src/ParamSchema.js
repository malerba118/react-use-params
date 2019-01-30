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
    if (param === undefined) {
      return undefined
    }
    else if (param === "false" || param === "0" || param === "NaN") {
      // handle falsey values
      coercedParam = false;
    }
    else {
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
    coercedParam = param === null ? null : JSON.stringify(param);
  }
  return coercedParam;
}

class ParamSchema {
  constructor(schemas) {
    this.schemas = schemas;
    this._validateSchemas();
  }

  _validateSchemas = () => {
    let validations = this.validateParams(this.getDefaultParams())
    let errors = []
    Object.keys(validations).forEach((paramName) => {
      if (validations[paramName] === false) {
        errors.push(`defaultValue for ${paramName} is disallowed due to type`)
      }
    })
    if (errors.length) {
      throw new Error(errors);
    }
  };

  getDefaultParams = () => {
    return this.schemas.reduce(
      (map, s) => {
        return {
          ...map,
          [s.name]: s.defaultValue
        }
      },
      {}
    );
  }

  getSchemaByName = (name) => {
    return this.schemas.filter((schema) => schema.name === name)[0] || null
  }

  _getType = (param) => {
    if (Array.isArray(param)) {
      return 'array'
    }
    return typeof param
  }

  // Validate a params object.
  // Returns map indicating for each param, whether it is valid or not.
  validateParams = (params) => {
    let validMap = {}
    Object.keys(params).forEach((paramName) => {
      let schema = this.getSchemaByName(paramName)
      if (!schema) {
        //if there's no schema for it, it's invalid
        validMap[paramName] = false
      }
      else {
        validMap[paramName] = this.validateParam(schema, params[paramName])
      }
    })
    return validMap
  }

  validateParam = (schema, param) => {
    if (
      param === null ||
      param === undefined ||
      schema.type === 'boolean' ||
      schema.type === 'string'
    ) {
      return true
    }
    return this._getType(param) === schema.type
  }

  applyDefaultsToParams = (params) => {
    let paramsWithDefaults = {...params}
    Object.keys(params).forEach((paramName) => {
      let schema = this.getSchemaByName(paramName)
      if (schema) {
        if (paramsWithDefaults[paramName] === undefined) {
          paramsWithDefaults[paramName] = schema.defaultValue
        }
      }
    })
    return paramsWithDefaults
  }

  coerceParams = (params) => {
    let coercedParams = {...params}
    Object.keys(params).forEach((paramName) => {
      let schema = this.getSchemaByName(paramName)
      if (schema) {
        if (schema.type === 'boolean') {
          //coerce to nullable boolean
          coercedParams[paramName] = coercedParams[paramName] === null ? null : !!coercedParams[paramName]
        }
        else if (schema.type === 'string') {
          //coerce to nullable string
          coercedParams[paramName] = coercedParams[paramName] === null ? null : String(coercedParams[paramName])
        }
      }
    })
    return coercedParams
  }

  transformParams = (params) => {
    let transformedParams = {...params}
    Object.keys(params).forEach((paramName) => {
      let schema = this.getSchemaByName(paramName)
      if (schema && (typeof schema.transform) === 'function') {
         transformedParams[paramName] = schema.transform(params[paramName])
      }
    })
    return transformedParams
  }

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
