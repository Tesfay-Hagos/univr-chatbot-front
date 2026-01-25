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

// API Base URL - use environment variable or default to production backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://univr-chatbot-backend-1.onrender.com/api';

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

// ============ Admin API Types ============

export interface StoreInfo {
    domain: string;
    display_name: string;
    document_count: number;
}

export interface CreateStoreResponse {
    success: boolean;
    domain: string;
    store_name: string;
    message: string;
}

export interface UploadResponse {
    success: boolean;
    filename: string;
    domain: string;
    message: string;
}

export interface DocumentInfo {
    name: string;
    display_name: string;
    metadata?: Record<string, unknown>;
}

// ============ Admin API Functions ============

const ADMIN_BASE = `${API_BASE}/admin`;

/**
 * Create a new domain/store
 */
export async function createDomain(domain: string, description: string = ''): Promise<CreateStoreResponse> {
    const response = await fetch(`${ADMIN_BASE}/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, description }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to create domain: ${response.statusText}`);
    }
    return response.json();
}

/**
 * List all stores/domains (admin version with full info)
 */
export async function listStores(): Promise<StoreInfo[]> {
    const response = await fetch(`${ADMIN_BASE}/stores`);
    if (!response.ok) {
        throw new Error(`Failed to list stores: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Delete a domain/store
 */
export async function deleteDomain(domain: string): Promise<void> {
    const response = await fetch(`${ADMIN_BASE}/stores/${encodeURIComponent(domain)}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to delete domain: ${response.statusText}`);
    }
}

/**
 * Upload a document to a domain
 */
export async function uploadDocument(domain: string, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${ADMIN_BASE}/stores/${encodeURIComponent(domain)}/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to upload document: ${response.statusText}`);
    }
    return response.json();
}

/**
 * List documents in a domain
 */
export async function listDocuments(domain: string): Promise<DocumentInfo[]> {
    const response = await fetch(`${ADMIN_BASE}/stores/${encodeURIComponent(domain)}/documents`);
    if (!response.ok) {
        throw new Error(`Failed to list documents: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Delete a document from a domain
 */
export async function deleteDocument(domain: string, docName: string): Promise<void> {
    const response = await fetch(
        `${ADMIN_BASE}/stores/${encodeURIComponent(domain)}/documents/${encodeURIComponent(docName)}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to delete document: ${response.statusText}`);
    }
}
