import React, { useState, useEffect } from 'react';
import {
    Dumbbell,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Save,
    AlertCircle,
    CheckCircle,
    Target,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import '../../styles/styles.css';

const ExercisesCrud = () => {
    const [exercises, setExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExercise, setCurrentExercise] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        categoria_id: '',
        nombre: '',
        descripcion: ''
    });

    // Filter state
    const [filterCategory, setFilterCategory] = useState('');
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
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
        };
    };

    // Load exercises and categories on component mount
    useEffect(() => {
        loadExercises();
        loadCategories();
    }, []);

    const loadExercises = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/ejercicios`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar ejercicios');

            const data = await response.json();
            setExercises(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch(`${API_BASE}/categorias`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar categorías');

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing
                ? `${API_BASE}/ejercicios/${currentExercise.ejercicio_id}`
                : `${API_BASE}/ejercicios`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ...formData,
                    categoria_id: parseInt(formData.categoria_id)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al guardar ejercicio');
            }

            setSuccess(isEditing ? 'Ejercicio actualizado exitosamente' : 'Ejercicio creado exitosamente');
            setShowModal(false);
            resetForm();
            loadExercises();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (exercise) => {
        setCurrentExercise(exercise);
        setIsEditing(true);
        setFormData({
            categoria_id: exercise.categoria_id.toString(),
            nombre: exercise.nombre,
            descripcion: exercise.descripcion || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (exerciseId, exerciseName) => {
        if (!window.confirm(`¿Estás seguro de eliminar el ejercicio "${exerciseName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/ejercicios/${exerciseId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al eliminar ejercicio');

            setSuccess('Ejercicio eliminado exitosamente');
            loadExercises();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setCurrentExercise(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            categoria_id: '',
            nombre: '',
            descripcion: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter exercises based on search term and category
    const filteredExercises = exercises.filter(exercise => {
        const matchesSearch = exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exercise.descripcion && exercise.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = filterCategory === '' ||
            (exercise.categoria && exercise.categoria.categoria_id.toString() === filterCategory);

        return matchesSearch && matchesCategory;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredExercises.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredExercises.length / itemsPerPage);

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
    }, [searchTerm, filterCategory]);

    return (
        <div className="bg-white min-vh-100">
            {/* Header Section */}
            <section className="py-4" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h1 className="display-6 fw-bold text-white mb-2">
                                <Dumbbell className="w-8 h-8 me-3 text-danger" />
                                Gestión de Ejercicios
                            </h1>
                            <p className="text-white-50 mb-0">Administra el catálogo de ejercicios</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button
                                className="btn btn-primary-red"
                                onClick={handleAdd}
                            >
                                <Plus className="w-4 h-4 me-2" />
                                Nuevo Ejercicio
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
                                    placeholder="Buscar ejercicios..."
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
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categories.map(category => (
                                            <option key={category.categoria_id} value={category.categoria_id}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <Filter className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                                </div>
                                <span className="text-muted text-nowrap">
                                    {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exercises Table */}
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
                                                <th className="border-0 fw-bold text-dark px-4 py-3">Ejercicio</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-md-table-cell">Categoría</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-lg-table-cell">Descripción</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 text-center">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5 text-muted">
                                                        No se encontraron ejercicios
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map(exercise => (
                                                    <tr key={exercise.ejercicio_id}>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary-red rounded-3 p-2 me-3 flex-shrink-0">
                                                                    <Target className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold text-dark">
                                                                        {exercise.nombre}
                                                                    </div>
                                                                    <div className="small text-muted d-md-none">
                                                                        {exercise.categoria?.nombre || 'Sin categoría'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-md-table-cell">
                                                                <span className="badge bg-primary rounded-pill">
                                                                    {exercise.categoria?.nombre || 'Sin categoría'}
                                                                </span>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-lg-table-cell">
                                                                <span className="text-muted">
                                                                    {exercise.descripcion ?
                                                                        (exercise.descripcion.length > 50 ?
                                                                                exercise.descripcion.substring(0, 50) + '...' :
                                                                                exercise.descripcion
                                                                        ) :
                                                                        'Sin descripción'
                                                                    }
                                                                </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex gap-2 justify-content-center">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => handleEdit(exercise)}
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDelete(exercise.ejercicio_id, exercise.nombre)}
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
                                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredExercises.length)} de {filteredExercises.length} ejercicios
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

            {/* Exercise Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body pt-2">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Nombre del Ejercicio *</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className="form-control"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Sentadillas, Press de banca, Flexiones..."
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Categoría *</label>
                                            <select
                                                name="categoria_id"
                                                className="form-select"
                                                value={formData.categoria_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {categories.map(category => (
                                                    <option key={category.categoria_id} value={category.categoria_id}>
                                                        {category.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Descripción</label>
                                            <textarea
                                                name="descripcion"
                                                className="form-control"
                                                rows="4"
                                                value={formData.descripcion}
                                                onChange={handleInputChange}
                                                placeholder="Describe la técnica, músculos trabajados, variaciones..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 pt-0">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary-red"
                                    >
                                        <Save className="w-4 h-4 me-2" />
                                        {isEditing ? 'Actualizar' : 'Crear'} Ejercicio
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExercisesCrud;