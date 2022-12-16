import 'bulma/css/bulma.min.css';

import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom'

import { useDispatchParameters } from './hooks'

const Navbar = lazy(() => import('./navbar'))
const TimeframeSelector = lazy(() => import('./timeframe'))
const ViewConfig = lazy(() => import('./views'))
const Tephigram = lazy(() => import('./tephi'))
const Dashboard = lazy(() => import('./dashboard'))
const Plot = lazy(() => import('./plot'))
const Options = lazy(() => import('./options'))
const ParameterTable = lazy(() => import('./params'))

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
