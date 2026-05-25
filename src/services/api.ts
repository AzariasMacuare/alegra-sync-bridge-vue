import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
export const WSS_URL = import.meta.env.VITE_WSS_URL;


export const uploadInvoice = async (transactionId: string, file: File, description: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description);

  try {
    const response = await axios.post(`${API_URL}/ingest/${transactionId}`, formData);
    return response.data as string;
  } catch (error) {
    console.error("Error subiendo factura:",);
    throw error;
  }
};

export const preFlightRegisterTransactionId = async () => {
  try {
    const response = await axios.post(`${API_URL}/ingest/register`);
    return response.data as string;
  } catch (error) {
    console.error("Error pre-flight factura:");
    throw error;
  }
};

export const openNewSocket = () => {
  const socket = new WebSocket(WSS_URL)
  return socket

}