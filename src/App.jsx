import 'bulma/css/bulma.min.css';

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'

const Navbar = lazy(() => import('./navbar'))
const TimeframeSelector = lazy(() => import('./timeframe'))
const ViewConfig = lazy(() => import('./views'))
const Tephigram = lazy(() => import('./tephi'))
const DashboardDispatcher = lazy(() => import('./dashboard'))
const PlotDispatcher = lazy(() => import('./plot'))
const Options = lazy(() => import('./options'))
const ParameterTable = lazy(() => import('./params'))
const View = lazy(() => import('./views'))

/**
 * The main app component. This is the entry point for the application, which
 * provides the routing for the application.
 * 
 * @component
 * @example
 * return (
 *  <App />
 * )
 */
const App = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navbar />} >
          <Route path="/" element={<Suspense><ParameterTable /></Suspense>} />
          <Route path="/options" element={<Suspense><Options /></Suspense>} />
          <Route path="/timeframe" element={<Suspense><TimeframeSelector /></Suspense>} />
          <Route path="/config-view" element={<Suspense><ViewConfig /></Suspense>} />
        </Route>
        <Route path="/view" element={<Suspense><View /></Suspense>} />
        <Route path="/plot" element={<Suspense><PlotDispatcher /></Suspense>} />
        <Route path="/dashboard" element={<Suspense><DashboardDispatcher /></Suspense>} />
        <Route path="/tephigram" element={<Suspense><Tephigram /></Suspense>} />

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </Suspense>
  )
}

export default App
