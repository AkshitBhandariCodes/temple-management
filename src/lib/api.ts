const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken(): string | null {
	return localStorage.getItem('temple_token');
}

export async function api(path: string, options: RequestInit = {}) {
	const headers = new Headers(options.headers);
	headers.set('Content-Type', 'application/json');
	const token = getToken();
	if (token) headers.set('Authorization', `Bearer ${token}`);

	const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
	let json: any = null;
	try { json = await res.json(); } catch {}
	if (!res.ok) {
		throw new Error((json && (json.message || json.error)) || 'Request failed');
	}
	return json;
}

export async function loginApi(email: string, password: string) {
	return api('/users/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
}

export async function registerApi(payload: Record<string, any>) {
	return api('/users/register', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

export async function meApi() {
	return api('/users/me');
}


