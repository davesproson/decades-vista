
import 'bulma/css/bulma.min.css';

import Navbar  from './navbar'
import { ParameterTable } from './params'
import { Options } from './options'
import { Routes, Route } from 'react-router-dom'
import { Plot } from './plot';
import { useDispatchParameters } from './hooks'

const NBWrapped = (props) => {
  return (
    <>
      <Navbar />
      {props.component}
    </>
  )
}

function App() {

  useDispatchParameters()

  return (
    // Wrapped Navbar to avoid having to repeat it in every route. Sure there must
    // be a Router way to do this...
    <>
      <Routes>
        <Route path="/" element={<NBWrapped component={<ParameterTable />} />} />
        <Route path="/options" element={<NBWrapped component={<Options />} />} />
        <Route path="/plot" element={<Plot />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
