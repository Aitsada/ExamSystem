export default (_context, inject) => {
  inject('apiUrl', (path = '') => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    if (process.client && window.location?.hostname) {
      return `${window.location.protocol}//${window.location.hostname}:8005${normalizedPath}`
    }

    return `http://localhost:8005${normalizedPath}`
  })
}
