// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) return // ✅ Runs only in browser

  const userkey = sessionStorage.getItem('userkey')

  // ✅ Force first visit after browser reopen to index page
  if (!sessionStorage.getItem('visitedOnce')) {
    sessionStorage.setItem('visitedOnce', 'true')
    if (to.path !== '/') {
      return navigateTo('/')
    }
  }

  // 🔒 Protect main page if not logged in
  if (to.path.startsWith('/main') && !userkey) {
    return navigateTo('/')
  }
})
