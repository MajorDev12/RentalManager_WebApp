export async function fetchData(endpoint, method = 'POST', data = {}) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined in environment variables.");
  }

  const url = `${API_BASE_URL}/${endpoint}`;

  const options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to ${method} data. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    throw error;
  }
}
