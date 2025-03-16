
// replace with env variable
const API_URL = (process.env.apiURL) ? 'production.api.url.com' : '/api';


const API_ROUTES = {
    getCompanies: () => `${API_URL}/companies`,
    getAllSites: (companyID) => `${API_URL}/companies/${companyID}/sites`,

};

export default API_ROUTES;