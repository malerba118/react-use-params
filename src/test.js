import React from 'react'
import { useQueryParams, createSingleParamApp, getParamData, getHistory } from './testHelper'
import { mount } from 'enzyme'

const timeout = (n) => {
  return new Promise((resolve) => {
    setTimeout(resolve, n)
  })
}

const history = getHistory()

describe('useQueryParams', () => {

  beforeEach(() => {
    history.push({search: ''})
  })

  afterEach(() => {
    history.push({search: ''})
  })

  //################# NUMBERS #################
  describe('numbers', () => {

    it('setParams reflects in url immediately', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100,
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: prevParams.queryParam + 1
        })
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(100);
      app.find('#next-value-button').simulate('click')
      let updatedParamData = getParamData(app)
      await timeout(0)
      expect(updatedParamData.queryParam).toEqual(101);
      expect(history.location.search).toEqual('?queryParam=101');
    })

    it('invalid default value throws error', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: '100',
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: prevParams.queryParam + 1
        })
      });
      let errorCount = 0
      try {
        mount(<App/>)
      }
      catch (e) {
        errorCount = 1
      }
      expect(errorCount).toEqual(1)
    })

    it('setParams with invalid next value is a no-op', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100,
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: '101'
        })
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(100);
      app.find('#next-value-button').simulate('click')
      let updatedParamData = getParamData(app)
      await timeout(0)
      expect(updatedParamData.queryParam).toEqual(100);
      expect(history.location.search).toEqual('');
    })

    it('setParams with undefined results in defaultValue', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100,
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: undefined
        })
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(100);
      app.find('#next-value-button').simulate('click')
      let updatedParamData = getParamData(app)
      await timeout(0)
      expect(updatedParamData.queryParam).toEqual(100);
      expect(history.location.search).toEqual('');
    })

    it('setParams with null results in null', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100,
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: null
        })
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(100);
      app.find('#next-value-button').simulate('click')
      let updatedParamData = getParamData(app)
      await timeout(0)
      expect(updatedParamData.queryParam).toEqual(null);
      expect(history.location.search).toEqual('?queryParam');
    })

    it('url determines param values', async () => {
      history.push({search: '?queryParam=101'})
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(101);
    })

    it('invalid url results in default value', async () => {
      history.push({search: '?queryParam=aaa'})
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(100);
    })

    it('null in url is valid', async () => {
      history.push({search: '?queryParam'})
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'number',
        defaultValue: 100
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual(null);
    })
  })


  //################# STRINGS #################
  describe('strings', () => {
    it('setParams reflects in url immediately', async () => {
      let App = createSingleParamApp({
        name: 'queryParam',
        type: 'string',
        defaultValue: 'foo',
        nextValue: (prevParams) => ({
          ...prevParams,
          queryParam: 'bar'
        })
      });
      let app = mount(<App/>);
      let paramData = getParamData(app)
      expect(paramData.queryParam).toEqual('foo');
      app.find('#next-value-button').simulate('click')
      let updatedParamData = getParamData(app)
      await timeout(0)
      expect(updatedParamData.queryParam).toEqual('bar');
      expect(history.location.search).toEqual('?queryParam=bar');
    })
  })
})

//TODO: TEST SPECIAL CHARACTERS
