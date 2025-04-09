// Script para manejo de autenticación

document.addEventListener('DOMContentLoaded', function() {
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Validación simple
            if (!email || !password) {
                showNotification('Por favor complete todos los campos', 'error');
                return;
            }

            // Simulación de login
            login(email, password);
        });
    }

    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAgreed = document.getElementById('terms').checked;

            // Validación simple
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Por favor complete todos los campos', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }

            if (!termsAgreed) {
                showNotification('Debe aceptar los términos de servicio', 'error');
                return;
            }

            // Simulación de registro
            register({
                firstName,
                lastName,
                email,
                password
            });
        });
    }
});

// Funciones de autenticación

// Simulación de login
function login(email, password) {
    // Mostrar cargando
    showLoading();

    // Simular petición al servidor
    setTimeout(() => {
        hideLoading();

        // Verificar credenciales (simulación)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Usuario encontrado
            const currentUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role || 'viewer'
            };

            // Guardar sesión
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Mostrar mensaje
            showNotification('Inicio de sesión exitoso');

            // Redireccionar según rol
            setTimeout(() => {
                if (currentUser.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'viewer-dashboard.html';
                }
            }, 1000);
        } else {
            // Usuario no encontrado
            showNotification('Credenciales inválidas', 'error');
        }
    }, 1500);
}

// Simulación de registro
function register(userData) {
    // Mostrar cargando
    showLoading();

    // Simular petición al servidor
    setTimeout(() => {
        hideLoading();

        // Obtener usuarios actuales
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Verificar si el email ya existe
        if (users.some(user => user.email === userData.email)) {
            showNotification('El correo electrónico ya está registrado', 'error');
            return;
        }

        // Agregar nuevo usuario (en aplicación real esto sería manejado por el servidor)
        const newUser = {
            id: generateUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password, // Nota: en una aplicación real nunca almacenar contraseñas en texto plano
            role: 'viewer', // Por defecto los nuevos usuarios son visualizadores
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Mostrar mensaje
        showNotification('Registro exitoso. Ahora puede iniciar sesión.');

        // Redireccionar al login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1500);
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

// Obtener usuario actual
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Verificar si el usuario tiene rol de administrador
function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.role === 'admin';
}

// Generar ID único para usuario
function generateUserId() {
    return Date.now().toString();
}

// Funciones de utilidad para la UI

// Mostrar indicador de carga
function showLoading() {
    // Verificar si ya existe
    if (document.querySelector('.loading-overlay')) return;

    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    // Prevenir scroll
    document.body.style.overflow = 'hidden';
}

// Ocultar indicador de carga
function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
        document.body.style.overflow = '';
    }
}

// Inicializar datos de muestra (para demo)
function initSampleData() {
    // Verificar si ya existen datos
    if (localStorage.getItem('dataInitialized')) return;

    // Usuarios de muestra
    const sampleUsers = [
        {
            id: '001',
            firstName: 'Admin',
            lastName: 'Usuario',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        },
        {
            id: '002',
            firstName: 'Usuario',
            lastName: 'Prueba',
            email: 'user@example.com',
            password: 'user123',
            role: 'viewer',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('users', JSON.stringify(sampleUsers));
    localStorage.setItem('dataInitialized', 'true');
}

// Inicializar datos de muestra al cargar la página
document.addEventListener('DOMContentLoaded', initSampleData);

// Protección de rutas
document.addEventListener('DOMContentLoaded', function() {
    // Páginas que requieren autenticación
    const authRequiredPages = [
        'admin-dashboard.html',
        'admin-users.html',
        'admin-services.html',
        'viewer-dashboard.html'
    ];

    // Páginas exclusivas para admin
    const adminOnlyPages = [
        'admin-dashboard.html',
        'admin-users.html',
        'admin-services.html'
    ];

    // Obtener la página actual
    const currentPage = window.location.pathname.split('/').pop();

    // Verificar si la página requiere autenticación
    if (authRequiredPages.includes(currentPage)) {
        if (!isAuthenticated()) {
            // Redirigir a login
            window.location.href = 'login.html';
            return;
        }

        // Verificar si es página de admin
        if (adminOnlyPages.includes(currentPage) && !isAdmin()) {
            // Redirigir a dashboard de visualizador
            window.location.href = 'viewer-dashboard.html';
            return;
        }
    }
});