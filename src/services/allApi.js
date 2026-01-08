import commonAPI from "./commonAPI";
import { SERVER_URL } from "./serverUrl";

// adding products 
export const addProductAPI = async (product) => {
    return await commonAPI("POST", `${SERVER_URL}/products`, product);
}
//get all products
export const getAllProductsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/products`, "");
}
//get a product by id
export const getProductByIdAPI = async (id) => {
    return await commonAPI("GET", `${SERVER_URL}/products/${id}`, "");
}
//update products
export const updateProductAPI = async (id, product) => {
    return await commonAPI("PUT", `${SERVER_URL}/products/${id}`, product);
}
//delete products
export const deleteProductAPI = async (id) => {
    return await commonAPI("DELETE", `${SERVER_URL}/products/${id}`, {});
}

// Analytics preset data api
export const getAnalyticsAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}/analytics`, "");
}