
import './App.css'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import LandingPage from "./pages/LandingPage.jsx";
function App() {


  return (
      <BrowserRouter>
          <Routes>

          <Route path="/landing" element={<LandingPage />}>
          </Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
