import * as path from "path";

export default defineNuxtConfig({
    app: {
        head: {
          title: 'NKYC', // default fallback title
          htmlAttrs: {
            lang: 'en',
          },
          link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
          ]
        }
      },
      modules: [
        '@primevue/nuxt-module'
      ],
 
    css: ['@/assets/styles/tailwind.css', '@/assets/styles/base.css', '@/assets/styles/global.css'],
 
    primevue: {
        options: { theme: 'none',
           
         },
    },
    postcss: {
        plugins: {
            'postcss-import': {},
            tailwindcss: {},
            autoprefixer: {}
        }
    }
});
