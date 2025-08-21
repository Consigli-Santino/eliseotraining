

class HomeBarOptionsService {
    optionsHomeBar = [
        {
            "icon": "house-fill",
            "name": "Inicio",
            "roles": ["alumno","superAdmin", "profesor"],
            "path": "/home"
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
            "icon": "user-plus",
            "name": "Alumnos",
            "roles": ["profesor"],
            "path": "/alumnos"
        },
        {
            "icon": "tags",
            "name": "Categorias",
            "roles": ["profesor","superAdmin"],
            "path": "/categories"
        },
        {
            "icon": "dumbbell",
            "name": "Ejercicios",
            "roles": ["profesor","superAdmin"],
            "path": "/exercises"
        },
        {
            "icon": "clipboard-check",
            "name": "Planes",
            "roles": ["profesor","superAdmin"],
            "path": "/planes"
        },
        {
            "icon": "calendar-check",
            "name": "Mi Plan",
            "roles": ["profesor","superAdmin","alumno"],
            "path": "/miplan"
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