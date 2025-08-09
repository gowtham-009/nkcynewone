import { ref, onMounted } from 'vue';

export function useDarkMode() {
  const isDark = ref(true);

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    if (process.client) {
      sessionStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    }
  };

  onMounted(() => {
    if (process.client) {
      const savedTheme = sessionStorage.getItem('theme');
      isDark.value = savedTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark.value);
    }
  });

  return { isDark, toggleDarkMode };
}
