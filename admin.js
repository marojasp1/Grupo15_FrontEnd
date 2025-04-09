/ Script para el panel de administración

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes de la interfaz de administración
    initAdminUI();

    // Cargar datos de usuarios en tabla
    if (document.querySelector('.data-table')) {
        loadTableData();
    }

    // Formulario para agregar usuarios
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addUser();
        });
    }

    // Evento para mostrar modal de agregar usuario
    const addUserBtn = document.querySelector('.add-new');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showModal('addUserModal');
        });
    }

    // Evento para cerrar modal
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });

    // Evento para buscar en tabla
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('keyup', function() {
            searchTable(this.value);
        });
    }

    // Evento para cerrar sesión
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout-btn')) {
            e.preventDefault();
            logout();
        }
    });
});

// Inicializar la interfaz de administración
function initAdminUI() {
    // Mostrar nombre de usuario y avatar
    const currentUser = getCurrentUser();
    if (currentUser) {
        // Actualizar avatar y nombre en la interfaz
        const profileName = document.querySelector('.admin-profile span');
        if (profileName) {
            profileName.textContent = currentUser.firstName;
        }

        // Actualizar avatar con iniciales si no hay imagen
        const avatarElement = document.querySelector('.admin-avatar');
        if (avatarElement && !avatarElement.querySelector('img').src) {
            const initials = getInitials(currentUser.firstName, currentUser.lastName);
            avatarElement.innerHTML = `<div class="avatar-initials">${initials}</div>`;
        }
    }

    // Marcar página activa en el sidebar
    markActivePage();
}

// Marcar la página activa en el menú lateral
function markActivePage() {
    const currentPage = window.location.pathname.split('/').pop();
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

// Cargar datos en la tabla
function loadTableData() {
    // Obtener datos de usuarios (en una aplicación real esto vendría del servidor)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.querySelector('.data-table tbody');

    if (!tableBody) return;

    // Limpiar tabla
    tableBody.innerHTML = '';

    // Agregar filas con los datos
    users.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role === 'admin' ? 'admin' : 'viewer'}">${user.role === 'admin' ? 'Admin' : 'Visualizador'}</span></td>
            <td><span class="badge badge-active">Activo</span></td>
            <td class="actions">
                <button class="btn-icon btn-edit" data-id="${user.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" data-id="${user.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Agregar eventos a los botones de acción
    addTableActionListeners();
}

// Agregar eventos a los botones de acción de la tabla
function addTableActionListeners() {
    // Botones de editar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.dataset.id;
            editUser(userId);
        });
    });

    // Botones de eliminar
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.dataset.id;
            deleteUser(userId);
        });
    });
}

// Función para filtrar/buscar en la tabla
function searchTable(query) {
    const filterValue = query.toLowerCase();
    const rows = document.querySelectorAll('.data-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(filterValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Funciones para gestión de usuarios

// Agregar nuevo usuario
function addUser() {
    const userName = document.getElementById('user-name').value;
    const userEmail = document.getElementById('user-email').value;
    const userRole = document.getElementById('user-role').value;
    const userPassword = document.getElementById('user-password').value;
    const userStatus = document.getElementById('user-status').value;

    // Validación básica
    if (!userName || !userEmail || !userRole || !userPassword) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }

    // Verificar email único
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === userEmail)) {
        showNotification('Este correo electrónico ya está registrado', 'error');
        return;
    }

    // Separar nombre y apellido
    const nameParts = userName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    // Crear nuevo usuario
    const newUser = {
        id: generateUserId(),
        firstName: firstName,
        lastName: lastName || '',
        email: userEmail,
        password: userPassword,
        role: userRole,
        status: userStatus,
        createdAt: new Date().toISOString()
    };

    // Agregar a la lista
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Actualizar tabla
    loadTableData();

    // Cerrar modal
    closeModal('addUserModal');

    // Mostrar mensaje
    showNotification('Usuario creado correctamente');

    // Reiniciar formulario
    document.getElementById('addUserForm').reset();
}

// Editar usuario
function editUser(userId) {
    // En una aplicación real, aquí se cargarían los datos del usuario y se abriría un modal
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);

    if (!user) {
        showNotification('Usuario no encontrado', 'error');
        return;
    }

    // Esta es una versión simplificada para la demo
    showNotification('Funcionalidad de editar usuario no implementada en esta demo');
}

// Eliminar usuario
function deleteUser(userId) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        // Obtener usuarios
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // Filtrar para eliminar el usuario
        users = users.filter(user => user.id !== userId);

        // Guardar cambios
        localStorage.setItem('users', JSON.stringify(users));

        // Actualizar tabla
        loadTableData();

        // Mostrar mensaje
        showNotification('Usuario eliminado correctamente');
    }
}

// Funciones para modales

// Mostrar modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cerrar modales al hacer clic fuera de ellos
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Funciones de utilidad

// Obtener iniciales de un nombre
function getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
}