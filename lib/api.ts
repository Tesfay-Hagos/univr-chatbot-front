// Admin API only – backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const ADMIN_BASE = `${API_BASE}/admin`;

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
  document_id?: string | null;
  title?: string | null;
}

export interface DocumentInfo {
  name: string;
  display_name: string;
  metadata?: Record<string, unknown>;
}

export interface DeleteAllStoresResponse {
  success: boolean;
  message: string;
  deleted: string[];
}

export interface CreateAllUlss9Response {
  success: boolean;
  message: string;
  stores: { domain: string; store_name: string }[];
}

export async function createDomain(
  domain: string,
  description: string = ''
): Promise<CreateStoreResponse> {
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

export async function listStores(): Promise<StoreInfo[]> {
  const response = await fetch(`${ADMIN_BASE}/stores`);
  if (!response.ok) {
    throw new Error(`Failed to list stores: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteDomain(domain: string): Promise<void> {
  const response = await fetch(`${ADMIN_BASE}/stores/${encodeURIComponent(domain)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to delete domain: ${response.statusText}`);
  }
}

export async function deleteAllStores(): Promise<DeleteAllStoresResponse> {
  const response = await fetch(`${ADMIN_BASE}/stores/delete-all`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to delete all stores: ${response.statusText}`);
  }
  return response.json();
}

export async function createAllUlss9Stores(): Promise<CreateAllUlss9Response> {
  const response = await fetch(`${ADMIN_BASE}/stores/ulss9/create-all`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to create ULSS 9 stores: ${response.statusText}`);
  }
  return response.json();
}

export async function uploadDocument(
  domain: string,
  file: File
): Promise<UploadResponse> {
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

export async function listDocuments(domain: string): Promise<DocumentInfo[]> {
  const response = await fetch(
    `${ADMIN_BASE}/stores/${encodeURIComponent(domain)}/documents`
  );
  if (!response.ok) {
    throw new Error(`Failed to list documents: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteDocument(
  domain: string,
  docName: string
): Promise<void> {
  const response = await fetch(
    `${ADMIN_BASE}/stores/${encodeURIComponent(domain)}/documents/${encodeURIComponent(docName)}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to delete document: ${response.statusText}`);
  }
}
