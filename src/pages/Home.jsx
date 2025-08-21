import React from 'react';
import {
    Home as HomeIcon,
    Calendar,
    Users,
    Trophy,
    Target,
    Clock
} from 'lucide-react';
import '../styles/styles.css';
import {useNavigate} from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    return (
        <div className="bg-white min-vh-100">

            {/* Quick Actions */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-3">
                        <h2 className="display-5 fw-bold mb-3">
                            Accesos <span className="text-danger">Rápidos</span>
                        </h2>
                        <p className="fs-5 text-muted">
                            Navega fácilmente por las funciones principales
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card border-0 rounded-4 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-primary-red rounded-3 p-3 me-3 flex-shrink-0">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-2">Ver Mi Plan</h5>
                                            <p className="text-muted mb-3">
                                                Revisa tu rutina de entrenamiento personalizada, ejercicios y progreso semanal.
                                            </p>
                                            <button className="btn btn-outline-red" onClick={() => navigate('/miplan')}>
                                                Ir a Mi Plan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card border-0 rounded-4 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-primary-red rounded-3 p-3 me-3 flex-shrink-0">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-2">Contactar Entrenador</h5>
                                            <p className="text-muted mb-3">
                                                Comunícate directamente con Eliseo para consultas, ajustes o comentarios.
                                            </p>
                                            <button className="btn btn-outline-red">
                                                Enviar Mensaje
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Message */}
            <section className="py-4 text-center bg-light">
                <div className="container">
                    <p className="text-muted mb-0">
                        <strong>Eliseo Lariguet</strong> - Tu entrenador personal certificado
                    </p>
                    <small className="text-muted">
                        ¿Necesitas ayuda? Utiliza el menú de navegación o contacta directamente.
                    </small>
                </div>
            </section>
        </div>
    );
};

export default Home;