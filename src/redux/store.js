import { configureStore } from '@reduxjs/toolkit'

import paramReducer from './parametersSlice'
import paramFilterReducer from './filterSlice'
import optionsReducer from './optionsSlice'
import viewReducer from './viewSlice'
import tutorialReducer from './tutorialSlice'

const store = configureStore({
  reducer: {
    vars: paramReducer,
    paramfilter: paramFilterReducer,
    options: optionsReducer,
    view: viewReducer,
    tutorial: tutorialReducer
  }
})

export default store