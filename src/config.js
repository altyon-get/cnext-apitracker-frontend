const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000'
};
console.log('Environment Variables:', JSON.stringify(process.env, null, 2));
export default config;