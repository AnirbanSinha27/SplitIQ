export const AUTH_API =
  process.env.NEXT_PUBLIC_AUTH_API;

export const GROUP_API =
  process.env.NEXT_PUBLIC_GROUP_API;

export const EXPENSE_API =
  process.env.NEXT_PUBLIC_EXPENSE_API;

export async function apiFetch<T>(
    baseUrl: string,
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const makeRequest = () =>
      fetch(`${baseUrl}${path}`, {
        credentials: 'include',
        ...options,
      });
  
    let res = await makeRequest();
  
    // 🔁 Access token expired → try refresh once
    if (res.status === 401) {
      const refreshRes = await fetch(
        `${AUTH_API}/refresh`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
  
      if (refreshRes.ok) {
        res = await makeRequest();
      }
    }
  
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'API request failed');
    }
  
    return res.json();
  }