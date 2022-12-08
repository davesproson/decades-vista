
import 'bulma/css/bulma.min.css';

import Navbar  from './navbar'
import { ParameterTable } from './params'
import { Options } from './options'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ParameterTable />} />
        <Route path="/options" element={<Options />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
