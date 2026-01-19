// API Types
export interface Domain {
    domain: string;
    display_name: string;
    document_count: number;
}

export interface ChatRequest {
    message: string;
    domain: string | null;
    conversation_id?: string;
}

export interface ChatResponse {
    response: string;
    sources: Source[];
    domain: string | null;
}

export interface Source {
    content?: string;
    index?: number;
}

export interface WelcomeResponse {
    message: string;
    available_domains: string[];
    suggestions: string[];
}

// API Base URL - use environment variable or default to localhost
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Fetch available domains from the backend
 */
export async function fetchDomains(): Promise<Domain[]> {
    const response = await fetch(`${API_BASE}/domains`);
    if (!response.ok) {
        throw new Error(`Failed to fetch domains: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Send a chat message and get a response
 */
export async function sendMessage(message: string, domain: string | null): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            domain,
        } as ChatRequest),
    });

    if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get welcome message and suggestions
 */
export async function getWelcome(): Promise<WelcomeResponse> {
    const response = await fetch(`${API_BASE}/welcome`);
    if (!response.ok) {
        throw new Error(`Failed to get welcome: ${response.statusText}`);
    }
    return response.json();
}

export interface SuggestionsResponse {
    domain: string;
    suggestions: string[];
}

/**
 * Fetch AI-generated suggested questions for a specific domain
 */
export async function fetchSuggestions(domain: string): Promise<SuggestionsResponse> {
    const response = await fetch(`${API_BASE}/suggestions/${encodeURIComponent(domain)}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
    }
    return response.json();
}

