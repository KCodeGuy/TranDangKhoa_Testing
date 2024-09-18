import axios from "axios";

import { Product } from "~/types/Product";
const API_PRODUCT_URL = "https://dummyjson.com/products";

export const getAllProducts = async (
  limitItems: number,
  skipItems: number
): Promise<Product[]> => {
  try {
    const res = await axios.get(
      `${API_PRODUCT_URL}?limit=${limitItems}&skip=${skipItems}`
    );
    return res.data.products;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Get all product failed!");
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const res = await axios.get(`${API_PRODUCT_URL}/search?q=${query}`);
    return res.data.products;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Search product failed!");
  }
};
