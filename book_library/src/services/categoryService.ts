import type {
  Category,
  NewCategoryInput,
  UpdateCategoryInput,
} from "@/models/category";
import fetchCategory from "../../category.json";
import { updateBooksCategory } from "./bookService";

const STORAGE_KEY = "category-data:categories";

function loadCategories(): Category[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const parsed = fetchCategory as Category[];

    return Array.isArray(parsed) ? parsed : [];
  }
  try {
    const parsed = JSON.parse(raw) as Category[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCategory(author: Category[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(author));
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export async function getCategories(): Promise<Category[]> {
  const categories = loadCategories();
  return categories.filter((c) => c.activeStatus === true);
}

export async function getCategoriesById(id: string): Promise<Category | null> {
  const author = loadCategories();
  return author.find((a) => a.id === id) ?? null;
}

export async function addCategory(
  input: NewCategoryInput,
): Promise<Category | null> {
  const now = new Date().toISOString();
  const category: Category = {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  const categories = loadCategories();
  categories.push(category);
  saveCategory(categories);

  return category;
}

export async function updateCategory(
  id: string,
  changes: UpdateCategoryInput,
): Promise<Category | null> {
  const categories = loadCategories();
  const index = categories.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const current = categories[index] as Category;

  const nextName = changes.name ?? current.name;

  const update: Category = {
    id: current.id,
    name: nextName,
    description: changes.description ?? current.description,
    activeStatus: changes.activeStatus ?? current.activeStatus,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  categories[index] = update;
  saveCategory(categories);
  if (nextName !== current.name) {
    await updateBooksCategory(current.name, nextName);
  }
  return update;
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = loadCategories();
  const filtered = categories.filter((a) => a.id !== id);

  saveCategory(filtered);
}
