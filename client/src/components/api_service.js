import axios from 'axios';

const API = {
    //investment
    fetchInvestmentData: `/api/invest`,
    saveInvestmentData: `/api/invest/save`,

    //dividends
    fetchDividendsData: `/api/dividends`,
    saveDividendsData: `/api/dividends/save`,
}

const VOCABS_API = {
    fetchVocabs: `/api/vocabs`,
    saveVocabs: `/api/vocabs/save`,
    deleteVocabs: (id) => `/api/vocabs/delete/${id}`,
    tts: (id, text) => `/api/vocabs/tts?id=${id}&text=${text}`,
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

export const fetchVocabsData = async () => {
    try {
        const response = await axios.get(VOCABS_API.fetchVocabs);
        return response.data;
    } catch (error) {
        console.error("Error fetching vocabs data:", error);
        throw error;
    }
}
export const saveVocabsData = async (data) => {
    try {        
        const response = await axios.post(VOCABS_API.saveVocabs, data);
        return response.data;
    } catch (error) {
        console.error("Error saving vocabs data:", error);
        throw error;
    }
}
export const deleteVocabsData = async (id) => {
    try {        const response = await axios.delete(VOCABS_API.deleteVocabs(id));
        return response.data;
    } catch (error) {
        console.error("Error deleting vocabs data:", error);
        throw error;
    }
}
export const playTTSData = async (id, text, speed = 1.0) => {
    try {
        const response = await axios.get(VOCABS_API.tts(id, text), { responseType: 'blob' });
        const audioBlob = response.data;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // 오디오 재생이 완료될 때까지 기다리는 Promise 반환
        return new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl); // 메모리 해제
                resolve();
            };
            audio.onerror = (error) => {
                URL.revokeObjectURL(audioUrl);
                reject(error);
            };
            
            audio.playbackRate = speed; // 재생 속도 설정
            audio.play().catch(reject);
        });
    } catch (error) {
        console.error("Error playing TTS:", error);
        throw error;
    }
}
