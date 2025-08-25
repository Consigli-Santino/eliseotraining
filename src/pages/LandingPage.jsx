import React, { useState, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import {
    Phone,
    MessageCircle,
    Award,
    Users,
    Clock,
    MapPin,
    Star,
    Dumbbell,
    Shield,
    Trophy,
    ChevronDown,
    CheckCircle,
    Target,
    Zap,
    Heart,
    ArrowRight,
    Play,
    Menu,
    X
} from 'lucide-react';
import fotoPerfil from '../assets/perfilEliseo.jpeg';
import entrenandoAbuela from '../assets/entrenandoAbuela.jpeg';
import patada from '../assets/patada.jpeg';
import parado from '../assets/parado.jpeg';
import perfilNavbar from '../assets/perfilNavbar.jpeg';
import defensaPersonal from '../assets/defensaPersonalV1.jpeg';
import peleaEli from '../assets/peleaEli.mp4';
import gifkata from '../assets/gifkata.mp4';
import eliseoQueli from '../assets/eliseoQueli.jpeg';
import '../styles/styles.css';

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Manejar navegación directa con hash
        const handleInitialHash = () => {
            const hash = window.location.hash;
            if (hash) {
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    if (element) {
                        const navbarHeight = 80;
                        const elementPosition = element.offsetTop - navbarHeight;
                        window.scrollTo({
                            top: elementPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        };

        handleInitialHash();
    }, []);

    // Función para cerrar menú móvil al hacer clic
    const handleNavClick = () => {
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    };

    // Función personalizada para scroll con offset
    const scrollWithOffset = (el) => {
        const yCoordinate = el.offsetTop - 80; // 80px offset para navbar
        const yOffset = -10; // offset adicional si necesitas
        window.scrollTo({
            top: yCoordinate + yOffset,
            behavior: 'smooth'
        });
    };

    const whatsappLink = "https://wa.me/5493517503115?text=Hola!%20me%20encantaria%20tomar%20una%20clase%20de%20entrenamiento%20con%20Eliseo";

    // Componente para el icono de WhatsApp oficial
    const WhatsAppIcon = ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.434 3.488"/>
        </svg>
    );

    const services = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Defensa Personal",
            description: "Técnicas efectivas de autodefensa adaptadas a situaciones reales del día a día",
            features: ["Técnicas de escape", "Desarme básico", "Defensa contra múltiples atacantes"],
            image: defensaPersonal
        },
        {
            icon: <Trophy className="w-6 h-6" />,
            title: "Karate",
            description: "Enseñanza de karate con enfoque en disciplina y técnica perfecta",
            features: ["Katas", "Kumite (combate)", "Filosofía del karate"],
            image: patada
        },
        {
            icon: <Dumbbell className="w-6 h-6" />,
            title: "Fitness Personal",
            description: "Entrenamiento personalizado para mejorar tu condición física integral",
            features: ["Entrenamiento funcional", "Acondicionamiento físico", "Nutrición deportiva"],
            image: entrenandoAbuela
        }
    ];

    const testimonials = [
        {
            name: "María González",
            role: "Estudiante de Defensa Personal",
            text: "Eliseo me enseñó técnicas que realmente funcionan. Su paciencia y profesionalismo son excepcionales. Me siento mucho más segura después de sus clases.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        },
        {
            name: "Carlos Rodríguez",
            role: "Practicante de Karate",
            text: "Las clases de karate con Eliseo son increíbles. Su conocimiento de las técnicas tradicionales y su forma de enseñar hacen que cada clase sea un aprendizaje único.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        },
        {
            name: "Ana Martínez",
            role: "Entrenamiento Fitness",
            text: "Gracias a Eliseo alcancé mis objetivos de fitness. Su programa personalizado y motivación constante fueron clave para mi transformación física.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
        }
    ];

    const benefits = [
        { icon: <Award className="w-6 h-6" />, title: "Instructor Certificado", desc: "Cinturón negro con años de experiencia comprobada" },
        { icon: <Target className="w-6 h-6" />, title: "Entrenamiento Personalizado", desc: "Adaptado específicamente a tu nivel y objetivos" },
        { icon: <Clock className="w-6 h-6" />, title: "Horarios Flexibles", desc: "Clases que se adaptan perfectamente a tu agenda" },
        { icon: <Shield className="w-6 h-6" />, title: "Ambiente Seguro", desc: "Espacio profesional y completamente controlado" },
        { icon: <Heart className="w-6 h-6" />, title: "Resultados Garantizados", desc: "Compromiso total con tu progreso y mejora" },
        { icon: <Users className="w-6 h-6" />, title: "Comunidad Activa", desc: "Únete a nuestro grupo de estudiantes motivados" }
    ];

    return (
        <div className="bg-white">

            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-executive">
                <div className="container">
                    <Link smooth to="#inicio" className="navbar-brand d-flex align-items-center text-white fw-bold fs-4">
                        <img
                            src={perfilNavbar}
                            alt="Eliseo Lariguet Logo"
                            className="me-2 rounded-circle"
                            style={{width: '32px', height: '32px', objectFit: 'cover'}}
                        />
                        Eliseo Lariguet
                    </Link>

                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{color: 'white'}}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link
                                    smooth
                                    to="#inicio"
                                    className="nav-link text-white-50 fw-medium px-3"
                                    scroll={scrollWithOffset}
                                    onClick={handleNavClick}
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    smooth
                                    to="#sobre-mi"
                                    className="nav-link text-white-50 fw-medium px-3"
                                    scroll={scrollWithOffset}
                                    onClick={handleNavClick}
                                >
                                    Sobre Mí
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    smooth
                                    to="#servicios"
                                    className="nav-link text-white-50 fw-medium px-3"
                                    scroll={scrollWithOffset}
                                    onClick={handleNavClick}
                                >
                                    Servicios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    smooth
                                    to="#testimonios"
                                    className="nav-link text-white-50 fw-medium px-3"
                                    scroll={scrollWithOffset}
                                    onClick={handleNavClick}
                                >
                                    Testimonios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    smooth
                                    to="#contacto"
                                    className="nav-link text-white-50 fw-medium px-3"
                                    scroll={scrollWithOffset}
                                    onClick={handleNavClick}
                                >
                                    Contacto
                                </Link>
                            </li>
                            <li className="nav-item ms-2">
                                <a href={whatsappLink} className="btn btn-outline-light btn-sm">
                                    <WhatsAppIcon className="whatsapp-icon-sm me-1" />
                                    WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="inicio" className="hero-executive text-white py-6">
                <div className="container">
                    <div className="row align-items-center min-vh-75">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="position-relative" style={{zIndex: 2}}>

                                <h1 className="display-3 fw-bold mb-4 lh-1">
                                    <div className="mb-2">Eliseo Lariguet</div>
                                    <div className="fs-2 fw-light text-white-50">Maestro en Defensa Personal</div>
                                </h1>

                                <p className="fs-5 text-white-50 mb-4 pe-lg-5">
                                    Transforma tu fuerza interior con entrenamiento profesional.
                                    Experiencia comprobada formando estudiantes en karate, defensa personal y entrenamiento de musculación.
                                </p>

                                <div className="row g-4 mb-5">
                                    <div className="col-6 col-md-3 text-center">
                                        <div className="display-4 fw-bold text-danger mb-1">50+</div>
                                        <div className="small text-white-50">Estudiantes</div>
                                    </div>
                                    <div className="col-6 col-md-3 text-center">
                                        <div className="display-4 fw-bold text-danger mb-1">100%</div>
                                        <div className="small text-white-50">Satisfacción</div>
                                    </div>
                                    <div className="col-6 col-md-3 text-center">
                                        <div className="display-4 fw-bold text-danger mb-1">24/7</div>
                                        <div className="small text-white-50">Soporte</div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-sm-row gap-3">
                                    <a href={whatsappLink} className="btn btn-primary-red btn-lg px-4 py-3 fw-semibold">
                                        <WhatsAppIcon className="whatsapp-icon-sm me-2" />
                                        Comenzar Entrenamiento
                                    </a>
                                    <Link
                                        smooth
                                        to="#servicios"
                                        className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                                        scroll={scrollWithOffset}
                                    >
                                        Ver Servicios
                                        <ArrowRight className="w-5 h-5 ms-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="text-center position-relative" style={{zIndex: 2}}>
                                <img
                                    src={fotoPerfil}
                                    alt="Eliseo Lariguet - Instructor de Karate"
                                    className="img-fluid rounded-4 shadow-lg"
                                    style={{maxWidth: '400px'}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Management Section */}
            <section className="py-6 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h2 className="display-5 fw-bold mb-3">
                                Gestión <span className="text-danger">Digital</span>
                            </h2>
                            <p className="fs-5 text-muted mb-5">
                                Plataforma integral para el seguimiento de tu progreso
                            </p>

                            <div className="row g-4">
                                <div className="col-12">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Gestión de Estudiantes</h5>
                                            <p className="text-muted mb-0">Eliseo administra a todos sus alumnos desde esta plataforma, manteniendo un registro detallado de cada estudiante.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Planes Personalizados</h5>
                                            <p className="text-muted mb-0">Creación y seguimiento de planes de entrenamiento adaptados específicamente a tus objetivos y nivel.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex align-items-start">
                                        <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Seguimiento 24/7</h5>
                                            <p className="text-muted mb-0">Monitoreo continuo de tu progreso con actualizaciones regulares y ajustes en tiempo real.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h5 className="fw-bold mb-3">¿Quieres acceder a la plataforma?</h5>
                                <p className="text-muted mb-4">
                                    Contacta con Eliseo para solicitar tu cuenta personalizada y comenzar tu entrenamiento digital.
                                </p>
                                <a href={whatsappLink} className="btn btn-primary-red btn-lg mb-3">
                                    <WhatsAppIcon className="whatsapp-icon-sm me-2" />
                                    Solicitar Cuenta
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="position-relative">
                                <img
                                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop&crop=center"
                                    alt="Plataforma de Gestión de Entrenamiento"
                                    className="img-fluid rounded-4 shadow"
                                />
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <div className="bg-white rounded-4 p-4 shadow">
                                        <div className="row g-3 text-center">
                                            <div className="col-6">
                                                <h6 className="fw-bold text-muted small">Planes Activos</h6>
                                                <span className="display-6 fw-bold text-danger">50+</span>
                                            </div>
                                            <div className="col-6">
                                                <h6 className="fw-bold text-muted small">Seguimiento</h6>
                                                <span className="display-6 fw-bold text-danger">100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="sobre-mi" className="py-6">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="position-relative about-image-responsive">
                                <img
                                    src={fotoPerfil}
                                    alt="Eliseo Lariguet - Sobre Mí"
                                    className="img-fluid rounded-4 shadow"
                                />
                                <div className="position-absolute bottom-0 end-0 m-4">
                                    <div className="bg-danger rounded-3 p-3 shadow d-flex align-items-center">
                                        <Award className="w-8 h-8 text-white me-3" />
                                        <div>
                                            <h6 className="fw-bold mb-0 text-white">Cinturón Negro</h6>
                                            <small className="text-white">Certificado</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <h2 className="display-5 fw-bold mb-3">
                                Sobre <span className="text-danger">Mí</span>
                            </h2>
                            <p className="fs-5 text-muted mb-4">
                                Más que un instructor, un mentor comprometido con tu crecimiento
                            </p>

                            <p className="fs-6 text-secondary mb-4 lh-base">
                                Soy Eliseo Lariguet, instructor profesional de karate con cinturón negro y experiencia
                                en defensa personal y entrenamiento de musculación. He trabajado en UP Fitness
                                desarrollando programas de entrenamiento especializados para diferentes objetivos.
                            </p>

                            <p className="fs-6 text-secondary mb-4 lh-base">
                                Mi enfoque se centra en la enseñanza técnica precisa y el desarrollo integral de cada
                                estudiante. Combino disciplinas tradicionales como el karate con metodologías modernas
                                de entrenamiento físico para lograr resultados óptimos.
                            </p>

                            <div className="row g-4 mb-5">
                                <div className="col-12">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-3 p-3 me-3">
                                            <Users className="w-6 h-6 text-danger" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Instructor Certificado</h6>
                                            <p className="text-muted small mb-0">Cinturón negro en Karate Shorin Ryu</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-3 p-3 me-3">
                                            <Dumbbell className="w-6 h-6 text-danger" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Experiencia en UP Fitness</h6>
                                            <p className="text-muted small mb-0">Entrenamiento de musculación especializado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="py-6 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">
                            Mis <span className="text-danger">Servicios</span>
                        </h2>
                        <p className="fs-5 text-muted">
                            Entrenamiento especializado adaptado a tus objetivos específicos
                        </p>
                    </div>

                    <div className="row g-4">
                        {services.map((service, index) => (
                            <div key={index} className="col-lg-4 col-md-6">
                                <div className="card card-executive h-100 border-0 rounded-4">
                                    <div className="position-relative overflow-hidden rounded-top-4" style={{height: '250px'}}>
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="card-img-top h-100 object-fit-cover"
                                        />
                                        <div className="position-absolute top-0 end-0 m-3">
                                            <div className="bg-danger rounded-3 p-2 text-white">
                                                {service.icon}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body p-4">
                                        <h5 className="card-title fw-bold mb-3">{service.title}</h5>
                                        <p className="card-text text-muted mb-4">{service.description}</p>

                                        <ul className="list-unstyled mb-4">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="d-flex align-items-center mb-2">
                                                    <CheckCircle className="w-4 h-4 text-danger me-2 flex-shrink-0" />
                                                    <span className="small text-secondary">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <a href={whatsappLink} className="btn btn-outline-red w-100">
                                            Más Información
                                            <ArrowRight className="w-4 h-4 ms-2" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-6" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h2 className="display-5 fw-bold text-white mb-3">
                                ¿Por qué <span className="text-danger">elegirme?</span>
                            </h2>
                            <p className="fs-5 text-white-50 mb-5">
                                Mi compromiso es brindarte la mejor experiencia de entrenamiento
                            </p>

                            <div className="row g-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="col-12">
                                        <div className="d-flex align-items-start">
                                            <div className="bg-danger rounded-3 p-3 me-3 flex-shrink-0">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <h6 className="fw-bold text-white mb-2">{benefit.title}</h6>
                                                <p className="text-white-50 mb-0">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 mb-3">
                                <a href={whatsappLink} className="btn btn-primary-red btn-lg">
                                    <WhatsAppIcon className="whatsapp-icon-sm me-2" />
                                    Empezar Ahora
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="position-relative text-center">
                                <div className="rounded-4 overflow-hidden shadow-lg">
                                    <video
                                        src={peleaEli}
                                        className="w-100 h-auto"
                                        controls
                                        poster={gifkata}
                                    >
                                        Tu navegador no soporta el elemento video.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Gallery Section */}
            <section className="py-6">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">
                            Galería de <span className="text-danger">Entrenamientos</span>
                        </h2>
                        <p className="fs-5 text-muted">
                            Mira nuestros entrenamientos en acción
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="gallery-item">
                                <img
                                    src={parado}
                                    alt="Entrenamiento de Defensa Personal"
                                    className="w-100 h-100 object-fit-cover"
                                    style={{height: '400px'}}
                                />
                                <div className="gallery-overlay">
                                    <h4 className="fw-bold mb-2">Defensa Personal</h4>
                                    <p className="mb-0">Técnicas efectivas</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="row g-4">
                                <div className="col-12">
                                    <div className="gallery-item">
                                        <img
                                            src={patada}
                                            alt="Karate Shorin Ryu"
                                            className="w-100 object-fit-cover"
                                            style={{height: '180px'}}
                                        />
                                        <div className="gallery-overlay">
                                            <h5 className="fw-bold">Karate</h5>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="gallery-item">
                                        <img
                                            src={eliseoQueli}
                                            alt="Fitness Personal"
                                            className="w-100 object-fit-cover"
                                            style={{height: '180px'}}
                                        />
                                        <div className="gallery-overlay">
                                            <h5 className="fw-bold">Fitness</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contacto" className="py-6 text-white" style={{background: 'var(--primary-red)'}}>
                <div className="container mt-3">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mb-5 mb-lg-0">
                            <h2 className="display-5 fw-bold mb-4">
                                ¿Listo para comenzar tu transformación?
                            </h2>
                            <p className="fs-5 mb-5 opacity-75">
                                Contáctame hoy mismo y da el primer paso hacia una versión más fuerte y segura de ti mismo.
                            </p>

                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-white bg-opacity-25 rounded-3 p-3 me-3 flex-shrink-0">
                                            <Phone className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Teléfono</h6>
                                            <p className="mb-0 opacity-75">+54 9 351 750 3115</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-white bg-opacity-25 rounded-3 p-3 me-3 flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Ubicación</h6>
                                            <p className="mb-0 opacity-75">Córdoba, Argentina</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-white bg-opacity-25 rounded-3 p-3 me-3 flex-shrink-0">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Horarios</h6>
                                            <p className="mb-0 opacity-75">Lunes a Sábado: 8:00 - 20:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 text-center">
                            <a href={whatsappLink} className="btn btn-light btn-lg w-100 fw-semibold py-3">
                                <WhatsAppIcon className="whatsapp-icon-sm me-2" />
                                Escribir por WhatsApp
                            </a>
                            <p className="mt-3 mb-0 opacity-75 small">
                                Respuesta garantizada en menos de 2 horas
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-5 text-white" style={{background: '#1a1a1a'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h4 className="fw-bold mb-2">Eliseo Lariguet</h4>
                            <p className="text-white-50 mb-0">Instructor profesional de defensa personal, karate y fitness</p>
                        </div>

                        <div className="col-lg-6 text-lg-end">
                            <div className="d-flex justify-content-lg-end justify-content-center gap-3">
                                <Shield className="w-6 h-6 text-danger" />
                                <Dumbbell className="w-6 h-6 text-danger" />
                                <Trophy className="w-6 h-6 text-danger" />
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" style={{borderColor: '#374151'}} />

                    <div className="text-center">
                        <p className="text-white-50 small mb-0">
                            &copy; 2025 Eliseo Lariguet. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href={whatsappLink}
                className="whatsapp-float"
                target="_blank"
                rel="noopener noreferrer"
            >
                <WhatsAppIcon className="whatsapp-icon" />
            </a>
        </div>
    );
};

export default LandingPage;