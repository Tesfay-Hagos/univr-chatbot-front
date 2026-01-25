'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    StoreInfo,
    DocumentInfo,
    listStores,
    createDomain,
    deleteDomain,
    uploadDocument,
    listDocuments,
    deleteDocument
} from '@/lib/api';
import ThemeToggle from './ThemeToggle';

interface AdminPanelProps {
    onBack: () => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

type Tab = 'domains' | 'upload';

export default function AdminPanel({ onBack, darkMode, onToggleDarkMode }: AdminPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('domains');
    const [stores, setStores] = useState<StoreInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Domain creation form
    const [newDomain, setNewDomain] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [creating, setCreating] = useState(false);

    // File upload
    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // Load stores
    const loadStores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listStores();
            setStores(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load stores');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load documents for selected domain
    const loadDocuments = useCallback(async () => {
        if (!selectedDomain) {
            setDocuments([]);
            return;
        }
        setLoadingDocs(true);
        try {
            const docs = await listDocuments(selectedDomain);
            setDocuments(docs);
        } catch (err) {
            console.error('Failed to load documents:', err);
            setDocuments([]);
        } finally {
            setLoadingDocs(false);
        }
    }, [selectedDomain]);

    // Load stores on mount
    useEffect(() => {
        loadStores();
    }, [loadStores]);

    // Set initial selected domain when stores are loaded
    useEffect(() => {
        if (stores.length > 0 && !selectedDomain) {
            setSelectedDomain(stores[0].domain);
        }
    }, [stores, selectedDomain]);

    // Load documents when domain is selected
    useEffect(() => {
        if (selectedDomain) {
            loadDocuments();
        }
    }, [selectedDomain, loadDocuments]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // Handle domain creation
    const handleCreateDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain.trim()) return;

        setCreating(true);
        setError(null);
        try {
            await createDomain(newDomain.trim(), newDescription.trim());
            setSuccess(`Domain "${newDomain}" created successfully!`);
            setNewDomain('');
            setNewDescription('');
            await loadStores();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create domain');
        } finally {
            setCreating(false);
        }
    };

    // Handle domain deletion
    const handleDeleteDomain = async (domain: string) => {
        if (!confirm(`Are you sure you want to delete the domain "${domain}"? This will delete all documents.`)) {
            return;
        }

        setError(null);
        const wasSelected = selectedDomain === domain;
        try {
            await deleteDomain(domain);
            setSuccess(`Domain "${domain}" deleted successfully!`);
            if (wasSelected) {
                setSelectedDomain('');
            }
            await loadStores();
            // After reloading, if the deleted domain was selected and there are other domains,
            // the useEffect will automatically select the first one
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete domain');
        }
    };

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !selectedDomain) return;

        setUploading(true);
        setError(null);
        try {
            for (const file of Array.from(files)) {
                await uploadDocument(selectedDomain, file);
            }
            setSuccess(`File(s) uploaded successfully to "${selectedDomain}"!`);
            await loadDocuments();
            await loadStores(); // Refresh document count
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset file input
        }
    };

    // Handle document deletion
    const handleDeleteDocument = async (docName: string) => {
        if (!confirm(`Are you sure you want to delete "${docName}"?`)) return;

        setError(null);
        try {
            await deleteDocument(selectedDomain, docName);
            setSuccess(`Document deleted successfully!`);
            await loadDocuments();
            await loadStores();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete document');
        }
    };

    // Handle drag and drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        if (!selectedDomain) {
            setError('Please select a domain first');
            return;
        }

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        setUploading(true);
        setError(null);
        try {
            for (const file of Array.from(files)) {
                await uploadDocument(selectedDomain, file);
            }
            setSuccess(`File(s) uploaded successfully to "${selectedDomain}"!`);
            await loadDocuments();
            await loadStores();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-univr-red transition-colors"
                    >
                        <span className="text-xl">←</span>
                        <span className="font-medium">Back to Home</span>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span>⚙️</span> Admin Panel
                    </h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
                    </div>
                </div>
            </header>

            {/* Notifications */}
            {(error || success) && (
                <div className="max-w-6xl mx-auto px-4 py-2">
                    {error && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300">
                            ✅ {success}
                        </div>
                    )}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('domains')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'domains'
                                ? 'bg-univr-red text-white shadow-lg'
                                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                    >
                        📁 Domain Management
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'upload'
                                ? 'bg-univr-red text-white shadow-lg'
                                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                    >
                        📤 File Upload
                    </button>
                </div>

                {/* Domain Management Tab */}
                {activeTab === 'domains' && (
                    <div className="space-y-6">
                        {/* Create Domain Form */}
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <span>✨</span> Create New Domain
                            </h2>
                            <form onSubmit={handleCreateDomain} className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Domain name (e.g., scholarships)"
                                    value={newDomain}
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                                             focus:outline-none focus:ring-2 focus:ring-univr-red/50 text-slate-800 dark:text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                                             focus:outline-none focus:ring-2 focus:ring-univr-red/50 text-slate-800 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={creating || !newDomain.trim()}
                                    className="px-8 py-3 bg-gradient-to-r from-univr-red to-univr-red-dark text-white rounded-xl font-medium
                                             hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {creating ? 'Creating...' : 'Create Domain'}
                                </button>
                            </form>
                        </div>

                        {/* Existing Domains List */}
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <span>📋</span> Existing Domains
                            </h2>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-univr-red border-t-transparent" />
                                </div>
                            ) : stores.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    <p className="text-4xl mb-2">📭</p>
                                    <p>No domains created yet. Create your first domain above!</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {stores.map((store) => (
                                        <div
                                            key={store.domain}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl">📁</span>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 dark:text-white capitalize">
                                                        {store.display_name || store.domain}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {store.document_count} document{store.document_count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDomain(store.domain)}
                                                className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 
                                                         rounded-lg transition-colors font-medium"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* File Upload Tab */}
                {activeTab === 'upload' && (
                    <div className="space-y-6">
                        {/* Domain Selector */}
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <span>📁</span> Select Domain
                            </h2>

                            {stores.length === 0 ? (
                                <p className="text-slate-500 dark:text-slate-400">
                                    No domains available. Please create a domain first.
                                </p>
                            ) : (
                                <select
                                    value={selectedDomain}
                                    onChange={(e) => setSelectedDomain(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                                             focus:outline-none focus:ring-2 focus:ring-univr-red/50 text-slate-800 dark:text-white text-lg"
                                >
                                    <option value="">-- Select a domain --</option>
                                    {stores.map((store) => (
                                        <option key={store.domain} value={store.domain}>
                                            {store.display_name || store.domain} ({store.document_count} docs)
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* File Upload Area */}
                        {selectedDomain && (
                            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span>📤</span> Upload Documents
                                </h2>

                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center
                                             hover:border-univr-red hover:bg-univr-red/5 transition-colors cursor-pointer"
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        multiple
                                        accept=".pdf,.md,.txt,.docx"
                                        className="hidden"
                                        id="file-upload"
                                        disabled={uploading}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <div className="text-5xl mb-4">{uploading ? '⏳' : '📄'}</div>
                                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Supported: PDF, Markdown, TXT, DOCX
                                        </p>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Documents List */}
                        {selectedDomain && (
                            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <span>📚</span> Documents in "{selectedDomain}"
                                </h2>

                                {loadingDocs ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-univr-red border-t-transparent" />
                                    </div>
                                ) : documents.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                        <p className="text-4xl mb-2">📭</p>
                                        <p>No documents in this domain yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.name}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">📄</span>
                                                    <span className="text-slate-800 dark:text-white font-medium">
                                                        {doc.display_name || doc.name}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteDocument(doc.name)}
                                                    className="px-3 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 
                                                             rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
