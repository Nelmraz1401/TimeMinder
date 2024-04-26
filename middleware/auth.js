export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig()

  if ( !useCookie(config.public.COOKIE_NAME).value ){
    return navigateTo('/signin');  
  }

});