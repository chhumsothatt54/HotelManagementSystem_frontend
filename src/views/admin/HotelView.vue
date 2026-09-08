<template>
    <div>
        <!-- Topbar -->
        <div class="topbar bg-white">
            <div class="ps-4">
                <div class="page-title">Dashboard</div>
                <div class="page-subtitle">Platform performance overview</div>
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

        <!-- Hotels -->
        <div class="page-body">
            <div class="eyebrow">Properties</div>
            <h1 class="section-heading">Hotels</h1>
            <p class="section-sub">Approve, reject, or manage hotels created by managers.</p>

            <!-- Filter pills -->
            <div class="filter-row">
                <button
                    v-for="filter in filters"
                    :key="filter.value"
                    class="filter-pill"
                    :class="{ active: activeFilter === filter.value }"
                    @click="activeFilter = filter.value"
                >
                    {{ filter.label }}
                </button>
            </div>

            <!-- Table card -->
            <div class="panel-card mt-3">
                <table class="hotel-table">
                    <thead>
                        <tr>
                            <th>Hotel</th>
                            <th>Manager</th>
                            <th>Location</th>
                            <th>Rooms</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hotel in filteredHotels" :key="hotel.id">
                            <td class="hotel-name">{{ hotel.name }}</td>
                            <td class="text-muted">{{ hotel.manager }}</td>
                            <td class="text-muted">{{ hotel.location }}</td>
                            <td class="text-muted">{{ hotel.rooms }}</td>
                            <td>
                                <span class="status-chip" :class="`status-${hotel.status}`">
                                    {{ hotel.status }}
                                </span>
                            </td>
                            <td class="text-end">
                                <div class="action-group">
                                    <!-- Pending: quick approve/reject -->
                                    <template v-if="hotel.status === 'pending'">
                                        <button class="icon-action approve" @click="$emit('approve', hotel)">
                                            <i class="fa-solid fa-check"></i>
                                        </button>
                                        <button class="icon-action reject" @click="$emit('reject', hotel)">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </template>

                                    <!-- Otherwise: status dropdown -->
                                    <select
                                        v-else
                                        class="status-select"
                                        :value="hotel.status"
                                        @change="$emit('status-change', hotel, $event.target.value)"
                                    >
                                        <option value="approved">approved</option>
                                        <option value="rejected">rejected</option>
                                        <option value="inactive">inactive</option>
                                    </select>

                                    <button class="icon-action delete" @click="$emit('delete', hotel)">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="filteredHotels.length === 0" class="empty-state">
                    No hotels match this filter.
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HotelsPage",
    props: {
        // Swap this default for real data from your API/store.
        hotels: {
            type: Array,
            default: () => ([
                { id: 1, name: "Mekong Riverside Hotel", manager: "Sokha Manager", location: "Phnom Penh, Cambodia", rooms: 5, status: "approved" },
                { id: 2, name: "Angkor Boutique Suites", manager: "Dara Manager", location: "Siem Reap, Cambodia", rooms: 12, status: "pending" },
                { id: 3, name: "Sihanoukville Bay Resort", manager: "Dara Manager", location: "Sihanoukville, Cambodia", rooms: 20, status: "approved" },
                { id: 4, name: "Battambang Heritage Inn", manager: "Sokha Manager", location: "Battambang, Cambodia", rooms: 8, status: "rejected" },
            ]),
        },
    },
    emits: ["approve", "reject", "status-change", "delete"],
    data() {
        return {
            activeFilter: "all",
            filters: [
                { label: "All", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
                { label: "Inactive", value: "inactive" },
            ],
        };
    },
    computed: {
        filteredHotels() {
            if (this.activeFilter === "all") return this.hotels;
            return this.hotels.filter(h => h.status === this.activeFilter);
        },
    },
};
</script>

<style scoped>
.page-body {
    padding: 28px 32px 40px;
}

.eyebrow {
    color: #0B6E5C;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
}

.section-heading {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 34px;
    font-weight: 500;
    color: #1A1D1B;
    margin: 0 0 6px;
}

.section-sub {
    color: #6B7570;
    font-size: 14px;
    margin-bottom: 20px;
}

/* Filter pills */
.filter-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.filter-pill {
    border: 1px solid #E1E5E2;
    background: #fff;
    color: #4B534E;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.filter-pill:hover {
    border-color: #0B6E5C;
}

.filter-pill.active {
    background: #0B6E5C;
    border-color: #0B6E5C;
    color: #fff;
}

/* Table card */
.panel-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #ECEFEC;
    padding: 4px 0;
}

.hotel-table {
    width: 100%;
    border-collapse: collapse;
}

.hotel-table thead th {
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #8A928D;
    font-weight: 600;
    padding: 16px 24px;
    border-bottom: 1px solid #EFF1EF;
}

.hotel-table tbody td {
    padding: 16px 24px;
    font-size: 14px;
    border-bottom: 1px solid #F3F5F3;
    vertical-align: middle;
}

.hotel-table tbody tr:last-child td {
    border-bottom: none;
}

.hotel-name {
    font-weight: 600;
    color: #1A1D1B;
}

.text-muted {
    color: #6B7570;
}

/* Status chips */
.status-chip {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: lowercase;
}

.status-approved {
    background: #E2F3EC;
    color: #0F7A55;
}

.status-pending {
    background: #FBF0DA;
    color: #A8730C;
}

.status-rejected {
    background: #FBE7E7;
    color: #C23A3A;
}

.status-inactive {
    background: #EEEFEE;
    color: #6B7570;
}

/* Actions */
.action-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
}

.status-select {
    border: 1px solid #E1E5E2;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 13px;
    color: #333;
    background: #fff;
}

.icon-action {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #E1E5E2;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
}

.icon-action.approve {
    color: #0F7A55;
    border-color: #CDEBDD;
}
.icon-action.approve:hover {
    background: #E2F3EC;
}

.icon-action.reject {
    color: #C23A3A;
    border-color: #F5CFCF;
}
.icon-action.reject:hover {
    background: #FBE7E7;
}

.icon-action.delete {
    color: #C23A3A;
}
.icon-action.delete:hover {
    background: #FBE7E7;
}

.empty-state {
    padding: 40px 24px;
    text-align: center;
    color: #8A928D;
    font-size: 14px;
}
</style>