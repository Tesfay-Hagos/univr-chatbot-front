'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminPanel from '@/components/AdminPanel';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  }, [darkMode]);

  return (
    <AdminPanel
      onBack={undefined}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  );
}
