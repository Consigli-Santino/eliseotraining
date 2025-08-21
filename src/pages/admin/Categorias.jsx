import React, { useState, useEffect } from 'react';
import {
    Grid,
    Plus,
    Edit,
    Trash2,
    Search,
    Save,
    AlertCircle,
    CheckCircle,
    Tag,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import '../../styles/styles.css';

const CategoriesCrud = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    // Filter state
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

    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/categorias`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar categorías');

            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing
                ? `${API_BASE}/categorias/${currentCategory.categoria_id}`
                : `${API_BASE}/categorias`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al guardar categoría');
            }

            setSuccess(isEditing ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');
            setShowModal(false);
            resetForm();
            loadCategories();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditing(true);
        setFormData({
            nombre: category.nombre,
            descripcion: category.descripcion || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (categoryId, categoryName) => {
        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/categorias/${categoryId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al eliminar categoría');

            setSuccess('Categoría eliminada exitosamente');
            loadCategories();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setCurrentCategory(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
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

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

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
    }, [searchTerm]);

    return (
        <div className="bg-white min-vh-100" >
            {/* Header Section */}
            <section className="py-4" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h1 className="display-6 fw-bold text-white mb-2">
                                <Grid className="w-8 h-8 me-3 text-danger" />
                                Gestión de Categorías
                            </h1>
                            <p className="text-white-50 mb-0">Organiza los ejercicios por categorías</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button
                                className="btn btn-primary-red"
                                onClick={handleAdd}
                            >
                                <Plus className="w-4 h-4 me-2" />
                                Nueva Categoría
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

            {/* Search Section */}
            <section className="py-4 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Buscar categorías..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                            </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                            <span className="text-muted">
                                Total: {filteredCategories.length} categoría{filteredCategories.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Table */}
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
                                                <th className="border-0 fw-bold text-dark px-4 py-3">Categoría</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-md-table-cell">Descripción</th>
                                                <th className="border-0 fw-bold text-dark px-4 py-3 text-center">Acciones</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-5 text-muted">
                                                        No se encontraron categorías
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItems.map(category => (
                                                    <tr key={category.categoria_id}>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-primary-red rounded-3 p-2 me-3 flex-shrink-0">
                                                                    <Tag className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold text-dark">
                                                                        {category.nombre}
                                                                    </div>
                                                                    <div className="small text-muted d-md-none">
                                                                        {category.descripcion || 'Sin descripción'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 d-none d-md-table-cell">
                                                                <span className="text-muted">
                                                                    {category.descripcion || 'Sin descripción'}
                                                                </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="d-flex gap-2 justify-content-center">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => handleEdit(category)}
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDelete(category.categoria_id, category.nombre)}
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
                                        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredCategories.length)} de {filteredCategories.length} categorías
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

            {/* Category Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body pt-2">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre *</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className="form-control"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Ej: Cardio, Fuerza, Flexibilidad..."
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            className="form-control"
                                            rows="3"
                                            value={formData.descripcion}
                                            onChange={handleInputChange}
                                            placeholder="Describe el tipo de ejercicios que incluye esta categoría..."
                                        />
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
                                        {isEditing ? 'Actualizar' : 'Crear'} Categoría
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

export default CategoriesCrud;