import axios from 'axios';

const API = {
    fetchInvestmentData: `/api/invest`,
    saveInvestmentData: `/api/invest/save`,
}

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