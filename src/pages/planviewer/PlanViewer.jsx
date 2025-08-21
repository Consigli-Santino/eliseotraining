import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Target,
    Clock,
    User,
    AlertCircle,
    CheckCircle,
    Trophy,
    Dumbbell,
    RotateCcw,
    Eye,
    ChevronRight,
    Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/styles.css';

const PlanViewer = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);

    const API_BASE = import.meta.env.VITE_BACKEND;

    // Utility function to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Load user's plan on component mount
    useEffect(() => {
        if (user?.id) {
            loadUserPlan();
        }
    }, [user]);

    const loadUserPlan = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get user's plans (should be only one active plan typically)
            const response = await fetch(`${API_BASE}/planes/mis-planes`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Error al cargar tu plan de entrenamiento');
            }

            const plans = await response.json();

            if (plans.length === 0) {
                setError('No tienes un plan de entrenamiento asignado. Contacta con tu entrenador.');
                setPlan(null);
            } else {
                // Take the most recent plan (first one)
                setPlan(plans[0]);
                setSelectedDay(0); // Select first day by default
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTotalExercises = () => {
        if (!plan?.dias_plan) return 0;
        return plan.dias_plan.reduce((total, dia) => total + (dia.detalle_ejercicios?.length || 0), 0);
    };

    const whatsappLink = "https://wa.me/5493517503115?text=Hola%20Eliseo!%20Tengo%20una%20consulta%20sobre%20mi%20plan%20de%20entrenamiento.";

    if (loading) {
        return (
            <div className="bg-white min-vh-100 d-flex align-items-center justify-content-center" style={{paddingTop: '76px'}}>
                <div className="text-center">
                    <div className="spinner-border text-danger mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <h5 className="text-muted">Cargando tu plan de entrenamiento...</h5>
                </div>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="bg-white min-vh-100">
                <section className="py-6">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="text-center py-5">
                                    <div className="bg-light rounded-4 p-5">
                                        <AlertCircle className="w-16 h-16 text-muted mb-4 mx-auto" />
                                        <h3 className="fw-bold mb-3">Sin Plan Asignado</h3>
                                        <p className="text-muted mb-4">
                                            {error || 'No se pudo cargar tu plan de entrenamiento.'}
                                        </p>
                                        <div className="d-flex gap-3 justify-content-center">
                                            <button
                                                className="btn btn-primary-red"
                                                onClick={loadUserPlan}
                                            >
                                                <RotateCcw className="w-4 h-4 me-2" />
                                                Recargar
                                            </button>
                                            <a
                                                href={whatsappLink}
                                                className="btn btn-outline-success"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <User className="w-4 h-4 me-2" />
                                                Contactar Entrenador
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="bg-white min-vh-100" >
            {/* Header Section - Más compacto */}
            <section className="py-3" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <h1 className="h4 fw-bold text-white mb-1">
                                <Calendar className="w-5 h-5 me-2 text-danger" />
                                Mi Plan
                            </h1>
                            <p className="text-white-50 mb-0 small">
                                Por Eliseo Lariguet
                            </p>
                        </div>
                        <div className="col-4 text-end">
                            <a
                                href={whatsappLink}
                                className="btn btn-outline-light btn-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <User className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>



            {/* Days Navigation - Mobile Optimized */}
            <section className="py-3">
                <div className="container">
                    {/* Mobile Pills Navigation */}
                    <div className="mb-3">
                        <div className="d-flex gap-2 overflow-auto pb-2">
                            {plan.dias_plan?.map((dia, index) => (
                                <button
                                    key={dia.dia_plan_id}
                                    className={`btn btn-sm flex-shrink-0 ${
                                        selectedDay === index ? 'btn-primary-red' : 'btn-outline-primary'
                                    }`}
                                    onClick={() => setSelectedDay(index)}
                                >
                                    Día {dia.num_dia}
                                    <span className="badge bg-white text-dark ms-1">
                                        {dia.detalle_ejercicios?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Day Content - Compact */}
                    {plan.dias_plan && plan.dias_plan[selectedDay] && (
                        <div className="card border-0 rounded-3 shadow-sm">
                            <div className="card-header bg-light border-0 rounded-top-3 py-2">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                        <h6 className="fw-bold mb-0">
                                            {plan.dias_plan[selectedDay].nombre_dia}
                                        </h6>
                                        <small className="text-muted">
                                            {plan.dias_plan[selectedDay].detalle_ejercicios?.length || 0} ejercicios
                                        </small>
                                    </div>
                                    <div className="bg-primary-red rounded-3 p-2">
                                        <Target className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-0">
                                {plan.dias_plan[selectedDay].detalle_ejercicios?.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {plan.dias_plan[selectedDay].detalle_ejercicios
                                            .sort((a, b) => a.orden - b.orden)
                                            .map((detalle, index) => (
                                                <div key={detalle.detalle_id} className="list-group-item border-0 py-3">
                                                    <div className="d-flex align-items-start">
                                                        <div className="me-3 flex-shrink-0">
                                                        <span className="badge bg-primary rounded-pill">
                                                            {detalle.orden}
                                                        </span>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center mb-1">
                                                                <div className="bg-primary-red rounded-2 p-1 me-2">
                                                                    <Target className="w-3 h-3 text-white" />
                                                                </div>
                                                                <h6 className="fw-bold mb-0">
                                                                    {detalle.ejercicio?.nombre}
                                                                </h6>
                                                            </div>
                                                            <div className="small text-muted mb-2">
                                                                {detalle.ejercicio?.categoria?.nombre}
                                                            </div>

                                                            {/* Compact info grid */}
                                                            <div className="row g-1">
                                                                <div className="col-3">
                                                                    <div className="bg-light rounded-2 p-1 text-center">
                                                                        <div className="small text-muted">Series</div>
                                                                        <div className="fw-semibold small">{detalle.series || '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="bg-light rounded-2 p-1 text-center">
                                                                        <div className="small text-muted">Reps</div>
                                                                        <div className="fw-semibold small">{detalle.repeticiones || '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="bg-light rounded-2 p-1 text-center">
                                                                        <div className="small text-muted">Peso</div>
                                                                        <div className="fw-semibold small">{detalle.peso || '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="bg-light rounded-2 p-1 text-center">
                                                                        <div className="small text-muted">Pausa</div>
                                                                        <div className="fw-semibold small">{detalle.pausa || '-'}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Target className="w-8 h-8 text-muted mb-2" />
                                        <p className="text-muted mb-0">No hay ejercicios para este día</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>


        </div>
    );
};

export default PlanViewer;