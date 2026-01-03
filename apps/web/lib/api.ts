const API_BASE =
  process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path: string,
  options?: RequestInit
) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error('API error');
  }

  return res.json();
}
