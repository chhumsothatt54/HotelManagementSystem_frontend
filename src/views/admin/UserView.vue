<template>
    <div>
        <!-- Topbar -->
        <div class="topbar bg-white">
            <div class="ps-4">
                <div class="page-title">Users</div>
                <div class="page-subtitle">Manage platform accounts</div>
            </div>
            <div class="d-flex align-items-center gap-3 pe-4">
                <button class="icon-btn">
                    <i class="fa-regular fa-bell"></i>
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

        <!-- User management -->
        <div class="content-wrap">
            <p class="section-desc">View, update and manage platform accounts.</p>

            <!-- Toolbar: search + filters -->
            <div class="toolbar mb-3">
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass text-muted"></i>
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="form-control border-0 shadow-none p-0"
                        placeholder="Search by name or email"
                    />
                </div>

                <select v-model="roleFilter" class="filter-select">
                    <option value="">All roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                </select>

                <select v-model="statusFilter" class="filter-select">
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            <!-- Results count -->
            <div class="results-count mb-2">
                Showing {{ filteredUsers.length }} of {{ admin.users?.total || 0 }} users
            </div>

            <!-- Table card -->
            <div class="panel-card p-0">
                <table class="table users-table mb-0">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading State -->
                        <tr v-if="loading">
                            <td colspan="6" class="state-cell">
                                <div class="spinner"></div>
                                Loading users…
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-else-if="filteredUsers.length === 0">
                            <td colspan="6" class="state-cell">
                                <i class="fa-regular fa-folder-open"></i>
                                No users match your filters.
                            </td>
                        </tr>

                        <!-- Data Rows -->
                        <tr v-for="u in filteredUsers" :key="u.id || u.email">
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="avatar-circle-sm" :class="roleAvatarClass(u.role)">
                                        {{ u.name ? u.name.charAt(0).toUpperCase() : 'U' }}
                                    </div>
                                    <div>
                                        <div class="user-name">{{ u.name || 'N/A' }}</div>
                                        <div class="user-email">{{ u.email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-muted">{{ u.phone || u.phone_number || 'N/A' }}</td>
                            <td>
                                <span class="role-pill" :class="roleAvatarClass(u.role)">
                                    {{ u.role || 'Customer' }}
                                </span>
                            </td>
                            <td>
                                <span class="status-badge" :class="statusClass(u.status)">
                                    <span class="status-dot"></span>
                                    {{ u.status || 'active' }}
                                </span>
                            </td>
                            <td class="text-muted">{{ formatDate(u.created_at) }}</td>
                            <td>
                                <div class="d-flex justify-content-end gap-2">
                                    <button class="action-icon-btn" title="View">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button class="action-icon-btn" title="Edit">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button class="action-icon-btn danger" title="Delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="admin.users?.last_page > 1" class="d-flex justify-content-end align-items-center gap-2 mt-3">
                <button
                    class="page-btn"
                    :disabled="admin.users?.current_page === 1"
                    @click="changePage(admin.users.current_page - 1)"
                >
                    Previous
                </button>
                <span class="page-indicator">
                    Page {{ admin.users?.current_page }} of {{ admin.users?.last_page }}
                </span>
                <button
                    class="page-btn"
                    :disabled="admin.users?.current_page === admin.users?.last_page"
                    @click="changePage(admin.users.current_page + 1)"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';

const admin = useAdminStore();

// Reactive States
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const loading = ref(false);

const fetchUserData = async (page = 1) => {
    loading.value = true;
    try {
        await admin.getUser(page);
    } catch (error) {
        console.error("Error loading users:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchUserData();
});

const changePage = (page) => {
    fetchUserData(page);
};

const filteredUsers = computed(() => {
    const list = admin.users?.data || [];

    return list.filter(u => {
        const matchesSearch =
            (u.name && u.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchQuery.value.toLowerCase()));

        const matchesRole = roleFilter.value ? u.role === roleFilter.value : true;
        const matchesStatus = statusFilter.value ? u.status === statusFilter.value : true;
        return matchesSearch && matchesRole && matchesStatus;
    });
});

// Helper for formatting date
const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Helper for role -> color mapping
const roleAvatarClass = (role) => {
    const key = (role || 'customer').toLowerCase();
    if (key === 'admin') return 'role-admin';
    if (key === 'vendor') return 'role-vendor';
    return 'role-customer';
};

// Helper for status -> color mapping
const statusClass = (status) => {
    const key = (status || 'active').toLowerCase();
    if (key === 'active') return 'status-active';
    if (key === 'suspended') return 'status-suspended';
    return 'status-inactive';
};
</script>

<style scoped>
.content-wrap {
    padding: 24px 32px;
}

.section-desc {
    color: #6b7280;
    margin-bottom: 20px;
}

/* Toolbar */
.toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px 16px;
    flex: 1 1 260px;
    min-width: 220px;
}

.search-box input:focus {
    box-shadow: none;
}

.filter-select {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 9px 14px;
    background: #fff;
    color: #374151;
    font-size: 14px;
    min-width: 150px;
}

.results-count {
    font-size: 13px;
    color: #6b7280;
}

/* Table panel */
.panel-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #eef0f2;
    overflow: hidden;
}

.users-table {
    margin-bottom: 0;
}

.users-table thead th {
    font-size: 12px;
    letter-spacing: 0.02em;
    color: #6b7280;
    font-weight: 600;
    background: #fafbfb;
    border-bottom: 1px solid #eef0f2;
    padding: 14px 20px;
}

.users-table tbody tr {
    transition: background-color 0.12s ease;
}

.users-table tbody tr:hover {
    background-color: #fafbfb;
}

.users-table tbody td {
    padding: 14px 20px;
    vertical-align: middle;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #374151;
}

.users-table tbody tr:last-child td {
    border-bottom: none;
}

/* Empty / loading state */
.state-cell {
    text-align: center;
    padding: 48px 20px;
    color: #9ca3af;
    font-size: 14px;
}

.state-cell i {
    display: block;
    font-size: 22px;
    margin-bottom: 8px;
    color: #d1d5db;
}

.spinner {
    width: 18px;
    height: 18px;
    margin: 0 auto 8px;
    border: 2px solid #e5e7eb;
    border-top-color: #0f7a5f;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Avatar */
.avatar-circle-sm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
}

.role-admin { background: #fdeee7; color: #c2410c; }
.role-vendor { background: #eef2ff; color: #4338ca; }
.role-customer { background: #e6f4ef; color: #0f7a5f; }

.user-name {
    font-weight: 600;
    color: #1f2937;
    line-height: 1.3;
}

.user-email {
    font-size: 12px;
    color: #9ca3af;
}

/* Role pill */
.role-pill {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 6px;
}

/* Status badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding: 4px 12px 4px 8px;
    border-radius: 20px;
    font-weight: 500;
    text-transform: capitalize;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}

.status-active { background: #e6f4ef; color: #0f7a5f; }
.status-active .status-dot { background: #0f7a5f; }

.status-inactive { background: #f3f4f6; color: #6b7280; }
.status-inactive .status-dot { background: #9ca3af; }

.status-suspended { background: #fdecec; color: #b91c1c; }
.status-suspended .status-dot { background: #dc2626; }

/* Action buttons */
.action-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease;
}

.action-icon-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
}

.action-icon-btn.danger {
    color: #dc2626;
    border-color: #fecaca;
}

.action-icon-btn.danger:hover {
    background: #fdecec;
}

/* Pagination */
.page-indicator {
    font-size: 13px;
    color: #6b7280;
}

.page-btn {
    border: 1px solid #e5e7eb;
    background: #fff;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 13px;
    color: #374151;
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
    background: #f3f4f6;
}
</style>