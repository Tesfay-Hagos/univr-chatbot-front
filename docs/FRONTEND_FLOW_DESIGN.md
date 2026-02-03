# Admin Board Flow – ULSS 9

This document describes the **admin panel** flow: managing categories (stores) and uploading documents for the ULSS 9 chatbot backend.

---

## 1. High-Level Flow

```
Admin opens admin board
    → Sees "Pannello Admin ULSS 9" with two tabs
Tab "Gestione categorie": create/delete stores, or run "Prepara ULSS 9" (delete all / create 4)
Tab "Carica file": select a category, upload documents, list/delete documents
All actions call the backend Admin API (/api/admin/...)
```

---

## 2. Main Sections

### Gestione categorie (Domain/Store Management)

- **Prepara ULSS 9:** Buttons to "Elimina tutte le categorie" (POST `/api/admin/stores/delete-all`) and "Crea le 4 categorie iniziali" (POST `/api/admin/stores/ulss9/create-all`).
- **Crea nuova categoria:** Form to add an extra store (domain + optional description). Calls POST `/api/admin/stores`.
- **Categorie esistenti:** List of stores with document count; each can be deleted (DELETE `/api/admin/stores/{domain}`).

### Carica file (Upload)

- **Seleziona categoria:** Dropdown of existing stores.
- **Upload:** Drag-and-drop or file picker; uploads to POST `/api/admin/stores/{domain}/upload`.
- **Documenti:** List documents in the selected store; delete via DELETE `/api/admin/stores/{domain}/documents/{name}`.

---

## 3. Backend

The admin board uses only the Admin API base: `NEXT_PUBLIC_API_URL` + `/admin` (e.g. `http://localhost:8000/api/admin`). No chat or welcome endpoints are used.
