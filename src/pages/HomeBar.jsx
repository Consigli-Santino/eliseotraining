import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Calendar,
    ClipboardList,
    Users,
    UserCheck,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import '../styles/styles.css';

const HomeBar = ({ userOptions = [] }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Mapeo de iconos de Bootstrap a Lucide React
    const iconMap = {
        'house-fill': Home,
        'calendar-check': Calendar,
        'clipboard-list': ClipboardList,
        'people-fill': Users,
        'person-badge': UserCheck
    };

    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || Home;
        return <IconComponent className="w-5 h-5" />;
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        // Limpiar todo el localStorage
        localStorage.clear();

        // Navegar al login
        navigate('/login');

        // Cerrar menú mobile si está abierto
        setMobileMenuOpen(false);
    };

    return (
        <>
            {/* Desktop HomeBar - Fixed Bottom */}
            <nav className="d-none d-lg-block position-fixed bottom-0 w-100 border-top"
                 style={{
                     backgroundColor: '#1a1a1a',
                     borderColor: '#333333 !important',
                     height: '70px',
                     zIndex: 1020
                 }}>
                <div className="container h-100">
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <ul className="navbar-nav d-flex flex-row align-items-center gap-4 mb-0">
                            {userOptions.map((option, index) => (
                                <li key={index} className="nav-item">
                                    <Link
                                        to={option.path}
                                        className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none ${
                                            isActiveRoute(option.path)
                                                ? 'bg-primary-red text-white'
                                                : 'text-white hover-bg-opacity-10'
                                        }`}
                                        style={{
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            color: isActiveRoute(option.path) ? 'white' : 'rgba(255, 255, 255, 0.7)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActiveRoute(option.path)) {
                                                e.target.style.color = 'white';
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActiveRoute(option.path)) {
                                                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                                                e.target.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        {getIconComponent(option.icon)}
                                        <span className="small">{option.name}</span>
                                    </Link>
                                </li>
                            ))}

                            {/* Logout Button - Always visible */}
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 text-decoration-none btn border-0 text-white-50"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        fontWeight: '500',
                                        backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#ff6b6b';
                                        e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'rgba(255, 255, 255, 0.5)';
                                        e.target.style.backgroundColor = 'transparent';
                                    }}
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="small">Salir</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Mobile HomeBar Toggle Button - Mejorado */}
            <div className="d-lg-none position-fixed" style={{bottom: '20px', right: '20px', zIndex: 1040}}>
                <button
                    className={`btn rounded-circle shadow-lg ${
                        mobileMenuOpen ? 'btn-secondary' : 'btn-primary-red'
                    }`}
                    onClick={handleMobileMenuToggle}
                    style={{
                        width: '56px',
                        height: '56px',
                        transition: 'all 0.3s ease',
                        transform: mobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        boxShadow: '0 4px 12px rgba(185, 28, 28, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0'
                    }}
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile HomeBar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="position-fixed w-100 h-100 d-lg-none"
                    style={{
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1035,
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={closeMobileMenu}
                >
                    {/* Mobile Menu Panel */}
                    <div
                        className="position-fixed top-0 end-0 h-100 shadow-lg"
                        style={{
                            width: '280px',
                            backgroundColor: '#1a1a1a',
                            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                            transition: 'transform 0.3s ease-in-out',
                            zIndex: 1040
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Menu Header */}
                        <div className="p-4 border-bottom" style={{borderColor: '#333333'}}>
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="text-white fw-bold mb-0">Menú</h5>
                                <button
                                    className="btn border-0 text-white p-0"
                                    onClick={closeMobileMenu}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Items */}
                        <div className="p-3">
                            <ul className="list-unstyled mb-0">
                                {userOptions.map((option, index) => (
                                    <li key={index} className="mb-2">
                                        <Link
                                            to={option.path}
                                            className={`nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none transition-all ${
                                                isActiveRoute(option.path)
                                                    ? 'bg-primary-red text-white'
                                                    : 'text-white-50'
                                            }`}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                fontWeight: '500'
                                            }}
                                            onClick={closeMobileMenu}
                                        >
                                            {getIconComponent(option.icon)}
                                            <span>{option.name}</span>
                                        </Link>
                                    </li>
                                ))}

                                {/* Mobile Logout Button */}
                                <li className="mb-2">
                                    <button
                                        onClick={handleLogout}
                                        className="nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none w-100 btn border-0 text-start"
                                        style={{
                                            transition: 'all 0.3s ease',
                                            fontWeight: '500',
                                            backgroundColor: 'transparent',
                                            color: 'rgba(255, 107, 107, 0.8)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                                            e.target.style.color = '#ff6b6b';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = 'rgba(255, 107, 107, 0.8)';
                                        }}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Mobile Menu Footer */}
                        <div className="position-absolute bottom-0 w-100 p-4 border-top" style={{borderColor: '#333333'}}>
                            <div className="text-center">
                                <small className="text-white-50">Eliseo Lariguet</small>
                                <div className="small text-white-50">Entrenador Personal</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeBar;