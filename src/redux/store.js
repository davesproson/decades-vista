import { configureStore } from '@reduxjs/toolkit'

import paramReducer from './parametersSlice'
import paramFilterReducer from './filterSlice'
import optionsReducer from './optionsSlice'
import viewReducer from './viewSlice'
import tutorialReducer from './tutorialSlice'
import configReducer from './configSlice'

const store = configureStore({
  reducer: {
    vars: paramReducer,
    paramfilter: paramFilterReducer,
    options: optionsReducer,
    view: viewReducer,
    tutorial: tutorialReducer,
    config: configReducer
  }
})

export default store