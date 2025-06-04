const isBrowser = typeof window !== 'undefined';

export class LocalStorage {
  // Get a value from local storage by key
  static get(key) {
    if (!isBrowser) return null;
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      return null;
    }
  }

  // Set a value in local storage by key
  static set(key, value) {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('LocalStorage set error:', err);
    }
  }

  // Remove a value from local storage by key
  static remove(key) {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('LocalStorage remove error:', err);
    }
  }

  // Clear all items from local storage
  static clear() {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (err) {
      console.error('LocalStorage clear error:', err);
    }
  }
}

export const requestHandler = async (api, setLoading, onSuccess, onError) => {
  setLoading && setLoading(true);
  try {
    const response = await api();
    const { data } = response;
    if (data?.success) {
      onSuccess(data);
    }
  } catch (error) {
    if ([401, 403].includes(error?.response?.data?.statusCode)) {
      LocalStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};