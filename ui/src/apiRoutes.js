
// replace with env variable
const API_URL = (process.env.apiURL) ? 'production.api.url.com' : '/api';


const API_ROUTES = {
    getCompanies: () => `${API_URL}/companies`,
    getCompHistory: () => `${API_URL}/capture/compare/history`,
    getAllSites: (companyID) => `${API_URL}/companies/${companyID}/sites`,
    getAllSitePages: (companyID, siteID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages`,
    getPageSpecs: (companyID, siteID, pageID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages/${pageID}/specs`,
    getAvailableCaptures: (companyID, siteID) => `${API_URL}/capture/companies/${companyID}/sites/${siteID}/history`,

    createNewCompany: () => `${API_URL}/companies`,
    createNewSite: (companyID) => `${API_URL}/companies/${companyID}/sites`,
    createNewPage: (companyID, siteID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages`,
    createNewPageSpec: (companyID, siteID, pageID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages/${pageID}/specs`,
    createNewCapture: () => `${API_URL}/capture/page`,
    createCompHistory: () => `${API_URL}/capture/compare/history`,


};

export default API_ROUTES;