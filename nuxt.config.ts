// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    // MONGO_URL: "mongodb://localhost:27017/nuxtTodo",
    MONGO_URL: "mongodb+srv://nuxt-todo:wxlLejhciXWTsawt@testingcluster.du1ivjj.mongodb.net/nuxtTodo?retryWrites=true&w=majority&appName=TestingCluster",
    JWT_SECRET: "PJoYpj9JVWXCbdonCZtrlZ7WzFfpppcHpoahby1jtglSzZaCTCrPAtFk0ovcuuUX",
    public: {
      COOKIE_NAME: "APP_TODO_TOKEN"
    },
  },

  build: {
      transpile: ['@vuepic/vue-datepicker']
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-icon"
  ]
  
})
