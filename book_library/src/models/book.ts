export type BookStatus = "available" | "unavailable" | "borrowed";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  publishedYear?: number;
  imgUrl?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewBookInput = Omit<Book, "id" | "createdAt" | "updatedAt">;

export type UpdateBookInput = Partial<
  Omit<Book, "id" | "createdAt" | "updatedAt">
>;
