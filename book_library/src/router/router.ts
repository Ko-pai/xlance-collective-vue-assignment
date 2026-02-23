import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";

// import Home from "@/views/book_directory.vue";
import Book from "@/views/book/book.vue";
import EditBook from "@/views/book/editBook.vue";
import AddBook from "@/views/book/addBook.vue";
import Author from "@/views/author/author.vue";
import AddAuthor from "@/views/author/addAuthor.vue";

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
    path: "/categories",
    name: "categories",
    component: HelloWorld,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
