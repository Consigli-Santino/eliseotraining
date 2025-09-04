import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
    Save,
    Plus,
    Trash2,
    Target,
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    Layers
} from 'lucide-react';
import '../../styles/styles.css';

const PlanForm = ({ plan, isEditing, onSave, onCancel }) => {
    // States
    const [users, setUsers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        usuario_id: '',
        nombre_plan: '',
        comentario_plan: '',
        dias_plan: []
    });

    const [expandedDays, setExpandedDays] = useState({});
    const [expandedBlocks, setExpandedBlocks] = useState({});

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
                comentario_plan: plan.comentario_plan || '',
                dias_plan: plan.dias_plan?.map(dia => ({
                    dia_plan_id: dia.dia_plan_id,
                    num_dia: dia.num_dia,
                    nombre_dia: dia.nombre_dia,
                    comentario_dia: dia.comentario_dia || '',
                    bloques_ejercicio: dia.bloques_ejercicio?.map(bloque => ({
                        bloque_id: bloque.bloque_id,
                        nombre_bloque: bloque.nombre_bloque,
                        orden_bloque: bloque.orden_bloque,
                        descripcion: bloque.descripcion || '',
                        detalle_ejercicios: bloque.detalle_ejercicios?.map(detalle => ({
                            detalle_id: detalle.detalle_id,
                            ejercicio_id: detalle.ejercicio_id,
                            orden: detalle.orden,
                            series: detalle.series || '',
                            repeticiones: detalle.repeticiones || '',
                            peso: detalle.peso || '',
                            pausa: detalle.pausa || '',
                            comentario_ejercicio: detalle.comentario_ejercicio || ''
                        })) || []
                    })) || []
                })) || []
            });

            // Expand all days and blocks when editing
            const expandedDaysState = {};
            const expandedBlocksState = {};
            plan.dias_plan?.forEach((dia, dayIndex) => {
                expandedDaysState[dayIndex] = true;
                dia.bloques_ejercicio?.forEach((bloque, blockIndex) => {
                    expandedBlocksState[`${dayIndex}-${blockIndex}`] = true;
                });
            });
            setExpandedDays(expandedDaysState);
            setExpandedBlocks(expandedBlocksState);
        } else {
            // Reset for new plan
            setFormData({
                usuario_id: '',
                nombre_plan: '',
                comentario_plan: '',
                dias_plan: []
            });
            setExpandedDays({});
            setExpandedBlocks({});
        }
    }, [plan, isEditing]);

    // Format exercises for react-select with categories
    const formatExerciseOptions = (exercisesList) => {
        const grouped = exercisesList.reduce((acc, exercise) => {
            const categoryName = exercise.categoria?.nombre || 'Sin Categoría';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push({
                value: exercise.ejercicio_id,
                label: exercise.nombre,
                category: categoryName
            });
            return acc;
        }, {});

        return Object.keys(grouped).map(category => ({
            label: category,
            options: grouped[category]
        }));
    };

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
            setExerciseOptions(formatExerciseOptions(data));
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
            comentario_dia: '',
            bloques_ejercicio: []
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

    // Block management functions
    const addBlock = (dayIndex) => {
        const newBlock = {
            nombre_bloque: `Bloque ${formData.dias_plan[dayIndex].bloques_ejercicio.length + 1}`,
            orden_bloque: formData.dias_plan[dayIndex].bloques_ejercicio.length + 1,
            descripcion: '',
            detalle_ejercicios: []
        };

        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, index) =>
                index === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: [...dia.bloques_ejercicio, newBlock]
                } : dia
            )
        }));

        // Expand the new block
        const newBlockIndex = formData.dias_plan[dayIndex].bloques_ejercicio.length;
        setExpandedBlocks(prev => ({
            ...prev,
            [`${dayIndex}-${newBlockIndex}`]: true
        }));
    };

    const removeBlock = (dayIndex, blockIndex) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: dia.bloques_ejercicio.filter((_, bIndex) => bIndex !== blockIndex)
                        .map((bloque, bIndex) => ({
                            ...bloque,
                            orden_bloque: bIndex + 1,
                            nombre_bloque: bloque.nombre_bloque.replace(/Bloque \d+/, `Bloque ${bIndex + 1}`)
                        }))
                } : dia
            )
        }));

        // Update expanded blocks
        const newExpandedBlocks = {};
        Object.keys(expandedBlocks).forEach(key => {
            const [dayIdx, blockIdx] = key.split('-').map(Number);
            if (dayIdx === dayIndex) {
                if (blockIdx < blockIndex) {
                    newExpandedBlocks[`${dayIdx}-${blockIdx}`] = expandedBlocks[key];
                } else if (blockIdx > blockIndex) {
                    newExpandedBlocks[`${dayIdx}-${blockIdx - 1}`] = expandedBlocks[key];
                }
            } else {
                newExpandedBlocks[key] = expandedBlocks[key];
            }
        });
        setExpandedBlocks(newExpandedBlocks);
    };

    const updateBlock = (dayIndex, blockIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: dia.bloques_ejercicio.map((bloque, bIndex) =>
                        bIndex === blockIndex ? { ...bloque, [field]: value } : bloque
                    )
                } : dia
            )
        }));
    };

    const toggleBlock = (dayIndex, blockIndex) => {
        const key = `${dayIndex}-${blockIndex}`;
        setExpandedBlocks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Exercise management functions (now within blocks)
    const addExercise = (dayIndex, blockIndex) => {
        const currentBlock = formData.dias_plan[dayIndex].bloques_ejercicio[blockIndex];
        const newExercise = {
            ejercicio_id: '',
            orden: currentBlock.detalle_ejercicios.length + 1,
            series: '',
            repeticiones: '',
            peso: '',
            pausa: '',
            comentario_ejercicio: ''
        };

        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: dia.bloques_ejercicio.map((bloque, bIndex) =>
                        bIndex === blockIndex ? {
                            ...bloque,
                            detalle_ejercicios: [...bloque.detalle_ejercicios, newExercise]
                        } : bloque
                    )
                } : dia
            )
        }));
    };

    const removeExercise = (dayIndex, blockIndex, exerciseIndex) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: dia.bloques_ejercicio.map((bloque, bIndex) =>
                        bIndex === blockIndex ? {
                            ...bloque,
                            detalle_ejercicios: bloque.detalle_ejercicios.filter((_, eIndex) => eIndex !== exerciseIndex)
                                .map((ejercicio, eIndex) => ({
                                    ...ejercicio,
                                    orden: eIndex + 1
                                }))
                        } : bloque
                    )
                } : dia
            )
        }));
    };

    const updateExercise = (dayIndex, blockIndex, exerciseIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            dias_plan: prev.dias_plan.map((dia, dIndex) =>
                dIndex === dayIndex ? {
                    ...dia,
                    bloques_ejercicio: dia.bloques_ejercicio.map((bloque, bIndex) =>
                        bIndex === blockIndex ? {
                            ...bloque,
                            detalle_ejercicios: bloque.detalle_ejercicios.map((ejercicio, eIndex) =>
                                eIndex === exerciseIndex ? {
                                    ...ejercicio,
                                    [field]: field === 'ejercicio_id' ? parseInt(value) : value
                                } : ejercicio
                            )
                        } : bloque
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

                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <label className="form-label fw-semibold">Comentario General del Plan</label>
                        <textarea
                            name="comentario_plan"
                            className="form-control"
                            rows="3"
                            value={formData.comentario_plan}
                            onChange={handleInputChange}
                            placeholder="Descripción general del plan, objetivos, consideraciones especiales... (opcional)"
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
                                                {dia.bloques_ejercicio.length} bloque{dia.bloques_ejercicio.length !== 1 ? 's' : ''}
                                                {' • '}
                                                {dia.bloques_ejercicio.reduce((total, bloque) => total + bloque.detalle_ejercicios.length, 0)} ejercicio{dia.bloques_ejercicio.reduce((total, bloque) => total + bloque.detalle_ejercicios.length, 0) !== 1 ? 's' : ''}
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
                                    <div className="row mt-2">
                                        <div className="col-12">
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="2"
                                                value={dia.comentario_dia}
                                                onChange={(e) => updateDay(dayIndex, 'comentario_dia', e.target.value)}
                                                placeholder="Comentario del día (opcional): enfoque, intensidad, consideraciones..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {expandedDays[dayIndex] && (
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-semibold mb-0">Bloques de Ejercicios</h6>
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => addBlock(dayIndex)}
                                            >
                                                <Layers className="w-4 h-4 me-1" />
                                                Agregar Bloque
                                            </button>
                                        </div>

                                        {dia.bloques_ejercicio.length === 0 ? (
                                            <div className="text-center py-4 bg-light rounded-3">
                                                <Layers className="w-6 h-6 text-muted mb-2" />
                                                <p className="text-muted mb-2">No hay bloques en este día</p>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={() => addBlock(dayIndex)}
                                                >
                                                    <Layers className="w-4 h-4 me-1" />
                                                    Agregar Bloque
                                                </button>
                                            </div>
                                        ) : (
                                            dia.bloques_ejercicio.map((bloque, blockIndex) => (
                                                <div key={blockIndex} className="card mb-3 border-secondary">
                                                    <div className="card-header bg-secondary-subtle">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm fw-semibold"
                                                                    value={bloque.nombre_bloque}
                                                                    onChange={(e) => updateBlock(dayIndex, blockIndex, 'nombre_bloque', e.target.value)}
                                                                    placeholder="Nombre del bloque"
                                                                />
                                                            </div>
                                                            <div className="col-md-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    value={bloque.descripcion}
                                                                    onChange={(e) => updateBlock(dayIndex, blockIndex, 'descripcion', e.target.value)}
                                                                    placeholder="Descripción (opcional)"
                                                                />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <small className="text-muted">
                                                                    {bloque.detalle_ejercicios.length} ejercicio{bloque.detalle_ejercicios.length !== 1 ? 's' : ''}
                                                                </small>
                                                            </div>
                                                            <div className="col-md-2 text-end">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                                    onClick={() => toggleBlock(dayIndex, blockIndex)}
                                                                >
                                                                    {expandedBlocks[`${dayIndex}-${blockIndex}`] ?
                                                                        <ChevronUp className="w-4 h-4" /> :
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    }
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => removeBlock(dayIndex, blockIndex)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {expandedBlocks[`${dayIndex}-${blockIndex}`] && (
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h6 className="fw-semibold mb-0 text-secondary">Ejercicios</h6>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => addExercise(dayIndex, blockIndex)}
                                                                >
                                                                    <Plus className="w-4 h-4 me-1" />
                                                                    Agregar Ejercicio
                                                                </button>
                                                            </div>

                                                            {bloque.detalle_ejercicios.length === 0 ? (
                                                                <div className="text-center py-3 bg-light rounded-3">
                                                                    <Target className="w-5 h-5 text-muted mb-2" />
                                                                    <p className="text-muted mb-2 small">No hay ejercicios en este bloque</p>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-primary btn-sm"
                                                                        onClick={() => addExercise(dayIndex, blockIndex)}
                                                                    >
                                                                        <Plus className="w-4 h-4 me-1" />
                                                                        Agregar Ejercicio
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="table-responsive">
                                                                    <table className="table table-sm table-bordered">
                                                                        <thead className="table-light">
                                                                        <tr>
                                                                            <th width="4%">#</th>
                                                                            <th width="20%">Ejercicio</th>
                                                                            <th width="8%">Series</th>
                                                                            <th width="10%">Reps</th>
                                                                            <th width="8%">Peso</th>
                                                                            <th width="8%">Pausa</th>
                                                                            <th width="35%">Comentario</th>
                                                                            <th width="7%">Acciones</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {bloque.detalle_ejercicios.map((ejercicio, exerciseIndex) => (
                                                                            <tr key={exerciseIndex}>
                                                                                <td>
                                                                                    <span className="badge bg-secondary">{ejercicio.orden}</span>
                                                                                </td>
                                                                                <td>
                                                                                    <Select
                                                                                        options={exerciseOptions}
                                                                                        value={exerciseOptions.flatMap(group => group.options).find(option => option.value === ejercicio.ejercicio_id) || null}
                                                                                        onChange={(selectedOption) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'ejercicio_id', selectedOption?.value || '')}
                                                                                        placeholder="Buscar ejercicio..."
                                                                                        isSearchable={true}
                                                                                        menuPortalTarget={document.body}
                                                                                        className="react-select-container"
                                                                                        classNamePrefix="react-select"
                                                                                        styles={{
                                                                                            control: (provided) => ({
                                                                                                ...provided,
                                                                                                minHeight: '31px',
                                                                                                height: '31px'
                                                                                            }),
                                                                                            valueContainer: (provided) => ({
                                                                                                ...provided,
                                                                                                height: '31px',
                                                                                                padding: '0 6px'
                                                                                            }),
                                                                                            input: (provided) => ({
                                                                                                ...provided,
                                                                                                margin: '0px'
                                                                                            }),
                                                                                            menuPortal: (provided) => ({
                                                                                                ...provided,
                                                                                                zIndex: 9999
                                                                                            })
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control form-control-sm"
                                                                                        value={ejercicio.series}
                                                                                        onChange={(e) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'series', e.target.value)}
                                                                                        placeholder="3"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control form-control-sm"
                                                                                        value={ejercicio.repeticiones}
                                                                                        onChange={(e) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'repeticiones', e.target.value)}
                                                                                        placeholder="8-10"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control form-control-sm"
                                                                                        value={ejercicio.peso}
                                                                                        onChange={(e) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'peso', e.target.value)}
                                                                                        placeholder="20kg"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control form-control-sm"
                                                                                        value={ejercicio.pausa}
                                                                                        onChange={(e) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'pausa', e.target.value)}
                                                                                        placeholder="2'"
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <textarea
                                                                                        className="form-control form-control-sm"
                                                                                        rows="1"
                                                                                        value={ejercicio.comentario_ejercicio}
                                                                                        onChange={(e) => updateExercise(dayIndex, blockIndex, exerciseIndex, 'comentario_ejercicio', e.target.value)}
                                                                                        placeholder="Técnica, consejos..."
                                                                                    />
                                                                                </td>
                                                                                <td>
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-outline-danger btn-sm"
                                                                                        onClick={() => removeExercise(dayIndex, blockIndex, exerciseIndex)}
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