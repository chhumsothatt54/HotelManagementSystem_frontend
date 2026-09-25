<template>
    <div class="page-container">
        <!-- Topbar -->
        <AdminTopbar title="Room Types" subtitle="Platform performance overview" />

        <!-- Room Types Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">Room Type</div>
                        <div class="panel-sub text-muted font-sm">Available room types that can be assigned to hotels
                        </div>
                    </div>
                    <div class="search-box">
                        <i class="fa-solid fa-magnifying-glass search-icon text-muted"></i>
                        <input type="text" class="form-control search-input" placeholder="Search room types..."
                            v-model="searchQuery">
                    </div>
                    <button class="btn btn-primary d-flex align-items-center gap-2"
                        style="background-color: #0f766e; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px;"
                        @click="openAddModal">
                        <i class="fa-solid fa-plus"></i> Add Room Type
                    </button>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>BASE PRICE</th>
                                <th>CAPACITY</th>
                                <th>DESCRIPTION</th>
                                <th class="text-end">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="6" class="text-center py-4 text-muted">Loading room types...</td>
                            </tr>
                            <tr v-else-if="!filteredRoomTypes.length">
                                <td colspan="6" class="text-center py-4 text-muted">No room types found.</td>
                            </tr>
                            <tr v-for="type in filteredRoomTypes" :key="type.id" v-else>
                                <td class="text-muted">#{{ type.id }}</td>
                                <td class="fw-bold text-dark">
                                    <div class="d-flex align-items-center gap-3">
                                        <div v-if="type.images && type.images.length"
                                            class="border-0 rounded overflow-hidden flex-shrink-0"
                                            style="width: 48px; height: 48px;">
                                            <img :src="type.images[0].image.startsWith('http') ? type.images[0].image : (type.images[0].image.startsWith('uploads/') ? `http://127.0.0.1:8000/${type.images[0].image}` : `http://127.0.0.1:8000/storage/${type.images[0].image}`)"
                                                style="width: 100%; height: 100%; object-fit: cover;"
                                                alt="Room Type Image" />
                                        </div>
                                        <div v-else
                                            class="bg-light text-dark d-flex align-items-center justify-content-center rounded flex-shrink-0"
                                            style="width: 48px; height: 48px; font-weight: 600; font-size: 16px; border: 1px solid #e5e7eb;">
                                            R
                                        </div>
                                        <span>{{ type.name }}</span>
                                    </div>
                                </td>
                                <td class="fw-bold text-success">${{ type.price_per_night || type.base_price ||
                                    type.price || 0 }}</td>
                                <td>
                                    <span class="badge bg-light text-dark border">
                                        <i class="fa-solid fa-user-group me-1 text-muted"></i> {{ type.max_guests ||
                                        type.capacity || 1 }}
                                        Guests
                                    </span>
                                </td>
                                <td class="text-secondary text-truncate" style="max-width: 250px;"
                                    :title="type.description">
                                    {{ type.description || 'No description' }}
                                </td>
                                <td>
                                    <div class="d-flex align-items-center justify-content-end gap-2">
                                        <button class="icon-action-btn edit-btn" title="Edit Room Type"
                                            @click="editRoomType(type)">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="icon-action-btn delete-btn" title="Delete Room Type"
                                            @click="deleteRoomType(type.id)">
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
                    <h5 class="mb-0 fw-bold">Add Room Type</h5>
                    <button type="button" class="btn-close" @click="closeAddModal"></button>
                </div>
                <form @submit.prevent="submitAdd">
                    <div class="mb-3">
                        <label class="form-label">Hotel</label>
                        <select class="form-select" v-model="addForm.hotel_id" required>
                            <option value="" disabled>Select a hotel...</option>
                            <option v-for="hotel in hotelsList" :key="hotel.id" :value="hotel.id">
                                {{ hotel.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="addForm.name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="addForm.description" rows="3" required></textarea>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Max Guests</label>
                            <input type="number" class="form-control" v-model="addForm.capacity" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Price per Night ($)</label>
                            <input type="number" class="form-control" v-model="addForm.base_price" required>
                        </div>
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
                        <button type="submit" class="btn btn-primary"
                            style="background-color: #0f766e; border: none;">Create</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal-overlay" v-if="showEditModal">
            <div class="modal-content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0 fw-bold">Edit Room Type</h5>
                    <button type="button" class="btn-close" @click="closeEditModal"></button>
                </div>
                <form @submit.prevent="submitEdit">
                    <div class="mb-3">
                        <label class="form-label">Hotel</label>
                        <select class="form-select" v-model="editForm.hotel_id" required>
                            <option value="" disabled>Select a hotel...</option>
                            <option v-for="hotel in hotelsList" :key="hotel.id" :value="hotel.id">
                                {{ hotel.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-control" v-model="editForm.name" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="editForm.description" rows="3" required></textarea>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Max Guests</label>
                            <input type="number" class="form-control" v-model="editForm.capacity" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Price per Night ($)</label>
                            <input type="number" class="form-control" v-model="editForm.base_price" required>
                        </div>
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
                        <button type="submit" class="btn btn-primary"
                            style="background-color: #0f766e; border: none;">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import AdminTopbar from '@/components/layout/admin/AdminTopbar.vue'
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();
const loading = ref(false);
const searchQuery = ref('');

const loadRoomTypes = async () => {
    loading.value = true;
    try {
        await adminStore.getRoomTypes();
        await adminStore.getHotels();
    } catch (error) {
        console.error('Failed to load data:', error);
    } finally {
        loading.value = false;
    }
};

const hotelsList = computed(() => {
    const data = adminStore.allHotel;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
});

const rawRoomTypes = computed(() => {
    let data = adminStore.roomType;
    if (!data) return [];

    // Helper to find an array in a nested object
    const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            // First check explicit keys
            if (obj.data && Array.isArray(obj.data)) return obj.data;
            if (obj.room_types && Array.isArray(obj.room_types)) return obj.room_types;
            if (obj.roomTypes && Array.isArray(obj.roomTypes)) return obj.roomTypes;
            // Then search children
            for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key];
            }
            // Deep search
            for (const key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    const found = findArray(obj[key]);
                    if (found && found.length > 0) return found;
                }
            }
            // If it's an object map with items that look like RoomTypes (have an id and name)
            const values = Object.values(obj);
            if (values.length > 0 && typeof values[0] === 'object' && ('id' in values[0] || 'name' in values[0])) {
                return values;
            }
        }
        return null;
    };

    const foundArray = findArray(data);
    return foundArray || [];
});

const filteredRoomTypes = computed(() => {
    if (!searchQuery.value) return rawRoomTypes.value;
    const query = searchQuery.value.toLowerCase();
    return rawRoomTypes.value.filter(type =>
        type.name?.toLowerCase().includes(query) ||
        type.description?.toLowerCase().includes(query)
    );
});

const showEditModal = ref(false);
const editingId = ref(null);
const editForm = ref({
    hotel_id: '',
    name: '',
    description: '',
    capacity: 1,
    base_price: 0,
    status: 'active'
});

const showAddModal = ref(false);
const addForm = ref({
    hotel_id: '',
    name: '',
    description: '',
    capacity: 1,
    base_price: 0,
    status: 'active'
});

const openAddModal = () => {
    addForm.value = {
        hotel_id: '',
        name: '',
        description: '',
        capacity: 1,
        base_price: 0,
        status: 'active'
    };
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
};

const submitAdd = async () => {
    try {
        const payload = {
            ...addForm.value,
            price_per_night: Number(addForm.value.base_price),
            max_guests: Number(addForm.value.capacity),
            price: Number(addForm.value.base_price),
            base_price: Number(addForm.value.base_price),
            capacity: Number(addForm.value.capacity)
        };
        await adminStore.createRoomType(payload);
        showAddModal.value = false;
        await loadRoomTypes(); // reload list
    } catch (error) {
        console.error('Failed to create room type:', error);
        alert('Failed to create room type. Check console for details.');
    }
};

const editRoomType = (type) => {
    editingId.value = type.id;
    editForm.value = {
        hotel_id: type.hotel_id || '',
        name: type.name,
        description: type.description || '',
        capacity: type.max_guests || type.capacity || 1,
        base_price: type.price_per_night || type.base_price || type.price || 0,
        status: type.status || 'active'
    };
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingId.value = null;
};

const submitEdit = async () => {
    try {
        const payload = {
            ...editForm.value,
            price_per_night: Number(editForm.value.base_price),
            max_guests: Number(editForm.value.capacity),
            price: Number(editForm.value.base_price),
            base_price: Number(editForm.value.base_price),
            capacity: Number(editForm.value.capacity)
        };
        await adminStore.updateRoomType(editingId.value, payload);
        showEditModal.value = false;
        await loadRoomTypes(); // reload list
    } catch (error) {
        console.error('Failed to update room type:', error);
        alert('Failed to update room type. Check console for details.');
    }
};

const deleteRoomType = async (id) => {
    if (confirm('Are you sure you want to delete this room type?')) {
        try {
            await adminStore.deleteRoomType(id);
            await loadRoomTypes(); // reload list
        } catch (error) {
            console.error('Failed to delete room type:', error);
            alert('Failed to delete room type. Check console for details.');
        }
    }
};

onMounted(() => {
    loadRoomTypes();
});
</script>

<style scoped>
.page-container {
    background-color: var(--bg-card, #f6f8f7);
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
    background: var(--bg-soft, #f8fafc);
    border: 1px solid #e2e8f0;
    cursor: pointer;
}

.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #035e4e;
    color: var(--bg-card, white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
}

.font-sm {
    font-size: 13px;
}

.font-xs {
    font-size: 11px;
}

/* Panel & Table Styles */
.panel-card {
    background: var(--bg-card, #ffffff);
    border-radius: 16px;
    border: 1px solid #eef2f0;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.search-box {
    position: relative;
    width: 280px;
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

/* Actions Buttons */
.icon-action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background-color: var(--bg-card, #ffffff);
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
    background: var(--bg-card, #ffffff);
    width: 100%;
    max-width: 500px;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
