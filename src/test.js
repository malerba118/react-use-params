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

  describe('numbers', () => {
    it('updates reflect in url immediately', async () => {
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
  })

  describe('strings', () => {
    it('updates reflect in url immediately', async () => {
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
