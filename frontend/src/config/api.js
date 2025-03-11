const API_URL = import.meta.env.PROD 
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000'
export default API_URL