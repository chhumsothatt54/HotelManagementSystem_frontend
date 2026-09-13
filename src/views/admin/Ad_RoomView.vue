<template>
    <div class="page-container">
        <!-- Topbar -->
        <div class="topbar bg-white px-5">
            <div class="ps-4">
                <div class="page-title">Rooms</div>
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

        <!-- Rooms Panel -->
        <div class="p-4">
            <div class="panel-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <div class="panel-title fw-bold fs-6">All Rooms</div>
                        <div class="panel-sub text-muted font-sm">List of all rooms available across hotels</div>
                    </div>
                    <div class="d-flex gap-3">
                        <select class="form-select" v-model="statusFilter" style="width: 150px;">
                            <option value="all">All Status</option>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div class="search-box">
                            <i class="fa-solid fa-magnifying-glass search-icon text-muted"></i>
                            <input type="text" class="form-control search-input" placeholder="Search rooms..." v-model="searchQuery">
                        </div>
                        <button class="btn btn-primary d-flex align-items-center gap-2"
                            style="background-color: #0f766e; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px;"
                            @click="openAddModal">
                            <i class="fa-solid fa-plus"></i> Add Room
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table custom-table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>ROOM NO.</th>
                                <th>HOTEL</th>
                                <th>ROOM TYPE</th>
                                <th>CAPACITY</th>
                                <th>PRICE</th>
                                <th>STATUS</th>
                                <th class="text-end">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="6" class="text-center py-4 text-muted">Loading rooms...</td>
                            </tr>
                            <tr v-else-if="!roomList.length">
                                <td colspan="6" class="text-center py-4 text-muted">No rooms found.</td>
                            </tr>
                            <tr v-for="room in roomList" :key="room.id" v-else>
                                <td class="fw-bold text-dark">{{ room.room_number || room.name || `#${room.id}` }}</td>
                                <td class="text-secondary">{{ room.hotel?.name || 'N/A' }}</td>
                                <td class="text-secondary">{{ room.room_type?.name || 'Standard' }}</td>
                                <td>
                                    <span class="badge bg-light text-dark border">
                                        {{ room.capacity || room.room_type?.max_guests || room.room_type?.capacity || 1 }} Guests
                                    </span>
                                </td>
                                <td class="fw-bold text-success">${{ room.price_per_night ?? room.price ?? room.room_type?.price_per_night ?? room.room_type?.base_price ?? 0 }} / night</td>
                                <td>
                                    <span class="status-badge" :class="room.status || 'available'">
                                        {{ room.status || 'Available' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center justify-content-end gap-2">
                                        <button class="icon-action-btn edit-btn" title="Edit Room"
                                            @click="editRoom(room)">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button class="icon-action-btn delete-btn" title="Delete Room"
                                            @click="deleteRoom(room.id)">
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
                    <h5 class="mb-0 fw-bold">Add Room</h5>
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
                        <label class="form-label">Room Type</label>
                        <select class="form-select" v-model="addForm.room_type_id" required>
                            <option value="" disabled>Select a room type...</option>
                            <option v-for="type in roomTypesList" :key="type.id" :value="type.id">
                                {{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Room Number</label>
                            <input type="text" class="form-control" v-model="addForm.room_number" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Floor</label>
                            <input type="number" class="form-control" v-model="addForm.floor" placeholder="e.g. 1">
                        </div>
                        <div class="col">
                            <label class="form-label">Custom Price ($)</label>
                            <input type="number" class="form-control" v-model="addForm.price" placeholder="Optional">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="addForm.status" required>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
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
                    <h5 class="mb-0 fw-bold">Edit Room</h5>
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
                        <label class="form-label">Room Type</label>
                        <select class="form-select" v-model="editForm.room_type_id" required>
                            <option value="" disabled>Select a room type...</option>
                            <option v-for="type in roomTypesList" :key="type.id" :value="type.id">
                                {{ type.name }}
                            </option>
                        </select>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Room Number</label>
                            <input type="text" class="form-control" v-model="editForm.room_number" required>
                        </div>
                        <div class="col">
                            <label class="form-label">Floor</label>
                            <input type="number" class="form-control" v-model="editForm.floor" placeholder="e.g. 1">
                        </div>
                        <div class="col">
                            <label class="form-label">Custom Price ($)</label>
                            <input type="number" class="form-control" v-model="editForm.price" placeholder="Optional">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="editForm.status" required>
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
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

const loadRooms = async () => {
    loading.value = true;
    try {
        await adminStore.getRooms();
    } catch (error) {
        console.error('Failed to load rooms:', error);
    } finally {
        loading.value = false;
    }
};

const rawRooms = computed(() => {
    const data = adminStore.rooms;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
});

const roomList = computed(() => {
    let list = rawRooms.value;
    
    // Filter by status
    if (statusFilter.value !== 'all') {
        list = list.filter(room => {
            const status = (room.status || 'available').toLowerCase();
            return status === statusFilter.value;
        });
    }
    
    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        list = list.filter(room => {
            const roomNo = String(room.room_number || room.name || `#${room.id}`).toLowerCase();
            const hotelName = (room.hotel?.name || '').toLowerCase();
            const roomType = (room.room_type?.name || '').toLowerCase();
            return roomNo.includes(query) || hotelName.includes(query) || roomType.includes(query);
        });
    }
    
    return list;
});

const hotelsList = computed(() => {
    const data = adminStore.allHotel;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
});

const roomTypesList = computed(() => {
    let data = adminStore.roomType;
    if (!data) return [];
    
    const findArray = (obj) => {
        if (Array.isArray(obj)) return obj;
        if (obj && typeof obj === 'object') {
            if (obj.data && Array.isArray(obj.data)) return obj.data;
            if (obj.room_types && Array.isArray(obj.room_types)) return obj.room_types;
            if (obj.roomTypes && Array.isArray(obj.roomTypes)) return obj.roomTypes;
            for (const key in obj) {
                if (Array.isArray(obj[key])) return obj[key];
            }
        }
        return null;
    };
    return findArray(data) || [];
});

const showAddModal = ref(false);
const addForm = ref({
    hotel_id: '',
    room_type_id: '',
    room_number: '',
    floor: '',
    price: '',
    status: 'available'
});

const openAddModal = async () => {
    await adminStore.getHotels();
    await adminStore.getRoomTypes();
    addForm.value = {
        hotel_id: '',
        room_type_id: '',
        room_number: '',
        floor: '',
        price: '',
        status: 'available'
    };
    showAddModal.value = true;
};

const closeAddModal = () => {
    showAddModal.value = false;
};

const submitAdd = async () => {
    try {
        const payload = { ...addForm.value };
        if (payload.price !== '' && payload.price !== null) {
            payload.price = Number(payload.price);
            payload.price_per_night = Number(payload.price);
            payload.base_price = Number(payload.price);
        } else {
            delete payload.price; // don't send empty price
        }
        if (payload.floor !== '' && payload.floor !== null) payload.floor = Number(payload.floor);
        else delete payload.floor;

        await adminStore.createRoom(payload);
        showAddModal.value = false;
        await loadRooms();
    } catch (error) {
        console.error('Failed to create room:', error);
        alert('Failed to create room.');
    }
};

const showEditModal = ref(false);
const editingId = ref(null);
const editForm = ref({
    hotel_id: '',
    room_type_id: '',
    room_number: '',
    floor: '',
    price: '',
    status: 'available'
});

const editRoom = async (room) => {
    await adminStore.getHotels();
    await adminStore.getRoomTypes();
    editingId.value = room.id;
    editForm.value = {
        hotel_id: room.hotel_id || room.hotel?.id || '',
        room_type_id: room.room_type_id || room.room_type?.id || '',
        room_number: room.room_number || '',
        floor: room.floor || '',
        price: room.price_per_night || room.base_price || room.price || '',
        status: room.status || 'available'
    };
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingId.value = null;
};

const submitEdit = async () => {
    try {
        const payload = { ...editForm.value };
        if (payload.price !== '' && payload.price !== null) {
            payload.price = Number(payload.price);
            payload.price_per_night = Number(payload.price);
            payload.base_price = Number(payload.price);
        } else {
            payload.price = null;
            payload.price_per_night = null;
            payload.base_price = null;
        }
        if (payload.floor !== '' && payload.floor !== null) payload.floor = Number(payload.floor);
        else payload.floor = null;

        await adminStore.updateRoom(editingId.value, payload);
        showEditModal.value = false;
        await loadRooms();
    } catch (error) {
        console.error('Failed to update room:', error);
        alert('Failed to update room.');
    }
};

const deleteRoom = async (id) => {
    if (confirm('Are you sure you want to delete this room?')) {
        try {
            await adminStore.deleteRoom(id);
            await loadRooms();
        } catch (error) {
            console.error('Failed to delete room:', error);
            alert('Failed to delete room.');
        }
    }
};

onMounted(() => {
    loadRooms();
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

/* Panel & Table Styles */
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
.status-badge.available { background-color: #def7ec; color: #03543f; }
.status-badge.maintenance { background-color: #fef08a; color: #854d0e; }
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
