import React, { Component } from "react";
import Slider from "@material-ui/lab/Slider";
import history from './history'

import useQueryParams from "./useQueryParams";

import { Route, Link, Switch, Redirect } from "react-router-dom";

const App = props => {
  let params = useQueryParams([
    {
      name: "page",
      defaultValue: 0,
      type: "number"
    },
    {
      name: "slider",
      defaultValue: 0,
      type: "number"
    },
    {
      name: "hideTitle",
      defaultValue: false,
      type: "boolean"
    },
    {
      name: "list",
      defaultValue: ["foo"],
      type: "array"
    }
  ]);
  return (
    <div className="App">
      <h1 hidden={params.data.hideTitle}>Query Params Hook</h1>
      <button
        onClick={() => {
          params.setParams(prev => ({
            hideTitle: !prev.hideTitle
          }));
        }}
      >
        Toggle Title
      </button>
      <div>
        <button
          onClick={() => {
            params.setParams(prev => ({
              page: Math.max(prev.page - 1, 1)
            }));
          }}
        >
          Prev Page
        </button>
        <button
          onClick={() => {
            params.setParams(prev => ({
              page: prev.page + 1
            }));
          }}
        >
          Next Page
        </button>
        <button
          onClick={() => {
            history.push({search: '?page=25'})
          }}
        >
          Push Page to History
        </button>
      </div>
      <div>
        <Slider
          value={params.data.slider}
          aria-labelledby="label"
          onChange={(e, v) => params.setParams({ slider: v })}
        />
      </div>
      <button
        onClick={() => {
          params.setParams(prev => ({
            list: [...prev.list, "foo"]
          }));
        }}
      >
        Add Item
      </button>
      <div>Page {params.data.page}</div>
      <div>Per Page {params.data.perPage}</div>
      <div>List {params.data.list}</div>
    </div>
  );
};

export default App;
