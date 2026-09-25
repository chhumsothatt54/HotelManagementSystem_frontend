<template>
    <div>
        <!-- Topbar -->
        <AdminTopbar title="Users" subtitle="Platform performance overview" />
        <!-- User management -->
        <div class="content-wrap">
            <p class="section-desc">
                View, update and manage platform accounts.
            </p>
            <!-- Toolbar -->
            <div class="toolbar mb-3">
                <!-- Search -->
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass text-muted"></i>
                    <input v-model="searchQuery" type="text" class="form-control border-0 shadow-none p-0"
                        placeholder="Search by name or email" />
                </div>
                <!-- Role -->
                <select v-model="roleFilter" class="filter-select">
                    <option value="">All roles</option>
                    <option value="customer">Customer</option>
                    <option value="hotel_manager">
                        Hotel Manager
                    </option>
                </select>
                <!-- Status -->
                <select v-model="statusFilter" class="filter-select">
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>
            <!-- Reults count -->
            <div class="results-count mb-2">
                Showing
                {{ admin.users?.data?.length || 0 }}
                of
                {{ admin.users?.total || 0 }}
                users
            </div>
            <!-- Table -->
            <div class="panel-card p-0">
                <table class="table users-table mb-0">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th class="text-end">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="6" class="state-cell">
                                <div class="spinner"></div>
                                Loading users…
                            </td>
                        </tr>
                        <!-- Empty -->
                        <tr v-else-if="
                            !admin.users?.data ||
                            admin.users.data.length === 0
                        ">
                            <td colspan="6" class="state-cell">
                                <i class="fa-regular fa-folder-open"></i>

                                No users match your filters.
                            </td>
                        </tr>
                        <!-- Data -->
                        <tr v-for="u in admin.users?.data" :key="u.id || u.email">
                            <!-- User -->
                            <td>
                                <div class="d-flex align-items-center gap-2">

                                    <div v-if="u.avatar" class="avatar-circle-sm overflow-hidden border-0">
                                        <img :src="u.avatar.startsWith('http') ? u.avatar : (u.avatar.startsWith('uploads/') ? `http://127.0.0.1:8000/${u.avatar}` : `http://127.0.0.1:8000/storage/${u.avatar}`)"
                                            style="width: 100%; height: 100%; object-fit: cover;" alt="User Avatar" />
                                    </div>
                                    <div v-else class="avatar-circle-sm" :class="roleAvatarClass(
                                        u.role
                                    )
                                        ">
                                        {{
                                            u.name
                                                ? u.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : 'U'
                                        }}
                                    </div>

                                    <div>
                                        <div class="user-name">
                                            {{ u.name || 'N/A' }}
                                        </div>

                                        <div class="user-email">
                                            {{ u.email }}
                                        </div>
                                    </div>

                                </div>
                            </td>

                            <!-- Phone -->
                            <td class="text-muted">
                                {{ u.phone || 'N/A' }}
                            </td>

                            <!-- Role -->
                            <td>
                                <span class="role-pill" :class="roleAvatarClass(
                                    u.role
                                )
                                    ">
                                    {{ formatRole(u.role) }}
                                </span>
                            </td>

                            <!-- Status -->
                            <td>
                                <span class="status-badge" :class="statusClass(
                                    u.status
                                )
                                    ">
                                    <span class="status-dot"></span>

                                    {{
                                        u.status || 'active'
                                    }}
                                </span>
                            </td>

                            <!-- Joined -->
                            <td class="text-muted">
                                {{ formatDate(u.created_at) }}
                            </td>

                            <!-- Actions -->
                            <td>
                                <div class="d-flex justify-content-end gap-2">

                                    <!-- View -->
                                    <button class="action-icon-btn" title="View" @click="
                                        handleView(u.id)
                                        ">
                                        <i class="bi bi-eye"></i>
                                    </button>

                                </div>
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <!-- Pagination -->
            <div v-if="admin.users?.last_page > 1" class="d-flex justify-content-end align-items-center gap-2 mt-3">

                <button class="page-btn" :disabled="admin.users?.current_page === 1
                    " @click="
                        changePage(
                            admin.users.current_page - 1
                        )
                        ">
                    Previous
                </button>

                <span class="page-indicator">
                    Page
                    {{ admin.users?.current_page }}
                    of
                    {{ admin.users?.last_page }}
                </span>

                <button class="page-btn" :disabled="admin.users?.current_page ===
                    admin.users?.last_page
                    " @click="
                        changePage(
                            admin.users.current_page + 1
                        )
                        ">
                    Next
                </button>

            </div>

        </div>

        <!-- ================================= -->
        <!-- USER DETAIL MODAL -->
        <!-- ================================= -->

        <div v-if="showDetail" class="detail-overlay" @click.self="closeDetail">

            <div class="detail-modal">

                <!-- Modal Header -->
                <div class="detail-header">

                    <div>
                        <h5>User Details</h5>

                        <p>
                            View account information
                        </p>
                    </div>

                    <button class="close-btn" @click="closeDetail">
                        <i class="bi bi-x-lg"></i>
                    </button>

                </div>

                <!-- Modal Body -->
                <div v-if="selectedUser" class="detail-body">

                    <!-- Profile -->
                    <div class="detail-profile">

                        <div v-if="selectedUser.avatar" class="detail-avatar overflow-hidden border-0">
                            <img :src="selectedUser.avatar.startsWith('http') ? selectedUser.avatar : (selectedUser.avatar.startsWith('uploads/') ? `http://127.0.0.1:8000/${selectedUser.avatar}` : `http://127.0.0.1:8000/storage/${selectedUser.avatar}`)"
                                style="width: 100%; height: 100%; object-fit: cover;" alt="User Avatar" />
                        </div>
                        <div v-else class="detail-avatar" :class="roleAvatarClass(
                            selectedUser.role
                        )
                            ">
                            {{
                                selectedUser.name
                                    ? selectedUser.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : 'U'
                            }}
                        </div>

                        <div>
                            <h4>
                                {{
                                    selectedUser.name ||
                                    'N/A'
                                }}
                            </h4>

                            <p>
                                {{
                                    selectedUser.email ||
                                    'N/A'
                                }}
                            </p>
                        </div>

                    </div>

                    <hr />

                    <!-- Details -->
                    <div class="detail-grid">

                        <!-- ID -->
                        <div class="detail-item">
                            <span class="detail-label">
                                User ID
                            </span>

                            <span class="detail-value">
                                #{{ selectedUser.id }}
                            </span>
                        </div>

                        <!-- Name -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Full Name
                            </span>

                            <span class="detail-value">
                                {{
                                    selectedUser.name ||
                                    'N/A'
                                }}
                            </span>
                        </div>

                        <!-- Email -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Email
                            </span>

                            <span class="detail-value">
                                {{
                                    selectedUser.email ||
                                    'N/A'
                                }}
                            </span>
                        </div>

                        <!-- Phone -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Phone
                            </span>

                            <span class="detail-value">
                                {{
                                    selectedUser.phone ||
                                    'N/A'
                                }}
                            </span>
                        </div>

                        <!-- Role -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Role
                            </span>

                            <span class="role-pill" :class="roleAvatarClass(
                                selectedUser.role
                            )
                                ">
                                {{
                                    formatRole(
                                        selectedUser.role
                                    )
                                }}
                            </span>
                        </div>

                        <!-- Status -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Status
                            </span>

                            <span class="status-badge" :class="statusClass(
                                selectedUser.status
                            )
                                ">
                                <span class="status-dot"></span>

                                {{
                                    selectedUser.status ||
                                    'active'
                                }}
                            </span>
                        </div>

                        <!-- Joined -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Joined
                            </span>

                            <span class="detail-value">
                                {{
                                    formatDate(
                                        selectedUser.created_at
                                    )
                                }}
                            </span>
                        </div>

                        <!-- Email Verified -->
                        <div class="detail-item">
                            <span class="detail-label">
                                Email Verified
                            </span>

                            <span class="detail-value">
                                {{
                                    selectedUser.email_verified_at
                                        ? formatDate(
                                            selectedUser.email_verified_at
                                        )
                                        : 'Not verified'
                                }}
                            </span>
                        </div>

                    </div>

                </div>

                <!-- Modal Footer -->
                <div class="detail-footer">

                    <button class="btn-close-detail" @click="closeDetail">
                        Close
                    </button>

                </div>

            </div>

        </div>

    </div>
</template>

<script setup>
import AdminTopbar from '@/components/layout/admin/AdminTopbar.vue'

import {
    ref,
    watch,
    onMounted
} from 'vue';

import {
    useAdminStore
} from '@/stores/admin';

const admin = useAdminStore();


// ==========================================
// STATES
// ==========================================

const searchQuery = ref('');

const roleFilter = ref('');

const statusFilter = ref('');

const loading = ref(false);


// User Detail Modal
const showDetail = ref(false);

const selectedUser = ref(null);


// ==========================================
// FETCH USERS
// ==========================================

const fetchUserData = async (page = 1) => {

    loading.value = true;

    try {

        await admin.getUser({

            page: page,

            role: roleFilter.value,

            status: statusFilter.value,

            search: searchQuery.value

        });

    } catch (error) {

        console.error(
            'Error loading users:',
            error
        );

    } finally {

        loading.value = false;

    }

};


// ==========================================
// ON MOUNT
// ==========================================

onMounted(() => {

    fetchUserData();

});


// ==========================================
// WATCH FILTERS
// ==========================================

watch(
    [
        roleFilter,
        statusFilter,
        searchQuery
    ],
    () => {

        fetchUserData(1);

    }
);


// ==========================================
// PAGINATION
// ==========================================

const changePage = (page) => {

    fetchUserData(page);

};
// ==========================================
// VIEW USER DETAIL
// ==========================================

const handleView = async (id) => {

    try {

        const data = await admin.userDetail(id);

        selectedUser.value = data ? JSON.parse(JSON.stringify(data)) : null;

        showDetail.value = true;

    } catch (error) {

        console.error(
            'Error loading user detail:',
            error
        );

    }

};


// ==========================================
// CLOSE DETAIL
// ==========================================

const closeDetail = () => {

    showDetail.value = false;

    selectedUser.value = null;

};


// ==========================================
// FORMAT ROLE
// ==========================================

const formatRole = (role) => {
    if (role === 'hotel_manager') {
        return 'Hotel Manager';
    }
    if (role === 'admin') {
        return 'Admin';
    }
    return 'Customer';

};

// ==========================================
// FORMAT DATE
// ==========================================

const formatDate = (dateStr) => {
    if (!dateStr) {
        return 'N/A';
    }
    return new Date(dateStr)
        .toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }
        );
};
// ==========================================
// ROLE AVATAR CLASS
// ==========================================

const roleAvatarClass = (role) => {

    const key =
        (role || 'customer')
            .toLowerCase();
    if (key === 'admin') {
        return 'role-admin';
    }
    if (key === 'hotel_manager') {
        return 'role-hotel-manager';
    }
    return 'role-customer';
};
// ==========================================
// STATUS CLASS
// ==========================================

const statusClass = (status) => {
    const key =
        (status || 'active')
            .toLowerCase();
    if (key === 'active') {
        return 'status-active';
    }
    if (key === 'blocked') {
        return 'status-blocked';
    }
    return 'status-inactive';
};

</script>

<style scoped>
/* ==========================================
   CONTENT
========================================== */

.content-wrap {
    padding: 24px 32px;
}

.section-desc {
    color: var(--text-muted, #6b7280);
    margin-bottom: 20px;
}

/* ==========================================
   TOOLBAR
========================================== */
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

    background: var(--bg-card, #fff);

    border: 1px solid var(--border-color, #e5e7eb);

    border-radius: 10px;

    padding: 10px 16px;

    flex: 1 1 260px;

    min-width: 220px;
}

.search-box input:focus {
    box-shadow: none;
}

.filter-select {
    border: 1px solid var(--border-color, #e5e7eb);

    border-radius: 10px;

    padding: 9px 14px;

    background: var(--bg-card, #fff);

    color: var(--text-main, #374151);

    font-size: 14px;

    min-width: 150px;
}

.results-count {
    font-size: 13px;
    color: var(--text-muted, #6b7280);
}


/* ==========================================
   TABLE
========================================== */

.panel-card {
    background: var(--bg-card, #fff);

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

    color: var(--text-muted, #6b7280);

    font-weight: 600;

    background: #fafbfb;

    border-bottom: 1px solid #eef0f2;

    padding: 14px 20px;
}

.users-table tbody tr {
    transition:
        background-color 0.12s ease;
}

.users-table tbody tr:hover {
    background-color: #fafbfb;
}

.users-table tbody td {
    padding: 14px 20px;

    vertical-align: middle;

    border-bottom: 1px solid var(--bg-card, #f3f4f6);

    font-size: 14px;

    color: var(--text-main, #374151);
}

.users-table tbody tr:last-child td {
    border-bottom: none;
}


/* ==========================================
   LOADING / EMPTY
========================================== */

.state-cell {
    text-align: center;

    padding: 48px 20px;

    color: var(--text-muted, #9ca3af);

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

    border: 2px solid var(--border-color, #e5e7eb);

    border-top-color: #0f7a5f;

    border-radius: 50%;

    animation: spin 0.7s linear infinite;
}

@keyframes spin {

    to {
        transform: rotate(360deg);
    }

}


/* ==========================================
   AVATAR
========================================== */

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

.role-admin {
    background: #fdeee7;
    color: #c2410c;
}

.role-hotel-manager {
    background: #eef2ff;
    color: #4338ca;
}

.role-customer {
    background: #e6f4ef;
    color: #0f7a5f;
}

.user-name {
    font-weight: 600;

    color: var(--text-main, #1f2937);

    line-height: 1.3;
}

.user-email {
    font-size: 12px;

    color: var(--text-muted, #9ca3af);
}


/* ==========================================
   ROLE
========================================== */

.role-pill {
    font-size: 12px;

    font-weight: 600;

    padding: 3px 10px;

    border-radius: 6px;

    display: inline-block;
}


/* ==========================================
   STATUS
========================================== */

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

.status-active {
    background: #e6f4ef;
    color: #0f7a5f;
}

.status-active .status-dot {
    background: #0f7a5f;
}

.status-inactive {
    background: var(--bg-card, #f3f4f6);
    color: var(--text-muted, #6b7280);
}

.status-inactive .status-dot {
    background: var(--text-muted, #9ca3af);
}

.status-blocked {
    background: #fdecec;
    color: #b91c1c;
}

.status-blocked .status-dot {
    background: #dc2626;
}


/* ==========================================
   ACTION BUTTON
========================================== */

.action-icon-btn {
    width: 32px;

    height: 32px;

    border-radius: 8px;

    border: 1px solid var(--border-color, #e5e7eb);

    background: var(--bg-card, #fff);

    display: inline-flex;

    align-items: center;

    justify-content: center;

    color: var(--text-muted, #6b7280);

    transition:
        background-color 0.12s ease,
        color 0.12s ease,
        border-color 0.12s ease;

    cursor: pointer;
}

.action-icon-btn:hover {
    background: var(--bg-card, #f3f4f6);

    color: var(--text-main, #1f2937);
}


/* ==========================================
   PAGINATION
========================================== */

.page-indicator {
    font-size: 13px;

    color: var(--text-muted, #6b7280);
}

.page-btn {
    border: 1px solid var(--border-color, #e5e7eb);

    background: var(--bg-card, #fff);

    border-radius: 8px;

    padding: 6px 14px;

    font-size: 13px;

    color: var(--text-main, #374151);

    cursor: pointer;
}

.page-btn:disabled {
    opacity: 0.5;

    cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
    background: var(--bg-card, #f3f4f6);
}


/* ==========================================
   USER DETAIL MODAL
========================================== */

.detail-overlay {
    position: fixed;

    inset: 0;

    background: rgba(15,
            23,
            42,
            0.45);

    display: flex;

    align-items: center;

    justify-content: center;

    z-index: 1050;

    padding: 20px;
}

.detail-modal {
    width: 100%;

    max-width: 650px;

    background: var(--bg-card, #fff);

    border-radius: 14px;

    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.15);

    overflow: hidden;
}


/* Modal Header */

.detail-header {
    display: flex;

    align-items: center;

    justify-content: space-between;

    padding: 20px 24px;

    border-bottom:
        1px solid #eef0f2;
}

.detail-header h5 {
    margin: 0 0 4px;

    color: var(--text-main, #1f2937);

    font-weight: 600;
}

.detail-header p {
    margin: 0;

    color: var(--text-muted, #9ca3af);

    font-size: 13px;
}

.close-btn {
    width: 34px;

    height: 34px;

    border: 1px solid var(--border-color, #e5e7eb);

    background: var(--bg-card, #fff);

    border-radius: 8px;

    color: var(--text-muted, #6b7280);

    display: flex;

    align-items: center;

    justify-content: center;

    cursor: pointer;
}

.close-btn:hover {
    background: var(--bg-card, #f3f4f6);

    color: var(--text-main, #1f2937);
}


/* Modal Body */

.detail-body {
    padding: 24px;
}


/* Profile */

.detail-profile {
    display: flex;

    align-items: center;

    gap: 14px;
}

.detail-avatar {
    width: 58px;

    height: 58px;

    border-radius: 50%;

    display: flex;

    align-items: center;

    justify-content: center;

    font-size: 20px;

    font-weight: 700;

    flex-shrink: 0;
}

.detail-profile h4 {
    margin: 0 0 4px;

    font-size: 18px;

    color: var(--text-main, #1f2937);
}

.detail-profile p {
    margin: 0;

    font-size: 13px;

    color: var(--text-muted, #9ca3af);
}


/* Detail Grid */

.detail-grid {
    display: grid;

    grid-template-columns:
        repeat(2, 1fr);

    gap: 18px 24px;
}

.detail-item {
    display: flex;

    flex-direction: column;

    gap: 5px;
}

.detail-label {
    font-size: 12px;

    color: var(--text-muted, #9ca3af);

    font-weight: 500;
}

.detail-value {
    font-size: 14px;

    color: var(--text-main, #374151);

    font-weight: 500;
}


/* Footer */

.detail-footer {
    display: flex;

    justify-content: flex-end;

    padding: 16px 24px;

    border-top:
        1px solid #eef0f2;
}

.btn-close-detail {
    border: 1px solid var(--border-color, #e5e7eb);

    background: var(--bg-card, #fff);

    border-radius: 8px;

    padding: 8px 18px;

    font-size: 14px;

    color: var(--text-main, #374151);

    cursor: pointer;
}

.btn-close-detail:hover {
    background: var(--bg-card, #f3f4f6);
}


/* Responsive */

@media (max-width: 600px) {

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-modal {
        max-width: 100%;
    }

    .content-wrap {
        padding: 20px 15px;
    }

}
</style>
