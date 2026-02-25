export interface Author {
  id: string;
  name: string;
  nationality: string;
  imgUrl?: string;
  bio?: string;
  genre? : string;
  dateOfBirth? : string
  createdAt: string;
  updatedAt: string;
}

export type NewAuthorInput = Omit<Author, "id" | "createdAt" | "updatedAt">;

export type UpdateAuthorInput = Partial<
  Omit<Author, "id" | "createdAt" | "updatedAt">
>;
