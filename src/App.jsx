import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import LandingPage from "./pages/LandingPage.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx'
import AppLayout from './pages/Layout/AppLayout.jsx'
import Unauthorized from "./pages/Unauthorized.jsx"

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas (sin layout/navbar) */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Rutas protegidas con Layout (con navbar/sidebar) */}
                    <Route element={<AppLayout />}>
                        <Route path="/home" element={
                            <ProtectedRoute path="/home">
                                <Home />
                            </ProtectedRoute>
                        } />

                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App