import React, { useState } from 'react';
import { Item } from '../../types/Item';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/TextArea';

interface ItemCardProps {
  item: Item;
  onUpdate: (id: number, title: string, body: string) => void;
  onDelete: (id: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [body, setBody] = useState(item.body);

  const handleUpdate = () => {
    onUpdate(item.id, title, body);
    setIsEditing(false);
  };

  return (
    <Card className="w-full min-h-[350px] flex flex-col justify-between shadow-md">
      <CardHeader>
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
            placeholder="Title"
          />
        ) : (
          <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {isEditing ? (
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
            className="resize-none"
          />
        ) : (
          <p className="text-gray-700">{item.body}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-auto">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button variant="destructive" onClick={() => onDelete(item.id)}>
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
