/**
 * DECADES Vista - a rubbish name for a rubbish app.
 *
 *  _________________________________________
 * / cHx8eHtCNzd1NoF3fXx9am02a3d1N39pfGtwR35 \
 * \ FXnlqc0FrTGA4dDg=                       /
 *  -----------------------------------------
 *         \   ^__^
 *          \  (xx)\_______
 *             (__)\       )\/\
 *              U  ||----w |
 *                 ||     ||
 * 
 *
 * This is designed to work with the 'new' (appreciate that this is a relative term,
 * perhaps 'rubbish' is better) DECADES. It can probably be made to work with the 
 * original DECADES code using some apiTransforms. 
 *
 * Am I going to do that? No.
 * 
 * Actually, I probably gave up on wrapping calls in the apiTransforms, so maybe that's
 * a lie. I don't know.
 */ 

import React from 'react'
import ReactDOM from 'react-dom/client'
import DecadesVista from './vista'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { base } from './settings'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={base}>
        <DecadesVista />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
