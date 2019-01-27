import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import pick from "lodash/pick";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";
import debounce from "lodash/debounce";
import ParamSchema from "./ParamSchema";

export default (history) => (paramsSchema) => {
  const schema = new ParamSchema(paramsSchema);
  let [debounceTime, setDebounceTime] = useState(0);
  let [value, setValue] = useState(
    schema.parse(window.location.search, {
      includeExcess: false
    })
  );

  const syncQueryParams = useRef();

  useEffect(
    () => {
      syncQueryParams.current = debounce(value => {
        // Get all query params from url
        let allPrevParams = schema.parse(history.location.search, {
          includeExcess: true
        });

        let relevantPrevParams = schema.parse(history.location.search, {
          includeExcess: false
        });

        if (!isEqual(relevantPrevParams, value)) {
          history.push({
            search: schema.stringify(
              {
                ...allPrevParams,
                ...value
              },
              { includeExcess: true }
            )
          });
        }
      }, debounceTime);
    },
    [debounceTime]
  );

  useEffect(
    () => {
      syncQueryParams.current(value);
    },
    [value]
  );

  useEffect(() => {
    let unlisten = history.listen((location, a) => {
      let updatedParams = schema.parse(location.search, {
        includeExcess: false
      });
      setValue(value => ({
        ...value,
        ...updatedParams
      }));
    });
    return unlisten;
  }, []);

  return {
    data: value,
    setParams: params => {
      setValue(prevParams => {
        let relevantParams;
        if (typeof params === "function") {
          relevantParams = params(prevParams);
        } else {
          relevantParams = params;
        }
        return {
          ...prevParams,
          ...relevantParams
        };
      });
    }
  };
}
