'use client';

interface ThemeToggleProps {
    darkMode: boolean;
    onToggle: () => void;
    className?: string;
}

export default function ThemeToggle({ darkMode, onToggle, className = '' }: ThemeToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${className}`}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
        </button>
    );
}
