const API_BASE_URL = 'http://localhost/Final_220Project/backend/api';

async function translateText(text, sourceLang, targetLang) {
    try {
        const response = await fetch(`${API_BASE_URL}/translate.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                sourceLang,
                targetLang
            })
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function register(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
} 