import React, { useState } from 'react';
import { Item } from '../../types/Item';
import { ItemCard } from './ItemCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

interface ItemsListProps {
  items: Item[];
  onUpdate: (id: number, title: string, description: string) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  items,
  onUpdate,
  onDelete,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (isLoading) {
    return <div className="text-center py-8">Loading items...</div>;
  }

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
  });

  return (
    <div>
      {items.length > 0 ? (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            variant="outline"
            className="whitespace-nowrap"
          >
            Sort {sortOrder === 'asc' ? '↓' : '↑'}
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg w-full max-w-lg mx-auto">
          No items found. Add one above!
        </div>
      )}

      {sortedItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item) => (
            <div key={item.id} className="w-full min-w-[300px]">
              <ItemCard
                item={item}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg w-full max-w-lg mx-auto">
          No matching items found. Try a different search.
        </div>
      ) : null}
    </div>
  );
};
