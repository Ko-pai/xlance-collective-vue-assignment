import { createRouter, createWebHistory, RouterView } from "vue-router";
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
    redirect: "/books",
  },
  {
    path: "/books",
    component: RouterView,
    children: [
      {
        path: "",
        name: "books",
        component: Book,
      },
      {
        path: "add",
        name: "addBook",
        component: AddBook,
      },
      {
        path: ":id/edit",
        name: "book-edit",
        component: EditBook,
      },
    ],
  },
  {
    path: "/authors",
    component: RouterView,
    children: [
      {
        path: "",
        name: "authors",
        component: Author,
      },
      {
        path: "add",
        name: "addAuthor",
        component: AddAuthor,
      },
      {
        path: ":id/editAuthor",
        name: "author-edit",
        component: EditAuthor,
      },
    ],
  },
  {
    path: "/categories",
    component: RouterView,
    children: [
      {
        path: "",
        name: "categories",
        component: Category,
      },
      {
        path: "add",
        name: "addCategory",
        component: AddCategory,
      },
      {
        path: ":id/editCategory",
        name: "categories-edit",
        component: EditCategory,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
