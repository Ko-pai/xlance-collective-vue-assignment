import { createRouter, createWebHistory } from "vue-router";
import Book from "@/views/book/book.vue";
import EditBook from "@/views/book/editBook.vue";
import AddBook from "@/views/book/addBook.vue";
import Author from "@/views/author/author.vue";
import AddAuthor from "@/views/author/addAuthor.vue";
import EditAuthor from "@/views/author/editAuthor.vue";
import Category from "@/views/category/category.vue";
import AddCategory from "@/views/category/addCategory.vue";
import EditCategory from "@/views/category/editCategory.vue";

const routes = [
  {
    path: "/",
    component: Book,
  },
  {
    path: "/books",
    name: "books",
    component: Book,
  },
  {
    path: "/addBook",
    name: "addBook",
    component: AddBook,
  },
  {
    path: "/books/:id/edit",
    name: "book-edit",
    component: EditBook,
  },
  {
    path: "/authors",
    name: "authors",
    component: Author,
  },
  {
    path: "/addAuthor",
    name: "addAuthor",
    component: AddAuthor,
  },
  {
    path: "/authors/:id/editAuthor",
    name: "author-edit",
    component: EditAuthor,
  },
  {
    path: "/categories",
    name: "categories",
    component: Category,
  },
  {
    path: "/addCategory",
    name: "addCategory",
    component: AddCategory,
  },
  {
    path: "/categories/:id/editCategory",
    name: "categories-edit",
    component: EditCategory,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
