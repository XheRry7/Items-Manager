import axios from 'axios';
import { Item, CreateItemDto, UpdateItemDto } from '../types/Item';

const API_URL = 'https://jsonplaceholder.typicode.com';

export const itemsApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await axios.get<Item[]>(`${API_URL}/posts`);
    return response.data.slice(0, 10).map(post => ({
      id: post.id,
      title: post.title,
      body: post.body
    }));
  },

  createItem: async (item: CreateItemDto): Promise<Item> => {
    const response = await axios.post<Item>(`${API_URL}/posts`, item);
    return {
      ...response.data,
      body: response.data.body || item.body
    };
  },

  updateItem: async (id: number, item: UpdateItemDto): Promise<Item> => {
    const response = await axios.patch<Item>(`${API_URL}/posts/${id}`, item);
    return {
      ...response.data,
      body: response.data.body || item.body || ''
    };
  },

  deleteItem: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/posts/${id}`);
  }
};