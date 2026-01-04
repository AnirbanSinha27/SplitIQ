export const AUTH_API =
  process.env.NEXT_PUBLIC_AUTH_API;

export const GROUP_API =
  process.env.NEXT_PUBLIC_GROUP_API;

export const EXPENSE_API =
  process.env.NEXT_PUBLIC_EXPENSE_API;

export async function apiFetch<T>(
  baseUrl: string,
  path: string
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('API request failed');
  }

  return res.json();
}
