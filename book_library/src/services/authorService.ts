import type {
  Author,
  NewAuthorInput,
  UpdateAuthorInput,
} from "@/models/author";
import { updateBooksAuthorName } from "@/services/bookService";
import { fetchAuthor } from "../constants/authors.constant";

const STORAGE_KEY = "author-data:authors";

function loadAuthor(): Author[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const parsed = fetchAuthor as Author[];

    return Array.isArray(parsed) ? parsed : [];
  }
  try {
    const parsed = JSON.parse(raw) as Author[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAuthor(author: Author[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(author));
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export async function getAuthor(): Promise<Author[]> {
  return loadAuthor();
}

export async function getAuthorsById(id: string): Promise<Author | null> {
  const author = loadAuthor();
  return author.find((a) => a.id === id) ?? null;
}

export async function addAuthor(input: NewAuthorInput): Promise<Author | null> {
  const now = new Date().toISOString();
  const author: Author = {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  const authors = loadAuthor();
  authors.push(author);
  saveAuthor(authors);

  return author;
}

export async function updateAuthor(
  id: string,
  changes: UpdateAuthorInput,
): Promise<Author | null> {
  const authors = loadAuthor();
  const index = authors.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const current = authors[index] as Author;

  const nextName = changes.name ?? current.name;

  const update: Author = {
    id: current.id,
    name: nextName,
    nationality: changes.nationality ?? current.nationality,
    bio: changes.bio ?? current.bio,
    imgUrl: changes.imgUrl ?? current.imgUrl,
    genre: changes.genre ?? current.genre,
    dateOfBirth: changes.dateOfBirth ?? current.dateOfBirth,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  authors[index] = update;
  saveAuthor(authors);
  if (nextName !== current.name) {
    await updateBooksAuthorName(current.name, nextName);
  }
  return update;
}

export async function deleteAuthor(id: string): Promise<void> {
  const authors = loadAuthor();
  const filtered = authors.filter((a) => a.id !== id);

  saveAuthor(filtered);
}
