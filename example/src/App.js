import React from "react";
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import history from './history'
import './App.css'
import useQueryParams from "./useQueryParams";
import { withSnackbar } from 'notistack';

const numberOptions = [
  {
    key: "setParams({number: 20})",
    value: 20,
    hint: 'This works because 20 is a valid number.'
  },
  {
    key: "setParams({number: 'foo'})",
    value: 'foo',
    hint: "This is a no-op because 'foo' is the wrong type."
  },
  {
    key: "setParams({number: null})",
    value: null,
    hint: "This works because all types are nullable."
  },
  {
    key: "setParams({number: false})",
    value: false,
    hint: "This is a no-op because false is the wrong type."
  },
  {
    key: "setParams({number: {bar: 1}})",
    value: {bar: 1},
    hint: "This is a no-op because {bar: 1} is the wrong type."
  },
  {
    key: "setParams({number: undefined})",
    value: undefined,
    hint: "This works and triggers the defaultValue."
  },
]

const booleanOptions = [
  {
    key: "setParams({boolean: 20})",
    value: 20,
    hint: 'This works because the value is coerced to a boolean.'
  },
  {
    key: "setParams({boolean: 'foo'})",
    value: 'foo',
    hint: 'This works because the value is coerced to a boolean.'
  },
  {
    key: "setParams({boolean: null})",
    value: null,
    hint: "This works because all types are nullable."
  },
  {
    key: "setParams({boolean: false})",
    value: false,
    hint: 'This works because the value is coerced to a boolean.'
  },
  {
    key: "setParams({boolean: {bar: 1}})",
    value: {bar: 1},
    hint: 'This works because the value is coerced to a boolean.'
  },
  {
    key: "setParams({boolean: undefined})",
    value: undefined,
    hint: "This works and triggers the defaultValue."
  },
]

const stringOptions = [
  {
    key: "setParams({string: 20})",
    value: 20,
    hint: "This is works because 20 is coerced into a string."
  },
  {
    key: "setParams({string: 'foo'})",
    value: 'foo',
    hint: "This is works because 'foo' is a string."
  },
  {
    key: "setParams({string: null})",
    value: null,
    hint: "This works because all types are nullable."
  },
  {
    key: "setParams({string: false})",
    value: false,
    hint: "This is works because false is coerced into a string."
  },
  {
    key: "setParams({string: [1, 2, 3]})",
    value: [1, 2, 3],
    hint: "This is works because [1, 2, 3] is coerced into a string."
  },
  {
    key: "setParams({string: undefined})",
    value: undefined,
    hint: "This works and triggers the defaultValue."
  },
]


const arrayOptions = [
  {
    key: "setParams({array: 20})",
    value: 20,
    hint: "This is a no-op because 20 is the wrong type."
  },
  {
    key: "setParams({array: 'foo'})",
    value: 'foo',
    hint: "This is a no-op because 'foo' is the wrong type."
  },
  {
    key: "setParams({array: null})",
    value: null,
    hint: "This works because all types are nullable."
  },
  {
    key: "setParams({array: false})",
    value: false,
    hint: "This is a no-op because false is the wrong type."
  },
  {
    key: "setParams({array: [1, 2, 3]})",
    value: [1, 2, 3],
    hint: 'This works because [1, 2, 3] is a valid array.'
  },
  {
    key: "setParams({array: undefined})",
    value: undefined,
    hint: "This works and triggers the defaultValue."
  },
]

const objectOptions = [
  {
    key: "setParams({object: 20})",
    value: 20,
    hint: "This is a no-op because 20 is the wrong type."
  },
  {
    key: "setParams({object: 'foo'})",
    value: 'foo',
    hint: "This is a no-op because 'foo' is the wrong type."
  },
  {
    key: "setParams({object: null})",
    value: null,
    hint: "This works because all types are nullable."
  },
  {
    key: "setParams({object: false})",
    value: false,
    hint: "This is a no-op because false is the wrong type."
  },
  {
    key: "setParams({object: [1, 2, 3]})",
    value: [1, 2, 3],
    hint: 'This works because [1, 2, 3] is a valid object.'
  },
  {
    key: "setParams({object: undefined})",
    value: undefined,
    hint: "This works and triggers the defaultValue."
  },
]


const App = props => {
  let {
    setParams,
    data,
    debounceTime,
    setDebounceTime,
    syncType,
    setSyncType
  } = useQueryParams([
    {
      name: "number",
      defaultValue: 10,
      type: "number"
    },
    {
      name: "boolean",
      defaultValue: true,
      type: "boolean"
    },
    {
      name: "string",
      defaultValue: 'baz',
      type: "string"
    },
    {
      name: "array",
      defaultValue: [],
      type: "array"
    },
    {
      name: "object",
      defaultValue: {default: 'object'},
      type: "object"
    }
  ]);
  return (
    <div className="App">
      <h1 style={{textAlign: 'center'}}>Query Params Hook</h1>
      <div className="controls">
        <FormControl className="dropdown">
          <InputLabel htmlFor="debounce-time">Debounce Time</InputLabel>
          <Select
            value={debounceTime}
            onChange={(e) => setDebounceTime(e.target.value)}
            inputProps={{
              name: 'debounce-time',
              id: 'debounce-time',
            }}
          >
            <MenuItem value={0}>
              0 ms
            </MenuItem>
            <MenuItem value={1000}>1000 ms</MenuItem>
            <MenuItem value={2000}>2000 ms</MenuItem>
            <MenuItem value={3000}>3000 ms</MenuItem>
          </Select>
        </FormControl>
        <FormControl className="dropdown">
          <InputLabel htmlFor="sync-type">Sync Type</InputLabel>
          <Select
            value={syncType}
            onChange={(e) => setSyncType(e.target.value)}
            inputProps={{
              name: 'sync-type',
              id: 'sync-type',
            }}
          >
            <MenuItem value={'push'}>
              push
            </MenuItem>
            <MenuItem value={'replace'}>replace</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="params-container">
        <div className="param-container">
          <h3>number: {String(data.number)}</h3>
          {numberOptions.map((option) => {
            return (
              <Button
                variant="outlined"
                key={option.key}
                onClick={() => {
                  setParams({number: option.value})
                  props.enqueueSnackbar(option.hint)
                }}
              >
                <span>{option.key}</span>
              </Button>
            )
          })}
          <Button variant="outlined" onClick={() => {
            history.push({search: '?number=99'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?number=99'})"}</span>
          </Button>
          <Button variant="outlined" onClick={() => {
            history.push({search: '?number=wrongtype'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?number=wrongtype'})"}</span>
          </Button>
        </div>
        <div className="param-container">
          <h3>boolean: {String(data.boolean)}</h3>
          {booleanOptions.map((option) => {
            return (
              <Button
                variant="outlined"
                key={option.key}
                onClick={() => {
                  setParams({boolean: option.value})
                  props.enqueueSnackbar(option.hint)
                }}
              >
                <span>{option.key}</span>
              </Button>
            )
          })}
          <Button variant="outlined" onClick={() => {
            history.push({search: '?boolean=true'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?boolean=true'})"}</span>
          </Button>
          <Button variant="outlined" onClick={() => {
            history.push({search: '?boolean=wrongtype'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?boolean=wrongtype'})"}</span>
          </Button>
        </div>
        <div className="param-container">
          <h3>array: {JSON.stringify(data.array)}</h3>
          {arrayOptions.map((option) => {
            return (
              <Button
                variant="outlined"
                key={option.key}
                onClick={() => {
                  setParams({array: option.value})
                  props.enqueueSnackbar(option.hint)
                }}
              >
                <span>{option.key}</span>
              </Button>
            )
          })}
          <Button variant="outlined" onClick={() => {
            history.push({search: '?array=[1,2]'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?array=[1,2]'})"}</span>
          </Button>
          <Button variant="outlined" onClick={() => {
            history.push({search: '?array=wrongtype'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?array=wrongtype'})"}</span>
          </Button>
        </div>
        <div className="param-container">
          <h3>string: {JSON.stringify(data.string)}</h3>
          {stringOptions.map((option) => {
            return (
              <Button
                variant="outlined"
                key={option.key}
                onClick={() => {
                  setParams({string: option.value})
                  props.enqueueSnackbar(option.hint)
                }}
              >
                <span>{option.key}</span>
              </Button>
            )
          })}
          <Button variant="outlined" onClick={() => {
            history.push({search: '?string=bar'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?string=bar'})"}</span>
          </Button>
        </div>
        <div className="param-container">
          <h3>object: {JSON.stringify(data.object)}</h3>
          {objectOptions.map((option) => {
            return (
              <Button
                variant="outlined"
                key={option.key}
                onClick={() => {
                  setParams({object: option.value})
                  props.enqueueSnackbar(option.hint)
                }}
              >
                <span>{option.key}</span>
              </Button>
            )
          })}
          <Button variant="outlined" onClick={() => {
            history.push({search: '?object={"options": 0}'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{`history.push({search: '?object={"options": 0}'})`}</span>
          </Button>
          <Button variant="outlined" onClick={() => {
            history.push({search: '?object=wrongtype'})
            props.enqueueSnackbar('URL updates trigger a react state update immediately')
          }}>
            <span>{"history.push({search: '?object=wrongtype'})"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withSnackbar(App);
