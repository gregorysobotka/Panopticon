
// replace with env variable
const API_URL = (process.env.apiURL) ? 'production.api.url.com' : '/api';


const API_ROUTES = {
    getCompanies: () => `${API_URL}/companies`,
    getAllSites: (companyID) => `${API_URL}/companies/${companyID}/sites`,
    getAllSitePages: (companyID, siteID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages`,
    getPageSpecs: (companyID, siteID, pageID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages/${pageID}/specs`,

};

export default API_ROUTES;