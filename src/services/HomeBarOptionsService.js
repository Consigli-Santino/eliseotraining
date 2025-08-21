class HomeBarOptionsService {
    optionsHomeBar = [
        {
            "icon": "house-fill",
            "name": "Inicio",
            "roles": ["alumno","superAdmin", "profesor"],
            "path": "/home"
        },
        {
            "icon": "calendar-check",
            "name": "Plan",
            "roles": ["alumno"],
            "path": "/planes"
        },
        {
            "icon": "clipboard-list",
            "name": "Lista Planes",
            "roles": ["profesor","superAdmin"],
            "path": "/planes"
        },
        {
            "icon": "people-fill",
            "name": "Usuarios",
            "roles": ["superAdmin"],
            "path": "/users"
        },
        {
            "icon": "person-badge",
            "name": "Alumnos",
            "roles": ["profesor"],
            "path": "/alumnos"
        }
    ]

    loadHomeBarOptionsBasedOnRole(roles) {
        if (!roles || (Array.isArray(roles) && roles.length === 0)) {
            return [];
        }
        if (Array.isArray(roles)) {
            return this.optionsHomeBar.filter(option => {
                return option.roles.some(role => roles.includes(role));
            });
        }
        else if (typeof roles === 'string') {
            return this.optionsHomeBar.filter(option => {
                return option.roles.includes(roles);
            });
        }

        return [];
    }

    getOptions(roles) {
        return this.loadHomeBarOptionsBasedOnRole(roles);
    }
}

export default new HomeBarOptionsService();