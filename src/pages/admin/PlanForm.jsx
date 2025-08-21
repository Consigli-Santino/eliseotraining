import React, { useState, useEffect } from 'react';
import {
    Save,
    Plus,
    Trash2,
    Target,
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    AlertTriangle
} from 'lucide-react';
import '../../styles/styles.css';

const PlanForm = ({ plan, isEditing, onSave, onCancel }) => {
    // States
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        usuario_id: '',
        nombre_plan: '',
        dias_plan: []
    });

    const [expandedDays, setExpandedDays] = useState({});

    const API_BASE = import.meta.env.VITE_BACKEND;

    // Get auth headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
        };
    };

    // Load data on mount
    useEffect(() => {
        loadUsers();
        loadExercises();
    }, []);

    // Initialize form when plan changes
    useEffect(() => {
        if (isEditing && plan) {
            setFormData({
                usuario_id: plan.usuario_id,
                nombre_plan: plan.nombre_plan,
                dias_plan: plan.dias_plan?.map(dia => ({
                    dia_plan_id: dia.dia_plan_id,
                    num_dia: dia.num_dia,
                    nombre_dia: dia.nombre_dia,
                    detalle_ejercicios: dia.detalle_ejercicios?.map(detalle => ({
                        detalle_id: detalle.detalle_id,
                        ejercicio_id: detalle.ejercicio_id,
                        orden: detalle.orden,
                        series: detalle.series || '',
                        repeticiones: detalle.repeticiones || '',
                        peso: detalle.peso || '',
                        pausa: detalle.pausa || ''
                    })) || []
                })) || []
            });

            // Expand all days when editing
            const expandedState = {};
            plan.dias_plan?.forEach((dia, index) => {
                expandedState[index] = true;
            });
            setExpandedDays(expandedState);
        } else {
            // Reset for new plan
            setFormData({
                usuario_id: '',
                nombre_plan: '',
                dias_plan: []
            });
            setExpandedDays({});
        }
    }, [plan, isEditing]);

    // Load users from API
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

    // Load exercises from API
    const loadExercises = async () => {
        try {
            const response = await fetch(`${API_BASE}/ejercicios`, {
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Error al cargar ejercicios');

            const data = await response.json();
            setExercises(data);
        } catch (err) {
            console.error('Error loading exercises:', err);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!formData.usuario_id || !formData.nombre_plan) {
            setError('Usuario y nombre del plan son requeridos');
            return;
        }

        if (formData.dias_plan.length === 0) {
            setError('Debe agregar al menos un día al plan');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const url = isEditing
                ? `${API_BASE}/planes/${plan.plan_id}`
                : `${API_BASE}/planes`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    ...formData,
                    usuario_id: parseInt(formData.usuario_id)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al guardar plan');
            }

            onSave();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle basic input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Day management functions
    const addDay = () => {
        const newDay = {
            num_dia: formData.dias_plan.length + 1,
            nombre_dia: `Día ${formData.dias_plan.length + 1}`,
            detalle_ejercicios: []
        };

        setFormData(prev => ({
            ...prev,
            dias_plan: [...prev.dias_plan, newDay]
        }));

        // Expand the new day
        setExpandedDays(prev => ({
            ...prev,
            [formData.dias_plan.length]: true
        }));
    };

    const removeDay = (dayIndex) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.filter((_, index) => index !== dayIndex)
                .map((dia, index) => ({
                    ...dia,
                    num_dia: index + 1,
                    nombre_dia: dia.nombre_dia.replace(/Día \d+/, `Día ${index + 1}`)
                }))
        }));

        // Update expanded days
        const newExpanded = {};
        Object.keys(expandedDays).forEach(key => {
            const numKey = parseInt(key);
            if (numKey < dayIndex) {
                newExpanded[numKey] = expandedDays[key];
            } else if (numKey > dayIndex) {
                newExpanded[numKey - 1] = expandedDays[key];
            }
        });
        setExpandedDays(newExpanded);
    };

    const updateDay = (dayIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, index) =>
                index === dayIndex ? { ...dia, [field]: value } : dia
            )
        }));
    };

    const toggleDay = (dayIndex) => {
        setExpandedDays(prev => ({
            ...prev,
            [dayIndex]: !prev[dayIndex]
        }));
    };

    // Exercise management functions
    const addExercise = (dayIndex) => {
        const newExercise = {
            ejercicio_id: '',
            orden: formData.dias_plan[dayIndex].detalle_ejercicios.length + 1,
            series: '',
            repeticiones: '',
            peso: '',
            pausa: ''
        };

        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, index) =>
                index === dayIndex ? {
                    ...dia,
                    detalle_ejercicios: [...dia.detalle_ejercicios, newExercise]
                } : dia
            )
        }));
    };

    const removeExercise = (dayIndex, exerciseIndex) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, index) =>
                index === dayIndex ? {
                    ...dia,
                    detalle_ejercicios: dia.detalle_ejercicios.filter((_, eIndex) => eIndex !== exerciseIndex)
                        .map((ejercicio, eIndex) => ({
                            ...ejercicio,
                            orden: eIndex + 1
                        }))
                } : dia
            )
        }));
    };

    const updateExercise = (dayIndex, exerciseIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    detalle_ejercicios: dia.detalle_ejercicios.map((ejercicio, eIndex) =>
                        eIndex === exerciseIndex ? {
                            ...ejercicio,
                            [field]: field === 'ejercicio_id' ? parseInt(value) : value
                        } : ejercicio
                    )
                } : dia
            )
        }));
    };

    return (
        <div>
            {error && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <AlertTriangle className="w-4 h-4 me-2" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Plan Basic Info */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Usuario *</label>
                        <select
                            name="usuario_id"
                            className="form-select"
                            value={formData.usuario_id}
                            onChange={handleInputChange}
                            required
                            disabled={isEditing} // Don't allow changing user when editing
                        >
                            <option value="">Seleccionar usuario</option>
                            {users.map(user => (
                                <option key={user.usuario_id} value={user.usuario_id}>
                                    {user.nombre} {user.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Nombre del Plan *</label>
                        <input
                            type="text"
                            name="nombre_plan"
                            className="form-control"
                            value={formData.nombre_plan}
                            onChange={handleInputChange}
                            placeholder="Ej: Plan Fuerza/Hipertrofia"
                            required
                        />
                    </div>
                </div>

                {/* Days Section */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Días del Plan</h6>
                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={addDay}
                        >
                            <Plus className="w-4 h-4 me-1" />
                            Agregar Día
                        </button>
                    </div>

                    {formData.dias_plan.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-3">
                            <Calendar className="w-8 h-8 text-muted mb-3" />
                            <p className="text-muted mb-3">No hay días agregados al plan</p>
                            <button
                                type="button"
                                className="btn btn-primary-red"
                                onClick={addDay}
                            >
                                <Plus className="w-4 h-4 me-2" />
                                Agregar Primer Día
                            </button>
                        </div>
                    ) : (
                        formData.dias_plan.map((dia, dayIndex) => (
                            <div key={dayIndex} className="card mb-3">
                                <div className="card-header bg-light">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm fw-bold"
                                                value={dia.nombre_dia}
                                                onChange={(e) => updateDay(dayIndex, 'nombre_dia', e.target.value)}
                                                placeholder="Nombre del día"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                {dia.detalle_ejercicios.length} ejercicio{dia.detalle_ejercicios.length !== 1 ? 's' : ''}
                                            </small>
                                        </div>
                                        <div className="col-md-2 text-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm me-2"
                                                onClick={() => toggleDay(dayIndex)}
                                            >
                                                {expandedDays[dayIndex] ?
                                                    <ChevronUp className="w-4 h-4" /> :
                                                    <ChevronDown className="w-4 h-4" />
                                                }
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeDay(dayIndex)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedDays[dayIndex] && (
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-semibold mb-0">Ejercicios</h6>
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => addExercise(dayIndex)}
                                            >
                                                <Plus className="w-4 h-4 me-1" />
                                                Agregar Ejercicio
                                            </button>
                                        </div>

                                        {dia.detalle_ejercicios.length === 0 ? (
                                            <div className="text-center py-4 bg-light rounded-3">
                                                <Target className="w-6 h-6 text-muted mb-2" />
                                                <p className="text-muted mb-2">No hay ejercicios en este día</p>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => addExercise(dayIndex)}
                                                >
                                                    <Plus className="w-4 h-4 me-1" />
                                                    Agregar Ejercicio
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-sm">
                                                    <thead>
                                                    <tr>
                                                        <th width="5%">#</th>
                                                        <th width="30%">Ejercicio</th>
                                                        <th width="12%">Series</th>
                                                        <th width="15%">Repeticiones</th>
                                                        <th width="12%">Peso</th>
                                                        <th width="12%">Pausa</th>
                                                        <th width="8%">Acciones</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {dia.detalle_ejercicios.map((ejercicio, exerciseIndex) => (
                                                        <tr key={exerciseIndex}>
                                                            <td>
                                                                <span className="badge bg-primary">{ejercicio.orden}</span>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={ejercicio.ejercicio_id}
                                                                    onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'ejercicio_id', e.target.value)}
                                                                    required
                                                                >
                                                                    <option value="">Seleccionar ejercicio</option>
                                                                    {exercises.map(ex => (
                                                                        <option key={ex.ejercicio_id} value={ex.ejercicio_id}>
                                                                            {ex.nombre}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={ejercicio.series}
                                                                    onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'series', e.target.value)}
                                                                    placeholder="3"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={ejercicio.repeticiones}
                                                                    onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'repeticiones', e.target.value)}
                                                                    placeholder="8-10"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={ejercicio.peso}
                                                                    onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'peso', e.target.value)}
                                                                    placeholder="20kg"
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={ejercicio.pausa}
                                                                    onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'pausa', e.target.value)}
                                                                    placeholder="2'"
                                                                />
                                                            </td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                                                    title="Eliminar ejercicio"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Form Actions */}
                <div className="d-flex gap-3 justify-content-end">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary-red"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="d-flex align-items-center">
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Guardando...</span>
                                </div>
                                Guardando...
                            </div>
                        ) : (
                            <>
                                <Save className="w-4 h-4 me-2" />
                                {isEditing ? 'Actualizar' : 'Crear'} Plan
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlanForm;