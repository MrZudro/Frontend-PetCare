import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bills';

export const createOrder = async (checkoutData) => {
    try {
        const response = await axios.post(`${API_URL}/checkout`, checkoutData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const getCustomerOrders = async (customerId) => {
    try {
        const response = await axios.get(`${API_URL}/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        throw error;
    }
};
