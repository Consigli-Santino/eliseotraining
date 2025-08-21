import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    X,
    Save,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import '../../styles/styles.css';

const UsersCrud = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol_id: '',
        password: ''
    });

    // Filter state
    const [filterRole, setFilterRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const API_BASE = import.meta.env.VITE_BACKEND;

    // Utility function to get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Load users and roles on component mount
    useEffect(() => {
        loadUsers();
        loadRoles();
    }, [filterRole]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const url = filterRole
                ? `${API_BASE}/usuarios?rol=${filterRole}`
                : `${API_BASE}/usuarios`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar usuarios');

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await fetch(`${API_BASE}/roles`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar roles');

            const data = await response.json();
            setRoles(data);
        } catch (err) {
            console.error('Error loading roles:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isEditing
                ? `${API_BASE}/usuarios/${currentUser.usuario_id}`
                : `${API_BASE}/usuarios`;

            const method = isEditing ? 'PUT' : 'POST';

            // For editing, don't send password if it's empty
            const payload = { ...formData };
            if (isEditing && !payload.password) {
                delete payload.password;
            }

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al guardar usuario');
            }

            setSuccess(isEditing ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
            setShowModal(false);
            resetForm();
            loadUsers();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
        setFormData({
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono || '',
            rol_id: user.rol_id,
            password: '' // Don't pre-fill password
        });
        setShowModal(true);
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario ${userName}?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/usuarios/${userId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al eliminar usuario');

            setSuccess('Usuario eliminado exitosamente');
            loadUsers();

        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdd = () => {
        setIsEditing(false);
        setCurrentUser(null);
        resetForm();
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            rol_id: '',
            password: ''
        });
        setShowPassword(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div className="bg-white min-vh-100" >
            {/* Header Section */}
            <section className="py-4" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <h1 className="display-6 fw-bold text-white mb-2">
                                <Users className="w-8 h-8 me-3 text-danger" />
                                Gestión de Usuarios
                            </h1>
                            <p className="text-white-50 mb-0">Administra usuarios del sistema</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <button
                                className="btn btn-primary-red"
                                onClick={handleAdd}
                            >
                                <Plus className="w-4 h-4 me-2" />
                                Nuevo Usuario
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
                                    placeholder="Buscar por nombre, apellido o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="position-relative">
                                <select
                                    className="form-select ps-5"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="">Todos los roles</option>
                                    {roles.map(role => (
                                        <option key={role.rol_id} value={role.nombre}>
                                            {role.nombre}
                                        </option>
                                    ))}
                                </select>
                                <Filter className="position-absolute top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Users Table */}
            <section className="py-4">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card border-0 rounded-4 shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 fw-bold text-dark px-4 py-3">Usuario</th>
                                            <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-md-table-cell">Email</th>
                                            <th className="border-0 fw-bold text-dark px-4 py-3 d-none d-lg-table-cell">Teléfono</th>
                                            <th className="border-0 fw-bold text-dark px-4 py-3">Rol</th>
                                            <th className="border-0 fw-bold text-dark px-4 py-3 text-center">Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">
                                                    No se encontraron usuarios
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <tr key={user.usuario_id}>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="fw-semibold text-dark">
                                                                {user.nombre} {user.apellido}
                                                            </div>
                                                            <div className="small text-muted d-md-none">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 d-none d-md-table-cell">
                                                        <span className="text-muted">{user.email}</span>
                                                    </td>
                                                    <td className="px-4 py-3 d-none d-lg-table-cell">
                                                        <span className="text-muted">{user.telefono || '-'}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                            <span className={`badge rounded-pill ${
                                                                user.rol?.nombre === 'superAdmin' ? 'bg-danger' :
                                                                    user.rol?.nombre === 'profesor' ? 'bg-warning' :
                                                                        'bg-primary'
                                                            }`}>
                                                                {user.rol?.nombre || 'Sin rol'}
                                                            </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={() => handleEdit(user)}
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDelete(user.usuario_id, `${user.nombre} ${user.apellido}`)}
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
                    )}
                </div>
            </section>

            {/* User Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 rounded-4">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Nombre *</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                className="form-control"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Apellido *</label>
                                            <input
                                                type="text"
                                                name="apellido"
                                                className="form-control"
                                                value={formData.apellido}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                className="form-control"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Rol *</label>
                                            <select
                                                name="rol_id"
                                                className="form-select"
                                                value={formData.rol_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar rol</option>
                                                {roles.map(role => (
                                                    <option key={role.rol_id} value={role.rol_id}>
                                                        {role.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                Contraseña {isEditing ? '(dejar vacío para mantener actual)' : '*'}
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    className="form-control pe-5"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required={!isEditing}
                                                />
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
                                        {isEditing ? 'Actualizar' : 'Crear'} Usuario
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

export default UsersCrud;