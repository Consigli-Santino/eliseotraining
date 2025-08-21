import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import LandingPage from "./pages/LandingPage.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"
import ProtectedRoute from './protectedroute/ProtectedRoute.jsx'
import AppLayout from './pages/Layout/AppLayout'
import Unauthorized from "./pages/Unauthorized.jsx"
import UsersCrud from "./pages/admin/Users.jsx";
import CategoriesCrud from "./pages/admin/Categorias.jsx";
import ExercisesCrud from "./pages/admin/Ejercicios.jsx";
import PlanesCrud from "./pages/admin/PlanesCrud.jsx";
import PlanViewer from "./pages/planviewer/PlanViewer.jsx";
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
                            <Route path="/users" element={
                                <ProtectedRoute path="/users">
                                    <UsersCrud/>
                                </ProtectedRoute>
                            } />
                        <Route path="/categories" element={
                            <ProtectedRoute path="/categories">
                                <CategoriesCrud/>
                            </ProtectedRoute>
                        } />
                        <Route path="/exercises" element={
                            <ProtectedRoute path="/exercises">
                                <ExercisesCrud/>
                            </ProtectedRoute>
                        } />
                        <Route path="/planes" element={
                            <ProtectedRoute path="/planes">
                                <PlanesCrud/>
                            </ProtectedRoute>
                        } />
                        <Route path="/miplan" element={
                            <ProtectedRoute path="/miplan">
                                <PlanViewer/>
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App