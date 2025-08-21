import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Save,
    AlertCircle,
    CheckCircle,
    User,
    Clock,
    ChevronLeft,
    ChevronRight,
    Eye,
    Copy,
    X,
    Target
} from 'lucide-react';
import PlanForm from './PlanForm';
import '../../styles/styles.css';

const PlanesCrud = () => {
    const [plans, setPlans] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);

    // Filter state
    const [filterUser, setFilterUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const API_BASE = import.meta.env.VITE_BACKEND;

    // Utility function to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Load plans and users on component mount
    useEffect(() => {
        loadPlans();
        loadUsers();
    }, [filterUser]);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const url = filterUser
                ? `${API_BASE}/planes?usuario_id=${filterUser}`
                : `${API_BASE}/planes`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar planes');

            const data = await response.json();
            setPlans(data);
            setCurrentPage(1); // Reset to first page when data changes
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await fetch(`${API_BASE}/usuarios?rol=alumno`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
        }
    };

    const handlePlanSaved = () => {
        setSuccess(isEditing ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente');
        setShowModal(false);
        loadPlans();
    };

    const handleEdit = (plan) => {
        setCurrentPlan(plan);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleView = (plan) => {
        setCurrentPlan(plan);
        setShowViewModal(true);
    };

    const handleDuplicate = async (plan) => {
        if (!window.confirm(`¿Duplicar el plan "${plan.nombre_plan}"?`)) {
            return;
        }

        try {
            // Create a copy of the plan without IDs
            const planCopy = {
                usuario_id: plan.usuario_id,
                nombre_plan: `${plan.nombre_plan} (Copia)`,
                dias_plan: plan.dias_plan.map(dia => ({
                    num_dia: dia.num_dia,
                    nombre_dia: dia.nombre_dia,
                    detalle_ejercicios: dia.detalle_ejercicios.map(detalle => ({
                        ejercicio_id: detalle.ejercicio_id,
                        orden: detalle.orden,
                        series: detalle.series,
                        repeticiones: detalle.repeticiones,
                        peso: detalle.peso,
                        pausa: detalle.pausa
                    }))
                }))
            };

            const response = await fetch(`${API_BASE}/planes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(planCopy)
            });

            if (!response.ok) throw new Error('Error al duplicar plan');

            setSuccess('Plan duplicado exitosamente');
            loadPlans();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (planId, planName) => {
        if (!window.confirm(`¿Estás seguro de eliminar el plan "${planName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/planes/${planId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al eliminar plan');

            setSuccess('Plan eliminado exitosamente');
            loadPlans();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setCurrentPlan(null);
        setShowModal(true);
    };

    // Filter plans based on search term
    const filteredPlans = plans.filter(plan =>
        plan.nombre_plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.usuario?.nombre && plan.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (plan.usuario?.apellido && plan.usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Clear alerts after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterUser]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white min-vh-100" style={{paddingTop: '76px'}}>
            {/* Header Section */}
            <section className="py-4" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h1 className="display-6 fw-bold text-white mb-2">
                                <Calendar className="w-8 h-8 me-3 text-danger" />
                                Gestión de Planes
                            </h1>
                            <p className="text-white-50 mb-0">Administra los planes de entrenamiento</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button
                                className="btn btn-primary-red"
                                onClick={handleAdd}
                            >
                                <Plus className="w-4 h-4 me-2" />
                                Nuevo Plan
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Alerts */}
            {error && (
                <div className="container mt-3">
                    <div className="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">
                        <AlertCircle className="w-4 h-4 me-2" />
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                </div>
            )}

            {success && (
                <div className="container mt-3">
                    <div className="alert alert-success d-flex align-items-center alert-dismissible fade show" role="alert">
                        <CheckCircle className="w-4 h-4 me-2" />
                        {success}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccess(null)}
                        ></button>
                    </div>
                </div>
            )}

            {/* Filters Section */}
            <section className="py-4 bg-light">
                <div className="container">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Buscar planes por nombre o usuario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-3 align-items-center">
                                <div className="position-relative flex-grow-1">
                                    <select
                                        className="form-select ps-5"
                                        value={filterUser}
                                        onChange={(e) => setFilterUser(e.target.value)}
                                    >
                                        <option value="">Todos los usuarios</option>
                                        {users.map(user => (
                                            <option key={user.usuario_id} value={user.usuario_id}>
                                                {user.nombre} {user.apellido}
                                            </option>
                                        ))}
                                    </select>
                                    <Filter className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                                </div>
                                <span className="text-muted text-nowrap">
                                    {filteredPlans.length} plan{filteredPlans.length !== 1 ? 'es' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Table */}
            <section className="py-4">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="card border-0 rounded-4 shadow-sm">
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 fw-bold text-dark px-4 py-3">Plan</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-md-table-cell">Usuario</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-lg-table-cell">Fecha Creación</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-lg-table-cell">Días</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 text-center">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5 text-muted">
                                                        No se encontraron planes
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map(plan => (
                                                    <tr key={plan.plan_id}>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary-red rounded-3 p-2 me-3 flex-shrink-0">
                                                                    <Calendar className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold text-dark">
                                                                        {plan.nombre_plan}
                                                                    </div>
                                                                    <div className="small text-muted d-md-none">
                                                                        {plan.usuario?.nombre} {plan.usuario?.apellido}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-md-table-cell">
                                                            <div className="d-flex align-items-center">
                                                                <User className="w-4 h-4 text-muted me-2" />
                                                                <span className="text-muted">
                                                                        {plan.usuario?.nombre} {plan.usuario?.apellido}
                                                                    </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-lg-table-cell">
                                                            <div className="d-flex align-items-center">
                                                                <Clock className="w-4 h-4 text-muted me-2" />
                                                                <span className="text-muted">
                                                                        {formatDate(plan.fecha_creacion)}
                                                                    </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-lg-table-cell">
                                                                <span className="badge bg-primary rounded-pill">
                                                                    {plan.dias_plan?.length || 0} día{plan.dias_plan?.length !== 1 ? 's' : ''}
                                                                </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex gap-1 justify-content-center">
                                                                <button
                                                                    className="btn btn-outline-info btn-sm"
                                                                    onClick={() => handleView(plan)}
                                                                    title="Ver plan"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => handleEdit(plan)}
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-success btn-sm"
                                                                    onClick={() => handleDuplicate(plan)}
                                                                    title="Duplicar"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDelete(plan.plan_id, plan.nombre_plan)}
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div className="text-muted">
                                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredPlans.length)} de {filteredPlans.length} planes
                                    </div>
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, index) => (
                                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => paginate(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Plan Modal (Create/Edit) */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {isEditing ? 'Editar Plan' : 'Nuevo Plan'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-2">
                                <PlanForm
                                    plan={currentPlan}
                                    isEditing={isEditing}
                                    onSave={handlePlanSaved}
                                    onCancel={() => setShowModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan View Modal (Read Only) */}
            {showViewModal && currentPlan && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    Ver Plan: {currentPlan.nombre_plan}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowViewModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body pt-2">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted">Usuario:</h6>
                                        <p>{currentPlan.usuario?.nombre} {currentPlan.usuario?.apellido}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold text-muted">Fecha de creación:</h6>
                                        <p>{formatDate(currentPlan.fecha_creacion)}</p>
                                    </div>
                                </div>

                                {currentPlan.dias_plan?.map((dia, diaIndex) => (
                                    <div key={dia.dia_plan_id} className="card mb-3">
                                        <div className="card-header bg-light">
                                            <h6 className="fw-bold mb-0">
                                                Día {dia.num_dia}: {dia.nombre_dia}
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            {dia.detalle_ejercicios?.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-sm">
                                                        <thead>
                                                        <tr>
                                                            <th>Orden</th>
                                                            <th>Ejercicio</th>
                                                            <th>Series</th>
                                                            <th>Reps</th>
                                                            <th>Peso</th>
                                                            <th>Pausa</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {dia.detalle_ejercicios.map((detalle, detalleIndex) => (
                                                            <tr key={detalle.detalle_id}>
                                                                <td>{detalle.orden}</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <Target className="w-4 h-4 text-primary me-2" />
                                                                        {detalle.ejercicio?.nombre}
                                                                    </div>
                                                                </td>
                                                                <td>{detalle.series || '-'}</td>
                                                                <td>{detalle.repeticiones || '-'}</td>
                                                                <td>{detalle.peso || '-'}</td>
                                                                <td>{detalle.pausa || '-'}</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-muted text-center py-3">
                                                    No hay ejercicios para este día
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary-red"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEdit(currentPlan);
                                    }}
                                >
                                    <Edit className="w-4 h-4 me-2" />
                                    Editar Plan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanesCrud;