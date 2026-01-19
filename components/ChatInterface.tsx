'use client';

import { ChatResponse, sendMessage, Source, fetchSuggestions } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    sources?: Source[];
    timestamp: Date;
}

interface ChatInterfaceProps {
    domain: {
        domain: string;
        display_name: string;
    };
    onSwitchDomain: () => void;
}

export default function ChatInterface({ domain, onSwitchDomain }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark' ||
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    // Add welcome message and fetch suggestions
    useEffect(() => {
        const welcomeMessage: Message = {
            id: 'welcome',
            content: `👋 Welcome! I'm your AI assistant for **${domain.display_name || domain.domain}**.\n\nAsk me anything related to this topic, or click one of the suggested questions below.`,
            sender: 'bot',
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);

        // Fetch AI-generated suggestions for this domain
        const loadSuggestions = async () => {
            setLoadingSuggestions(true);
            try {
                const result = await fetchSuggestions(domain.domain);
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error('Failed to load suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        };
        loadSuggestions();
    }, [domain]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newMode);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        // Clear suggestions after selecting one
        setSuggestions([]);
        // Auto-submit
        handleSubmitMessage(suggestion);
    };

    const handleSubmitMessage = async (messageText: string) => {
        const message = messageText.trim();
        if (!message || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: message,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setSuggestions([]);  // Hide suggestions after sending

        try {
            const response: ChatResponse = await sendMessage(message, domain.domain);

            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                content: response.response,
                sender: 'bot',
                sources: response.sources,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                content: '❌ Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        handleSubmitMessage(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const formatMessage = (text: string) => {
        return text
            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-univr-red dark:text-univr-red-light">$1</strong>')
            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Line breaks
            .replace(/\n/g, '<br>');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl animate-float">🎓</span>
                        <div>
                            <h1 className="font-semibold text-slate-800 dark:text-white capitalize">
                                {domain.display_name || domain.domain}
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">UniVR Chatbot</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Toggle theme"
                        >
                            <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
                        </button>

                        {/* Switch domain button */}
                        <button
                            onClick={onSwitchDomain}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 
                         text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium 
                         transition-all hover:scale-105"
                        >
                            Switch Domain
                        </button>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 animate-slide-up ${message.sender === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            {/* Avatar */}
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md
                ${message.sender === 'user'
                                    ? 'bg-gradient-to-br from-univr-red to-univr-red-dark text-white'
                                    : 'glass-panel'
                                }
              `}>
                                <span className="text-lg">{message.sender === 'user' ? '👤' : '🤖'}</span>
                            </div>

                            {/* Message content */}
                            <div className={`
                max-w-[80%] rounded-2xl px-5 py-3 shadow-md
                ${message.sender === 'user'
                                    ? 'bg-gradient-to-br from-univr-red to-univr-red-dark text-white'
                                    : 'glass-panel text-slate-800 dark:text-slate-200'
                                }
              `}>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                                />

                                {/* Sources */}
                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-slate-300/30 dark:border-slate-600/30">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                            📚 Sources ({message.sources.length})
                                        </p>
                                        <div className="space-y-1">
                                            {message.sources.slice(0, 3).map((source, i) => (
                                                <div
                                                    key={i}
                                                    className="text-xs bg-slate-200/50 dark:bg-slate-700/50 rounded px-2 py-1 truncate"
                                                >
                                                    {source.content || `Source ${source.index || i + 1}`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <div className="flex gap-3 animate-slide-up">
                            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center shadow-md">
                                <span className="text-lg">🤖</span>
                            </div>
                            <div className="glass-panel rounded-2xl px-5 py-4 shadow-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Suggested questions */}
                    {suggestions.length > 0 && !isLoading && (
                        <div className="mt-4 animate-slide-up">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">💡 Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 
                                                 dark:border-slate-700 rounded-full hover:border-univr-red 
                                                 dark:hover:border-univr-red-light hover:bg-slate-50 
                                                 dark:hover:bg-slate-700 transition-all hover:scale-105
                                                 text-slate-700 dark:text-slate-300 shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Loading suggestions indicator */}
                    {loadingSuggestions && (
                        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                            ✨ Generating suggested questions...
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input */}
            <footer className="sticky bottom-0 glass-panel border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-4">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-lg border border-slate-200 dark:border-slate-700">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask about ${domain.display_name || domain.domain}...`}
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 resize-none bg-transparent px-3 py-2 text-slate-800 dark:text-white
                         placeholder-slate-400 focus:outline-none max-h-32"
                            style={{ minHeight: '44px' }}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="p-3 bg-gradient-to-br from-univr-red to-univr-red-dark text-white rounded-xl
                         hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">
                        Powered by <span className="text-univr-red font-medium">Gemini AI</span> with RAG
                    </p>
                </form>
            </footer>
        </div>
    );
}
