
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

const NBWrapped = (props) => {
  return (
    <>
      <Navbar />
      <props.component />
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
        <Route path="/" element={<NBWrapped component={ParameterTable} />} />
        <Route path="/options" element={<NBWrapped component={Options} />} />
        <Route path="/plot" element={<Plot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tephigram" element={<Tephigram />} />
        <Route path="/timeframe" element={<NBWrapped component={TimeframeSelector} />} />
        <Route path="/config-view" element={<NBWrapped component={ViewConfig} />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
