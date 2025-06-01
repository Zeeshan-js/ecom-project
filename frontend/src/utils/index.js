export const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

export class LocalStorage {
  // Get a value from local storage by key
  static get(key) {
    if (!isBrowser) return
    const value = localStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch (err) {
        return null
      }
    }
    return null
  }

  // Set a value in local storage by key
  static set(key, value) {
    if (!isBrowser) return
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Remove a value from local storage by key
  static remove(key) {
    if (!isBrowser) return
    localStorage.removeItem(key)
  }

  // Clear all items from local storage
  static clear() {
    if (!isBrowser) return
    localStorage.clear()
  }
}


export const requestHandler = async (api, setLoading, onSuccess, onError) => {
  setLoading && setLoading(true)
  try {
    const response = await api()
    const { data } = response
    if (data?.success) {
      onSuccess(data)
    }
  } catch (error) {
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear()
      if (isBrowser) window.location.href = "/login" 
    }
    onError(error?.response?.data?.message || "Something went wrong")
  } finally {
    setLoading && setLoading(false)
  }
}