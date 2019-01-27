import React from 'react'
import { createBrowserHistory as createHistory } from "history";
import createParamsHook from './createParamsHook'

let history = createHistory()

export const getHistory = () => history

export const useQueryParams = createParamsHook(history)

export const createSingleParamApp = ({
  name,
  type,
  defaultValue,
  nextValue
}) => {
  const App = props => {
    let params = useQueryParams([
      {
        name,
        defaultValue,
        type
      }
    ]);
    return (
      <div className="App">
        <div id="data" data-testid="data">{JSON.stringify(params.data)}</div>
        <button id="next-value-button" data-testid="next-value-button" onClick={(e) => params.setParams(nextValue)}>
          Next Value
        </button>
      </div>
    );
  };
  return App;
}

export const getParamData = (app) => {
  return JSON.parse(app.find('#data').text())
}
