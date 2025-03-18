
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '../api/ItemsApi';
import { CreateItemDto, Item, UpdateItemDto } from '../types/Item';
import { useState, useEffect } from 'react';

type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useItems = () => {
  const queryClient = useQueryClient();
  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [initialized, setInitialized] = useState(false);

  const { 
    data: apiItems = [], 
    isLoading: isLoadingInitial, 
    error 
  } = useQuery({
    queryKey: ['items'],
    queryFn: itemsApi.getItems,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (apiItems.length > 0 && !initialized) {
      setLocalItems(apiItems);
      setInitialized(true);
    }
  }, [apiItems, initialized]);

  const createItem = (newItemDto: CreateItemDto) => {
    const maxId = localItems.length > 0 
      ? Math.max(...localItems.map(item => item.id)) 
      : 0;
    
    const newItem: Item = {
      id: maxId + 1,
      title: newItemDto.title,
      body: newItemDto.body
    };

    setLocalItems(prev => [...prev, newItem]);
    return Promise.resolve(newItem);
  };

  const createMutation = useMutation({
    mutationFn: (newItem: CreateItemDto) => {
      return createItem(newItem);
    },
    onSuccess: (newItem) => {
      queryClient.setQueryData(['items'], (oldData: Item[] = []) => [
        ...oldData,
        newItem
      ]);
    }
  });

  const updateItem = (id: number, updateItemDto: UpdateItemDto) => {
    const updatedItems = localItems.map(item =>
      item.id === id ? { ...item, ...updateItemDto } : item
    );
    
    setLocalItems(updatedItems);
    const updatedItem = updatedItems.find(item => item.id === id);
    return Promise.resolve(updatedItem as Item);
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, item }: { id: number; item: UpdateItemDto }) => {
      return updateItem(id, item);
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(['items'], (oldData: Item[] = []) =>
        oldData.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    }
  });

  const deleteItem = (id: number) => {
    const filteredItems = localItems.filter(item => item.id !== id);
    setLocalItems(filteredItems);
    return Promise.resolve();
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteItem(id);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(['items'], (oldData: Item[] = []) =>
        oldData.filter(item => item.id !== id)
      );
    }
  });

  const createItemWithCallbacks = (
    newItem: CreateItemDto,
    callbacks?: MutationCallbacks
  ) => {
    createMutation.mutate(newItem, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: () => callbacks?.onError?.()
    });
  };

  const updateItemWithCallbacks = (
    params: { id: number; item: UpdateItemDto },
    callbacks?: MutationCallbacks
  ) => {
    updateMutation.mutate(params, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: () => callbacks?.onError?.()
    });
  };

  const deleteItemWithCallbacks = (
    id: number,
    callbacks?: MutationCallbacks
  ) => {
    deleteMutation.mutate(id, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: () => callbacks?.onError?.()
    });
  };

  return {
    items: localItems,
    isLoading: isLoadingInitial && !initialized,
    error,
    createItem: createItemWithCallbacks,
    updateItem: updateItemWithCallbacks,
    deleteItem: deleteItemWithCallbacks,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};