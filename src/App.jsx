import 'bulma/css/bulma.min.css';

import { lazy, Suspense } from 'react';
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
import  { View } from './views'

function App() {

  useDispatchParameters()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />} >
          <Route path="/" element={<Suspense><ParameterTable /></Suspense>} />
          <Route path="/options" element={<Suspense><Options /></Suspense>} />
          <Route path="/timeframe" element={<Suspense><TimeframeSelector /></Suspense>} />
          <Route path="/config-view" element={<Suspense><ViewConfig /></Suspense>} />
        </Route>
        <Route path="/view" element={<View />} />
        <Route path="/plot" element={<Suspense><Plot /></Suspense>} />
        <Route path="/dashboard" element={<Suspense><Dashboard /></Suspense>} />
        <Route path="/tephigram" element={<Suspense><Tephigram /></Suspense>} />
        
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  )
}

export default App
