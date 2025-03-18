import React from 'react';
import { ItemForm } from '../components/layouts/ItemForm';
import { ItemsList } from '../components/layouts/ItemsList';
import { useItems } from '../hooks/useItems';
import { useToast } from '../contexts/ToastContext';

export const HomePage: React.FC = () => {
  const {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isCreating,
  } = useItems();
  
  const { addToast } = useToast();

  const handleCreateItem = (title: string, body: string) => {
    createItem(
      { title, body },
      {
        onSuccess: () => {
          addToast('Item created successfully!', 'success');
        },
        onError: () => {
          addToast('Failed to create item', 'error');
        }
      }
    );
  };

  const handleUpdateItem = (id: number, title: string, body: string) => {
    updateItem(
      { id, item: { title, body } },
      {
        onSuccess: () => {
          addToast('Item updated successfully!', 'success');
        },
        onError: () => {
          addToast('Failed to update item', 'error');
        }
      }
    );
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(
        id,
        {
          onSuccess: () => {
            addToast('Item deleted successfully!', 'success');
          },
          onError: () => {
            addToast('Failed to delete item', 'error');
          }
        }
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Items Manager</h1>
        <p className="text-center text-gray-600 mt-2">
          Create, read, update, and delete items
        </p>
      </header>
      
      <ItemForm onSubmit={handleCreateItem} isCreating={isCreating} />
      
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          Error loading items: {(error as Error).message}
        </div>
      ) : null}
      
      <h2 className="text-xl font-semibold mb-4">Your Items</h2>
      
      <ItemsList
        items={items}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        isLoading={isLoading}
      />
    </div>
  );
};