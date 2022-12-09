
import 'bulma/css/bulma.min.css';

import Navbar  from './navbar'
import { ParameterTable } from './params'
import { Options } from './options'
import { Routes, Route } from 'react-router-dom'

const NBWrapped = (props) => {
  return (
    <>
      <Navbar />
      {props.component}
    </>
  )
}

function App() {

  return (
    // Wrapped Navbar to avoid having to repeat it in every route. Sure there must
    // be a Router way to do this...
    <>
      <Routes>
        <Route path="/" element={<NBWrapped component={<ParameterTable />} />} />
        <Route path="/options" element={<NBWrapped component={<Options />} />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
