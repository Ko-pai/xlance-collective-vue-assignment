export interface Category {
  id: string;
  name: string;
  description?: string;
  activeStatus?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewCategoryInput = Omit<Category, "id" | "createdAt" | "updatedAt">;

export type UpdateCategoryInput = Partial<
  Omit<Category, "id" | "createdAt" | "updatedAt">
>;
