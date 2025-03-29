
// replace with env variable
const API_URL = ( import.meta.env.VITE_API_URL ) ? import.meta.env.VITE_API_URL : 'http://localhost:3300';

const API_ROUTES = {
    getCompanies: () => `${API_URL}/companies`,
    getCompHistory: () => `${API_URL}/capture/compare/history`,
    getAllSites: (companyID) => `${API_URL}/companies/${companyID}/sites`,
    getAllSitePages: (companyID, siteID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages`,
    getPageSpecs: (companyID, siteID, pageID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages/${pageID}/specs`,
    getAvailableCaptures: (companyID, siteID) => `${API_URL}/capture/companies/${companyID}/sites/${siteID}/history`,
    getCaptureHistory: (groupID) => `${API_URL}/capture/history/${groupID}`,

    createNewCompany: () => `${API_URL}/companies`,
    createNewSite: (companyID) => `${API_URL}/companies/${companyID}/sites`,
    createNewPage: (companyID, siteID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages`,
    createNewPageSpec: (companyID, siteID, pageID) => `${API_URL}/companies/${companyID}/sites/${siteID}/pages/${pageID}/specs`,
    createNewCapture: () => `${API_URL}/capture/page`,
    createCompHistory: () => `${API_URL}/capture/compare/history`

};

export default API_ROUTES;