document.addEventListener('DOMContentLoaded', async () => {

    // Check Auth State
    const user = await checkAuth();
    updateNavbar(user);

    if (user) {
        const aliasGroup = document.getElementById('customAliasGroup');
        if (aliasGroup) aliasGroup.classList.remove('hidden');
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (res.ok) {
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (err) {
                alert('An error occurred');
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (res.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (err) {
                alert('An error occurred');
            }
        });
    }

    // Shorten Form
    const shortenForm = document.getElementById('shortenForm');
    if (shortenForm) {
        shortenForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalUrl = document.getElementById('originalUrl').value;
            const customAlias = document.getElementById('customAlias') ? document.getElementById('customAlias').value : '';

            const loader = document.getElementById('loader');
            const resultCard = document.getElementById('resultCard');
            const btn = shortenForm.querySelector('button');

            loader.style.display = 'block';
            resultCard.style.display = 'none';
            btn.disabled = true;

            try {
                const res = await fetch('/api/shorten', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: originalUrl, customAlias })
                });
                const data = await res.json();

                if (res.ok) {
                    const shortUrl = document.getElementById('shortUrl');
                    // data.shortUrl might be relative or absolute. 
                    // Let's assume the API returns the full short URL or we construct it.
                    // The backend controller usually returns { shortUrl: ... }
                    // If it returns just code, we use window.location.origin

                    const fullUrl = data.shortUrl.startsWith('http') ? data.shortUrl : `${window.location.origin}/${data.shortCode}`;

                    // SAVE CURRENT CODE
                    currentShortCode = data.shortCode;

                    // Reset analytics view
                    document.getElementById('analyticsDisplay').style.display = 'none';

                    shortUrl.href = fullUrl;
                    shortUrl.innerText = fullUrl;
                    resultCard.style.display = 'block';
                } else {
                    alert(data.error || 'Shortening failed');
                }
            } catch (err) {
                alert('An error occurred');
            } finally {
                loader.style.display = 'none';
                btn.disabled = false;
            }
        });
    }
});

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
            const data = await res.json();
            return data.user;
        }
    } catch (e) {
        console.log('Not authenticated');
    }
    return null;
}

function updateNavbar(user) {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    if (user) {
        navLinks.innerHTML = `
            <span class="nav-item">Hi, ${user.username}</span>
            <a href="#" class="nav-item" onclick="logout()">Logout</a>
        `;
    } else {
        // Default is already there, but let's ensure it's correct if we reuse this page
        if (!navLinks.innerHTML.includes('Log In')) {
            navLinks.innerHTML = `
                <a href="login.html" class="nav-item">Log In</a>
                <a href="signup.html" class="nav-item btn-primary">Sign Up Free</a>
            `;
        }
    }
}

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = 'login.html';
}

let currentShortCode = '';

async function viewAnalytics() {
    if (!currentShortCode) return;

    const display = document.getElementById('analyticsDisplay');
    const lists = document.getElementById('analyticsLists');

    if (display.style.display === 'block') {
        display.style.display = 'none';
        return;
    }

    lists.innerHTML = '<p>Loading...</p>';
    display.style.display = 'block';

    try {
        const res = await fetch(`/api/analytics/${currentShortCode}`);
        if (res.ok) {
            const data = await res.json(); // Array of { timestamp, ip, userAgent, referer }

            if (data.length === 0) {
                lists.innerHTML = '<p style="opacity: 0.7;">No clicks recorded yet. Try visiting the short link!</p>';
                return;
            }

            lists.innerHTML = data.map(click => `
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; opacity: 0.7;">
                        <span>${new Date(click.timestamp).toLocaleString()}</span>
                        <span>${click.ip}</span>
                    </div>
                    <div style="font-size: 0.9rem; margin-top: 5px;">
                       ${click.userAgent}
                    </div>
                </div>
            `).join('');
        } else {
            lists.innerHTML = '<p>Failed to load analytics. You might need to login.</p>';
        }
    } catch (e) {
        console.error(e);
        lists.innerHTML = '<p>Error loading data.</p>';
    }
}

function copyToClipboard() {
    const text = document.getElementById('shortUrl').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}
