
import 'bulma/css/bulma.min.css';

import Navbar  from './navbar'
import { ParameterTable } from './params'
import { Options } from './options'
import { Routes, Route } from 'react-router-dom'
import { Plot } from './plot';
import { useDispatchParameters } from './hooks'
import { Dashboard } from './dashboard'
import { Tephigram } from './tephi';
import TimeframeSelector from './timeframe';
import ViewConfig from './views';

function App() {

  useDispatchParameters()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />} >
          <Route path="/" element={<ParameterTable />} />
          <Route path="/options" element={<Options />} />
          <Route path="/timeframe" element={<TimeframeSelector />} />
          <Route path="/config-view" element={<ViewConfig />} />
        </Route>
        <Route path="/plot" element={<Plot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tephigram" element={<Tephigram />} />
        
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
