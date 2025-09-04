import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Shield,
    Dumbbell,
    Trophy,
    ArrowRight,
    MessageCircle,
    AlertCircle
} from 'lucide-react';
import { WhatsAppIcon, WhatsAppButton, getWhatsAppLink } from '../components/WhatsAppContact';
import fotoPerfil from '../assets/parado.jpeg';
import '../styles/styles.css'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const API_BASE = import.meta.env.VITE_BACKEND;
    // Usar el contexto de autenticación
    const { login } = useAuth();

    const whatsappLink = getWhatsAppLink("Hola Eliseo! Me gustaría obtener acceso a la plataforma de entrenamiento. ¿Podrías ayudarme con mis credenciales?");

    // Función para decodificar JWT (básico, sin verificar firma)
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decodificando JWT:', error);
            return null;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error cuando el usuario comience a escribir
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validaciones básicas
        if (!formData.email.trim() || !formData.password.trim()) {
            setError('Por favor completa todos los campos');
            setIsLoading(false);
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Por favor ingresa un email válido');
            setIsLoading(false);
            return;
        }

        try {

            const response = await fetch(`${API_BASE}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                console.log('Login exitoso:', data);

                // Usar el método login del contexto
                login(data.access_token);

                // Login exitoso - redirigir sin alert

                // Redirigir a /home
                window.location.href = '/home';

            } else {
                // Error de autenticación
                console.error('Error de login:', data);
                setError(data.detail || 'Credenciales inválidas');
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            setError('Error de conexión. Por favor intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-vh-100">
            {/* Hero Login Section */}
            <section className="hero-executive text-white py-6 min-vh-100 d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center align-items-center min-vh-75">
                        <div className="col-lg-5 col-md-8 col-sm-10">
                            <div className="card border-0 rounded-4 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.95)'}}>
                                <div className="card-body p-4">
                                    {/* Header */}
                                    <div className="text-center mb-3">
                                        <div className="d-flex justify-content-center align-items-center mb-2">
                                            <img
                                                src={fotoPerfil}
                                                alt="Eliseo Lariguet"
                                                className="rounded-circle me-3"
                                                style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                            />
                                            <h2 className="fw-bold mb-0 text-dark fs-4">Eliseo Lariguet</h2>
                                        </div>
                                        <h3 className="fw-bold text-dark mb-1 fs-5">Acceso a la Plataforma</h3>
                                        <p className="text-muted mb-0 small">Ingresa a tu área de entrenamiento personalizada</p>
                                    </div>

                                    {/* Error Alert */}
                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                                            <AlertCircle className="w-4 h-4 me-2 flex-shrink-0" />
                                            <small>{error}</small>
                                        </div>
                                    )}

                                    {/* Login Form */}
                                    <div onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label fw-semibold text-dark small">
                                                Email
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type="email"
                                                    className="form-control ps-5 border-2"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="usuario@ejemplo.com"
                                                    style={{borderColor: '#E5E7EB'}}
                                                />
                                                <User className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-semibold text-dark small">
                                                Contraseña
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control ps-5 pe-5 border-2"
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Ingresa tu contraseña"
                                                    style={{borderColor: '#E5E7EB'}}
                                                />
                                                <Lock className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                                                <button
                                                    type="button"
                                                    className="btn border-0 position-absolute top-50 translate-middle-y end-0 me-3 p-0"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ?
                                                        <EyeOff className="w-4 h-4 text-muted" /> :
                                                        <Eye className="w-4 h-4 text-muted" />
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary-red w-100 mb-3"
                                            disabled={isLoading}
                                            onClick={handleSubmit}
                                        >
                                            {isLoading ? (
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                                        <span className="visually-hidden">Cargando...</span>
                                                    </div>
                                                    Ingresando...
                                                </div>
                                            ) : (
                                                <>
                                                    Ingresar a la Plataforma
                                                    <ArrowRight className="w-4 h-4 ms-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="text-center mb-3">
                                        <hr className="my-2" />
                                        <span className="text-muted small">¿No tienes acceso?</span>
                                    </div>

                                    {/* Contact Section */}
                                    <div className="text-center">
                                        <div className="bg-light rounded-3 p-3 mb-2">
                                            <div className="d-flex justify-content-center mb-2">
                                                <MessageCircle className="w-4 h-4 text-primary-red" />
                                            </div>
                                            <h6 className="fw-bold text-dark mb-1 small">¿Necesitas una cuenta?</h6>
                                            <p className="text-muted mb-2" style={{fontSize: '0.8rem'}}>
                                                Contacta con Eliseo para obtener tus credenciales.
                                            </p>
                                            <WhatsAppButton
                                                message="Hola Eliseo! Me gustaría obtener acceso a la plataforma de entrenamiento. ¿Podrías ayudarme con mis credenciales?"
                                                className="btn btn-outline-success btn-sm w-100"
                                                iconClassName="whatsapp-icon-sm me-1"
                                            >
                                                Contactar por WhatsApp
                                            </WhatsAppButton>
                                        </div>

                                        {/* Features - Hidden on mobile to save space */}
                                        <div className="row g-1 text-center d-none d-lg-flex">
                                            <div className="col-4">
                                                <div className="p-1">
                                                    <Shield className="w-4 h-4 text-danger mb-1" />
                                                    <div style={{fontSize: '0.7rem'}} className="text-muted">Defensa</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="p-1">
                                                    <Trophy className="w-4 h-4 text-danger mb-1" />
                                                    <div style={{fontSize: '0.7rem'}} className="text-muted">Karate</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="p-1">
                                                    <Dumbbell className="w-4 h-4 text-danger mb-1" />
                                                    <div style={{fontSize: '0.7rem'}} className="text-muted">Fitness</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="col-lg-6 offset-lg-1 d-none d-lg-block">
                            <div className="text-white">
                                <h1 className="display-4 fw-bold mb-4">
                                    Plataforma de Entrenamiento
                                    <span className="text-danger d-block">Personalizada</span>
                                </h1>

                                <p className="fs-5 text-white-50 mb-5">
                                    Accede a tu plan de entrenamiento diseñado específicamente por Eliseo Lariguet.
                                    Monitorea tu progreso, consulta tus rutinas y mantén comunicación directa con tu instructor.
                                </p>

                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-2">Planes Personalizados</h5>
                                                <p className="text-white-50 mb-0">Rutinas adaptadas a tu nivel y objetivos específicos</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-2">Seguimiento 24/7</h5>
                                                <p className="text-white-50 mb-0">Monitoreo continuo de tu progreso y evolución</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                                <Trophy className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-2">Instructor Certificado</h5>
                                                <p className="text-white-50 mb-0">Entrenamiento con cinturón negro en Karate Shorin Ryu</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                                <Dumbbell className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-2">Experiencia Comprobada</h5>
                                                <p className="text-white-50 mb-0">Más de 50 estudiantes transformados exitosamente</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="row g-4 text-center">
                                        <div className="col-4">
                                            <div className="display-5 fw-bold text-danger mb-1">50+</div>
                                            <div className="small text-white-50">Estudiantes Activos</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="display-5 fw-bold text-danger mb-1">100%</div>
                                            <div className="small text-white-50">Satisfacción</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="display-5 fw-bold text-danger mb-1">24/7</div>
                                            <div className="small text-white-50">Soporte</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp Floating Button */}
            <WhatsAppButton
                message="Hola Eliseo! Me gustaría obtener acceso a la plataforma de entrenamiento. ¿Podrías ayudarme con mis credenciales?"
                className="whatsapp-float"
                iconClassName="whatsapp-icon"
            />
        </div>
    );
};

export default Login;