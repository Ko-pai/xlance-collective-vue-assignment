import type { Book, NewBookInput, UpdateBookInput } from "@/models/book";
import fetchBook from "../../book.json";

const STORAGE_KEY = "book-library:books";

function loadBooks(): Book[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const parsed = fetchBook as Book[];
    console.log(parsed);

    return Array.isArray(parsed) ? parsed : [];
  }
  try {
    const parsed = JSON.parse(raw) as Book[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBooks(books: Book[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export async function getBooks(): Promise<Book[]> {
  return loadBooks();
}

export async function getBookById(id: string): Promise<Book | null> {
  const books = loadBooks();
  return books.find((b) => b.id === id) ?? null;
}

export async function addBook(input: NewBookInput): Promise<Book> {
  const now = new Date().toISOString();
  const book: Book = {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };

  const books = loadBooks();
  books.push(book);
  saveBooks(books);

  return book;
}

export async function updateBook(
  id: string,
  changes: UpdateBookInput,
): Promise<Book | null> {
  const books = loadBooks();
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return null;
  }

  const current = books[index] as Book;

  const updated: Book = {
    id: current.id,
    title: changes.title ?? current.title,
    author: changes.author ?? current.author,
    category: changes.category ?? current.category,
    status: changes.status ?? current.status,
    imgUrl: changes.imgUrl ?? current.imgUrl,
    publishedYear: changes.publishedYear ?? current.publishedYear,
    summary: changes.summary ?? current.summary,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  books[index] = updated;
  saveBooks(books);

  return updated;
}

export async function deleteBook(id: string): Promise<void> {
  const books = loadBooks();
  const filtered = books.filter((b) => b.id !== id);
  saveBooks(filtered);
}
