import { combineReducers, createStore } from 'redux'

import menu from './menu'
import loading from './loading'
import buttons from './buttons'
import regions from './regions'
import province from './province'

const reducers = combineReducers({
  menu,
  loading,
  buttons,
  regions,
  province,
})

export default createStore(reducers)
