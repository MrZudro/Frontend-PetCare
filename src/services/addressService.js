import api from './axiosConfig';

export const getCustomerAddresses = async (customerId) => {
    const response = await api.get(`/api/customers/${customerId}/addresses`);
    return response.data;
};

export const createAddress = async (customerId, addressData) => {
    const response = await api.post(`/api/customers/${customerId}/addresses`, addressData);
    return response.data;
};

export const updateAddress = async (addressId, addressData) => {
    const response = await api.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
};

export const deleteAddress = async (addressId) => {
    await api.delete(`/api/addresses/${addressId}`);
};

export const setDefaultAddress = async (customerId, addressId) => {
    const response = await api.put(`/api/customers/${customerId}/addresses/${addressId}/set-default`);
    return response.data;
};
