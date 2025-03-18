import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/TextArea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';

interface ItemFormProps {
  onSubmit: (title: string, description: string) => void;
  isCreating: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, isCreating }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Card className="w-full mb-8 ">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Adding...' : 'Add Item'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};