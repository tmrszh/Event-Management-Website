const API_URL = window.location.origin + '/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Tab switching (login / register)
window.switchTab = function(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const btnLogin = document.getElementById('btn-login');
    const btnReg = document.getElementById('btn-register');

    if (!loginForm || !regForm) return;

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        btnLogin.classList.add('active');
        btnReg.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        btnLogin.classList.remove('active');
        btnReg.classList.add('active');
    }
};

// --- Login ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                const userData = data.user || { name: 'User' };
                localStorage.setItem('user', JSON.stringify(userData));

                showToast('Welcome back!', 'success');
                loadDashboard();
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Server connection error', 'error');
        }
    });
}

// --- Register ---
const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (res.ok) {
                showToast('Account created! Please login.', 'success');
                window.switchTab('login');
                e.target.reset();
            } else {
                const data = await res.json();
                showToast(data.message || 'Error', 'error');
            }
        } catch (err) {
            showToast('Connection failed', 'error');
        }
    });
}

// --- Dashboard ---
function loadDashboard() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');

    if (authSection) authSection.classList.add('hidden');
    if (dashboardSection) dashboardSection.classList.remove('hidden');

    document.body.style.alignItems = 'flex-start';
    document.body.style.paddingTop = '0';

    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const nameEl = document.getElementById('user-name');
            if (nameEl) nameEl.textContent = user.name;
            const avatarEl = document.getElementById('user-avatar');
            if (avatarEl && user.name) avatarEl.textContent = user.name.charAt(0).toUpperCase();
        } catch (e) {
            console.error(e);
        }
    }

    fetchEvents();
    fetchQuote();
}

// --- Events ---

let allEvents = [];
let currentFilter = 'all';

function updateStats(events) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const total = events.length;
    const upcoming = events.filter(e => new Date(e.date) >= now).length;
    const past = events.filter(e => new Date(e.date) < now).length;

    const totalEl = document.getElementById('stat-total');
    const upcomingEl = document.getElementById('stat-upcoming');
    const pastEl = document.getElementById('stat-past');
    const nearestEl = document.getElementById('stat-nearest');

    if (totalEl) totalEl.textContent = total;
    if (upcomingEl) upcomingEl.textContent = upcoming;
    if (pastEl) pastEl.textContent = past;

    const futureEvents = events
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (nearestEl) {
        if (futureEvents.length > 0) {
            const daysUntil = Math.ceil((new Date(futureEvents[0].date) - now) / (1000 * 60 * 60 * 24));
            nearestEl.textContent = daysUntil === 0 ? 'Today!' : `${daysUntil}d`;
        } else {
            nearestEl.textContent = '—';
        }
    }
}

function renderEvents(events) {
    const list = document.getElementById('events-list');
    const emptyState = document.getElementById('empty-state');

    if (!list) return;
    list.innerHTML = '';

    if (events.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');

        events.forEach(event => {
            const div = document.createElement('div');
            div.className = 'event-card';
            const id = event._id || event.id;

            const eventDate = new Date(event.date);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const isPast = eventDate < now;

            div.innerHTML = `
                <div class="event-actions">
                    <i class="fa-solid fa-pen action-icon edit-icon" onclick="window.openEditModal('${id}')"></i>
                    <i class="fa-solid fa-trash action-icon delete-icon" onclick="window.deleteEvent('${id}')"></i>
                </div>
                <h4>${event.title || 'Untitled'}</h4>
                <div class="event-meta"><i class="fa-solid fa-calendar"></i> ${eventDate.toLocaleDateString()}</div>
                <div class="event-meta"><i class="fa-solid fa-location-dot"></i> ${event.location || '-'}</div>
                <p style="color:#666; margin-top:10px; font-size:0.9em;">${event.description || ''}</p>
                ${isPast
                    ? '<span style="display:inline-block; margin-top:10px; font-size:0.75rem; background:#F2F0E9; color:#848484; padding:4px 10px; border-radius:20px;">Past</span>'
                    : '<span style="display:inline-block; margin-top:10px; font-size:0.75rem; background:#ECFDF5; color:#10B981; padding:4px 10px; border-radius:20px;">Upcoming</span>'}
            `;
            list.appendChild(div);
        });
    }
}

function applyFilters() {
    const searchTerm = (document.getElementById('search-input')?.value || '').toLowerCase();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let filtered = allEvents;

    if (currentFilter === 'upcoming') {
        filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (currentFilter === 'past') {
        filtered = filtered.filter(e => new Date(e.date) < now);
    }

    if (searchTerm) {
        filtered = filtered.filter(e =>
            (e.title || '').toLowerCase().includes(searchTerm) ||
            (e.location || '').toLowerCase().includes(searchTerm) ||
            (e.description || '').toLowerCase().includes(searchTerm)
        );
    }

    renderEvents(filtered);
}

async function fetchEvents() {
    try {
        const res = await fetch(`${API_URL}/events`, {
            headers: getAuthHeaders()
        });

        if (res.status === 401) {
            showToast('Session expired. Please re-login.', 'error');
            return;
        }

        const data = await res.json();
        allEvents = Array.isArray(data) ? data : (data.events || []);

        updateStats(allEvents);
        applyFilters();
    } catch (err) {
        console.error('Fetch events error:', err);
    }
}

// Search
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
}

// Filter pills
document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        applyFilters();
    });
});

// Create event
const eventForm = document.getElementById('event-form');
if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('event-title').value;
        const location = document.getElementById('event-location').value;
        const date = document.getElementById('event-date').value;
        const description = document.getElementById('event-desc').value;

        try {
            const res = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ title, location, date, description })
            });

            if (res.ok) {
                showToast('Event added!', 'success');
                e.target.reset();
                fetchEvents();
            } else {
                const err = await res.json();
                showToast(err.message || 'Error adding event', 'error');
            }
        } catch (err) {
            showToast('Connection failed', 'error');
        }
    });
}

// Delete event
window.deleteEvent = async function(id) {
    if (!confirm('Delete this event?')) return;
    try {
        const res = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (res.ok) {
            showToast('Deleted', 'success');
            fetchEvents();
        } else {
            showToast('Error deleting', 'error');
        }
    } catch (err) {
        console.error(err);
    }
};

// Open edit modal
window.openEditModal = async function(id) {
    try {
        const res = await fetch(`${API_URL}/events/${id}`, {
            headers: getAuthHeaders()
        });
        const event = await res.json();

        if (!event) throw new Error('No event data');

        document.getElementById('edit-id').value = event._id || event.id || id;
        document.getElementById('edit-title').value = event.title || '';
        document.getElementById('edit-location').value = event.location || '';
        document.getElementById('edit-desc').value = event.description || '';

        if (event.date) {
            document.getElementById('edit-date').value = new Date(event.date).toISOString().split('T')[0];
        }

        const modal = document.getElementById('edit-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    } catch (err) {
        console.error('Edit load error:', err);
        showToast('Error loading details', 'error');
    }
};

// Save edit
const editForm = document.getElementById('edit-form');
if (editForm) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const updated = {
            title: document.getElementById('edit-title').value,
            location: document.getElementById('edit-location').value,
            date: document.getElementById('edit-date').value,
            description: document.getElementById('edit-desc').value
        };

        try {
            const res = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updated)
            });

            if (res.ok) {
                showToast('Updated successfully', 'success');
                window.closeModal('edit-modal');
                fetchEvents();
            } else {
                showToast('Update failed', 'error');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

// --- Modals & Utils ---

window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
};

window.openProfileModal = function() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';

    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

// --- Profile Update ---
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;

        try {
            const res = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ name, email })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));

                const nameEl = document.getElementById('user-name');
                if (nameEl) nameEl.textContent = updatedUser.name;
                const avatarEl = document.getElementById('user-avatar');
                if (avatarEl) avatarEl.textContent = updatedUser.name.charAt(0).toUpperCase();

                showToast('Profile updated!', 'success');
                window.closeModal('profile-modal');
            } else {
                const err = await res.json();
                showToast(err.message || 'Update failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Connection error', 'error');
        }
    });
}

// --- External API: Quotes ---
async function fetchQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    if (!quoteText) return;

    try {
        const apiKey = 'j3pwkd6bdjjLWiBYOskCn5LovzkSWlN9uN1bkxOo';
        const res = await fetch('https://api.api-ninjas.com/v1/quotes', {
            headers: { 'X-Api-Key': apiKey }
        });
        if (!res.ok) throw new Error('API fail');

        const data = await res.json();
        if (data && data[0]) {
            quoteText.textContent = `"${data[0].quote}"`;
            quoteAuthor.textContent = `— ${data[0].author}`;
        }
    } catch (e) {
        quoteText.textContent = 'Collect moments, not things.';
        quoteAuthor.textContent = '— Unknown';
    }
}

// --- Init ---
if (localStorage.getItem('token')) {
    loadDashboard();
}
