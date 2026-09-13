<template>
    <div class="page-container">
        <!-- Topbar -->
        <div class="topbar bg-white px-5">
            <div class="ps-4">
                <div class="page-title">Amenities</div>
                <div class="page-subtitle">Platform performance overview</div>
            </div>
            <div class="d-flex align-items-center gap-3 pe-4">
                <button class="icon-btn">
                   <i class="bi bi-bell"></i>
                    <span class="dot"></span>
                </button>
                <div class="user-chip">
                    <div class="avatar-circle">P</div>
                    <div>
                        <div class="name">Platform Admin</div>
                        <div class="sub">Administrator</div>
                    </div>
                    <i class="fa-solid fa-chevron-down text-muted small ms-1"></i>
                </div>
            </div>
        </div>

        <!-- Amenities Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Amenities List</div>
                        <div class="panel-sub text-muted font-sm">All available amenities for hotels</div>
                    </div>
                    <div class="d-flex gap-3">
                        <select class="form-select" v-model="statusFilter" style="width: 150px;">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div class="search-box">
                            <i class="fa-solid fa-magnifying-glass search-icon text-muted"></i>
                            <input type="text" class="form-control search-input" placeholder="Search amenities..." v-model="searchQuery">
                        </div>
                        <button class="btn btn-primary d-flex align-items-center gap-2"
                            style="background-color: #0f766e; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px;"
                            @click="openAddModal">
                            <i class="fa-solid fa-plus"></i> Add Amenity
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>ICON</th>
                                <th>DESCRIPTION</th>
                                <th>STATUS</th>
                                <th class="text-end">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="5" class="text-center py-4 text-muted">Loading amenities...</td>
                            </tr>
                            <tr v-else-if="!filteredAmenityList.length">
                                <td colspan="5" class="text-center py-4 text-muted">No amenities found.</td>
                            </tr>
                            <tr v-for="amenity in filteredAmenityList" :key="amenity.id" v-else>
                                <td class="text-muted">#{{ amenity.id }}</td>
                                <td class="fw-bold text-dark">{{ amenity.name }}</td>
                                <td>
                                    <i :class="amenity.icon || amenity.icon_class || 'bi bi-star'" class="fs-5 text-secondary"></i>
                                </td>
                                <td class="text-secondary">{{ amenity.description || 'No description provided' }}</td>
                                <td>
                                    <span class="status-badge" :class="amenity.status || 'active'">
                                        {{ amenity.status || 'Active' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center justify-content-end gap-2">
                                        <button class="icon-action-btn edit-btn" title="Edit Amenity"
                                            @click="editAmenity(amenity)">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="icon-action-btn delete-btn" title="Delete Amenity"
                                            @click="deleteAmenity(amenity.id)">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <div class="modal-overlay" v-if="showAddModal">
            <div class="modal-content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Add Amenity</h5>
                    <button type="button" class="btn-close" @click="closeAddModal"></button>
                </div>
                <form @submit.prevent="submitAdd">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="addForm.name" required placeholder="e.g. Swimming Pool">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Icon Class</label>
                        <input type="text" class="form-control" v-model="addForm.icon" placeholder="e.g. bi bi-water">
                        <small class="text-muted">Use Bootstrap Icons (e.g., bi bi-wifi)</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="addForm.description" rows="3" placeholder="Optional description"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="addForm.status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-light border" @click="closeAddModal">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="background-color: #0f766e; border: none;">Create</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal-overlay" v-if="showEditModal">
            <div class="modal-content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Edit Amenity</h5>
                    <button type="button" class="btn-close" @click="closeEditModal"></button>
                </div>
                <form @submit.prevent="submitEdit">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="editForm.name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Icon Class</label>
                        <input type="text" class="form-control" v-model="editForm.icon">
                        <small class="text-muted">Use Bootstrap Icons (e.g., bi bi-wifi)</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="editForm.description" rows="3"></textarea>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="editForm.status" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-light border" @click="closeEditModal">Cancel</button>
                        <button type="submit" class="btn btn-primary" style="background-color: #0f766e; border: none;">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');

const loadAmenities = async () => {
    loading.value = true;
    try {
        await adminStore.getAmenity();
    } catch (error) {
        console.error('Failed to load amenities:', error);
    } finally {
        loading.value = false;
    }
};

const rawAmenityList = computed(() => {
    const data = adminStore.amenities;
    if (!data) return [];
    
    // Recursive search for the first array in the object
    const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            if (obj.data && Array.isArray(obj.data)) return obj.data;
            if (obj.amenities && Array.isArray(obj.amenities)) return obj.amenities;
            for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key];
            }
            // If we still haven't found an array, let's look deeper
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const deep = findArray(obj[key]);
                    if (deep && deep.length > 0) return deep;
                }
            }
        }
        return [];
    };
    
    return findArray(data);
});

const filteredAmenityList = computed(() => {
    let list = rawAmenityList.value;
    
    // Filter by status
    if (statusFilter.value !== 'all') {
        list = list.filter(amenity => {
            const status = (amenity.status || 'active').toLowerCase();
            return status === statusFilter.value;
        });
    }
    
    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(amenity => {
            const name = (amenity.name || '').toLowerCase();
            const description = (amenity.description || '').toLowerCase();
            return name.includes(query) || description.includes(query);
        });
    }
    
    return list;
});

const showAddModal = ref(false);
const addForm = ref({
    name: '',
    icon: '',
    description: '',
    status: 'active'
});

const openAddModal = () => {
    addForm.value = {
        name: '',
        icon: '',
        description: '',
        status: 'active'
    };
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
};

const submitAdd = async () => {
    try {
        await adminStore.createAmenity(addForm.value);
        showAddModal.value = false;
        await loadAmenities();
    } catch (error) {
        console.error('Failed to create amenity:', error);
        alert('Failed to create amenity.');
    }
};

const showEditModal = ref(false);
const editingId = ref(null);
const editForm = ref({
    name: '',
    icon: '',
    description: '',
    status: 'active'
});

const editAmenity = (amenity) => {
    editingId.value = amenity.id;
    editForm.value = {
        name: amenity.name,
        icon: amenity.icon || amenity.icon_class || '',
        description: amenity.description || '',
        status: amenity.status || 'active'
    };
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingId.value = null;
};

const submitEdit = async () => {
    try {
        await adminStore.updateAmenity(editingId.value, editForm.value);
        showEditModal.value = false;
        await loadAmenities();
    } catch (error) {
        console.error('Failed to update amenity:', error);
        alert('Failed to update amenity.');
    }
};

const deleteAmenity = async (id) => {
    if (confirm('Are you sure you want to delete this amenity?')) {
        try {
            await adminStore.deleteAmenity(id);
            await loadAmenities();
        } catch (error) {
            console.error('Failed to delete amenity:', error);
            alert('Failed to delete amenity.');
        }
    }
};

onMounted(() => {
    loadAmenities();
});
</script>

<style scoped>
.page-container {
    background-color: #f6f8f7;
    min-height: 100vh;
}

/* Topbar Styles */
.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eef2f0;
}
.icon-btn {
    background: #f1f5f9;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    position: relative;
    cursor: pointer;
}
.dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
}
.user-chip {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 12px;
    border-radius: 30px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    cursor: pointer;
}
.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #035e4e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
}
.font-sm { font-size: 13px; }
.font-xs { font-size: 11px; }

/* Filter & Search Styles */
.search-box {
    position: relative;
    width: 250px;
}
.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
}
.search-input {
    padding-left: 38px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    box-shadow: none;
}
.search-input:focus {
    border-color: #0f766e;
    box-shadow: 0 0 0 0.2rem rgba(15, 118, 110, 0.25);
}
.form-select {
    border-radius: 8px;
    font-size: 14px;
    border: 1px solid #e2e8f0;
}
.form-select:focus {
    border-color: #0f766e;
    box-shadow: 0 0 0 0.2rem rgba(15, 118, 110, 0.25);
}

/* Panel & Table Styles */
.panel-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #eef2f0;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.custom-table th {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    text-transform: uppercase;
}
.custom-table td {
    padding: 16px 20px;
    border-bottom: 1px solid #f8fafc;
    font-size: 14px;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}
.status-badge.active { background-color: #def7ec; color: #03543f; }
.status-badge.inactive { background-color: #fde8e8; color: #9b1c1c; }

/* Actions Buttons */
.icon-action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 13px;
}

.edit-btn {
    color: #3b82f6;
}

.edit-btn:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
}

.delete-btn {
    color: #ef4444;
}

.delete-btn:hover {
    background-color: #fef2f2;
    border-color: #fca5a5;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}
.modal-content {
    background: #ffffff;
    width: 100%;
    max-width: 500px;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
