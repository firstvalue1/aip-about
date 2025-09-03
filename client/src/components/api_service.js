import axios from 'axios';

const API = {
    //investment
    fetchInvestmentData: `/api/invest`,
    saveInvestmentData: `/api/invest/save`,

    //dividends
    fetchDividendsData: `/api/dividends`,
    saveDividendsData: `/api/dividends/save`,
}


// investment
export const fetchInvestmentData = async () => {
    try {
        const response = await axios.get(API.fetchInvestmentData);
        return response.data;
    } catch (error) {
        console.error("Error fetching investment data:", error);
        throw error;
    }
}
export const saveInvestmentData = async (data) => {
    try {
        const response = await axios.post(API.saveInvestmentData, data);
        return response.data;
    } catch (error) {
        console.error("Error saving investment data:", error);
        throw error;
    }
}


// dividends
export const fetchDividendsData = async () => {
    try {
        const response = await axios.get(API.fetchDividendsData);
        return response.data;
    } catch (error) {
        console.error("Error fetching dividends data:", error);
        throw error;
    }
}
export const saveDividendsData = async (data) => {
    try {
        const response = await axios.post(API.saveDividendsData, data);
        return response.data;
    } catch (error) {
        console.error("Error saving dividends data:", error);
        throw error;
    }
}