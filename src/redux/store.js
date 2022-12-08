import { configureStore } from '@reduxjs/toolkit'

import paramReducer from './parametersSlice'
import paramFilterReducer from './filterSlice'
import optionsReducer from './optionsSlice'


const store = configureStore({
  reducer: {
    params: paramReducer,
    paramfilter: paramFilterReducer,
    options: optionsReducer
  }
})

export default store