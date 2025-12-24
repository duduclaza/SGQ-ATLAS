// LocalStorage helper for SGQ ATLAS data
const PREFIX = 'sgq_atlas_';

export const storage = {
    // Get item from storage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    // Set item in storage
    set: (key, value) => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    // Remove item from storage
    remove: (key) => {
        try {
            localStorage.removeItem(PREFIX + key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    // Get all items with prefix
    getAll: (key) => {
        return storage.get(key, []);
    },

    // Add item to array in storage
    add: (key, item) => {
        const items = storage.getAll(key);
        const newItem = {
            ...item,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        storage.set(key, items);
        return newItem;
    },

    // Update item in array
    update: (key, id, updates) => {
        const items = storage.getAll(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            storage.set(key, items);
            return items[index];
        }
        return null;
    },

    // Delete item from array
    delete: (key, id) => {
        const items = storage.getAll(key);
        const filtered = items.filter(item => item.id !== id);
        storage.set(key, filtered);
        return filtered;
    },

    // Find item by ID
    findById: (key, id) => {
        const items = storage.getAll(key);
        return items.find(item => item.id === id) || null;
    },

    // Clear all SGQ ATLAS data
    clearAll: () => {
        Object.keys(localStorage)
            .filter(key => key.startsWith(PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }
};

// Storage keys for each module
export const STORAGE_KEYS = {
    NAO_CONFORMIDADES: 'nao_conformidades',
    RECLAMACOES: 'reclamacoes',
    NPS: 'nps',
    NPS_FORMULARIOS: 'nps_formularios',
    NPS_RESPOSTAS: 'nps_respostas',
    DOCUMENTOS: 'documentos',
    FORNECEDORES: 'fornecedores',
    POPS: 'pops',
    ITS: 'its',
    PROCESSOS: 'processos',
    GARANTIAS: 'garantias',
    ISHIKAWA: 'ishikawa',
    PARETO: 'pareto',
    FMEA: 'fmea',
    MELHORIAS: 'melhorias',
    AUDITORIAS: 'auditorias',
    QUARENTENA: 'quarentena',
    AMOSTRAS_LOTES: 'amostras_lotes',
    DESCARTES: 'descartes',
    TRIAGENS: 'triagens',
    PRODUTOS: 'produtos',
    USUARIOS: 'usuarios',
    CONFIGURACOES: 'configuracoes'
};

export default storage;
