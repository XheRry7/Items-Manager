export interface Item {
  id: number;
  title: string;
  body: string;
}

export interface CreateItemDto {
  title: string;
  body: string;
}

export interface UpdateItemDto {
  title?: string;
  body?: string;
}