```vue
<template>
  <!-- Top bar -->
  <div class="topbar bg-white">
    <div>
      <h1 class="page-title brand-serif">Price</h1>
      <div class="page-subtitle">
        Manage your account and property information
      </div>
    </div>

    <div class="d-flex align-items-center gap-3">
      <!-- Notification -->
      <div class="icon-btn">
        <i class="bi bi-bell"></i>
        <span class="dot"></span>
      </div>
    </div>
  </div>

  <div class="page-content">

    <!-- Room Management Header -->
    <div
      class="mb-1 text-uppercase fw-bold"
      style="
        font-size: 0.725rem;
        letter-spacing: 0.5px;
        color: var(--blue);
      "
    >
      ROOM MANAGEMENT
    </div>

    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="fw-bold mb-0" style="color: #1f2937;">
        Pricing
      </h2>

      <button
        class="btn btn-emerald d-flex align-items-center gap-2"
        @click="handleSave"
        :disabled="managerStore.loading || saving || !localRoomTypes.length"
      >
        <span
          v-if="saving"
          class="spinner-border spinner-border-sm"
          role="status"
        ></span>

        <i v-else class="bi bi-check-lg"></i>

        {{ saving ? 'Saving...' : 'Save Pricing' }}
      </button>
    </div>

    <p class="text-muted mb-4" style="font-size: 0.875rem;">
      Configure your room rates and room type pricing.
    </p>

    <!-- Success Alert -->
    <div
      v-if="successMessage"
      class="alert alert-success alert-dismissible fade show mb-4"
      role="alert"
    >
      {{ successMessage }}

      <button
        type="button"
        class="btn-close"
        @click="successMessage = null"
      ></button>
    </div>

    <!-- Error Alert -->
    <div
      v-if="managerStore.error"
      class="alert alert-danger alert-dismissible fade show mb-4"
      role="alert"
    >
      {{ managerStore.error }}

      <button
        type="button"
        class="btn-close"
        @click="managerStore.clearError()"
      ></button>
    </div>

    <!-- Pricing Table -->
    <div class="card-table-wrapper">
      <div class="table-responsive">

        <table class="table align-middle mb-0">

          <thead>
            <tr class="text-uppercase">
              <th scope="col" style="width: 35%;">
                ROOM TYPE
              </th>

              <th scope="col" style="width: 25%;">
                MAX GUESTS
              </th>

              <th scope="col" style="width: 40%;">
                PRICE ($)
              </th>
            </tr>
          </thead>

          <tbody>

            <!-- Loading -->
            <tr
              v-if="managerStore.loading && !localRoomTypes.length"
            >
              <td
                colspan="3"
                class="text-center py-4 text-muted"
              >
                <div
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>

                Loading pricings...
              </td>
            </tr>

            <!-- Empty -->
            <tr
              v-else-if="!localRoomTypes.length"
            >
              <td
                colspan="3"
                class="text-center py-4 text-muted"
              >
                No room types found.
              </td>
            </tr>

            <!-- Room Types -->
            <tr
              v-else
              v-for="room in localRoomTypes"
              :key="room.id"
            >

              <!-- Room Name -->
              <td class="fw-bold">
                {{ room.name }}
              </td>

              <!-- Capacity -->
              <td>
                {{ room.max_guests }} Guests
              </td>

              <!-- Price -->
              <td>
                <div class="input-group style-input-group">

                  <span class="input-group-text">
                    $
                  </span>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control price-input"
                    v-model.number="room.price_per_night"
                  />

                </div>
              </td>

            </tr>

          </tbody>

        </table>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useManagerStore } from '@/stores/manager'

const managerStore = useManagerStore()

const localRoomTypes = ref([])
const saving = ref(false)
const successMessage = ref(null)


// =====================================================
// GET ROOM TYPES
// =====================================================

onMounted(async () => {
  await managerStore.getRoomTypes()
})


// =====================================================
// COPY STORE DATA TO LOCAL FORM
// =====================================================

watch(
  () => managerStore.roomTypes,
  (newVal) => {
    localRoomTypes.value = JSON.parse(
      JSON.stringify(newVal || [])
    )
  },
  {
    immediate: true,
    deep: true
  }
)


// =====================================================
// SAVE PRICING
// =====================================================

const handleSave = async () => {
  saving.value = true
  successMessage.value = null
  managerStore.clearError()

  try {
    const updatePromises = localRoomTypes.value.map((room) =>
      managerStore.updateRoomType(room.id, {
        price_per_night: room.price_per_night
      })
    )

    await Promise.all(updatePromises)

    successMessage.value = 'Room pricings updated successfully!'

    await managerStore.getRoomTypes()
  } catch (err) {
    console.error('Failed to update pricing:', err)
  } finally {
    saving.value = false
  }
}
</script>



<style scoped>
:root {
  --sidebar-bg: #0c3b34;
  --sidebar-bg-light: #123f37;
  --accent: #087F68;
  --accent-light: #0fa360;
  --page-bg: #f4f6f5;
  --card-border: #e7eae9;
  --text-muted: #6b7674;
  --sidebar-width: 260px;
  --sidebar-width-collapsed: 76px;
  --topbar-height: 78px;
}
/* Sidebar Styling */
    .sidebar {
      width: 250px;
      background-color: var(--sidebar-bg);
      color: #ffffff;
      flex-shrink: 0;
      min-height: 100vh;
    }

    .sidebar .nav-link {
      color: rgba(255, 255, 255, 0.7);
      padding: 0.6rem 1rem;
      border-radius: 8px;
      margin-bottom: 2px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar .nav-link:hover {
      color: #ffffff;
      background-color: var(--sidebar-hover);
    }

    .sidebar .nav-link.active {
      color: #ffffff;
      background-color: var(--sidebar-active);
      font-weight: 500;
    }

    .sidebar-category {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
    }

    /* Top Navigation Header */
    .top-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 2rem;
    }

    /* Buttons & Avatars */
    .btn-emerald {
      background-color: var(--accent);
      color: #ffffff;
      border: none;
      font-weight: 500;
      border-radius: 8px;
      padding: 0.5rem 1.25rem;
    }

    .btn-emerald:hover {
      background-color: var(--accent-light);
      color: #ffffff;
    }

    .avatar-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--primary-emerald);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }

    /* Card & Table Styling */
    .card-table-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      border: none;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      padding: 1.5rem;
    }

    .table th {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #6b7280;
      border-bottom-width: 1px;
      padding-bottom: 1rem;
    }

    .table td {
      padding: 1.2rem 0.5rem;
      color: #111827;
      font-size: 0.875rem;
      border-bottom-color: #f3f4f6;
    }

    /* Custom Form Input Control */
    .price-input {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.5rem 0.85rem;
      font-size: 0.875rem;
      color: #374151;
      width: 100%;
      max-width: 220px;
    }

    .price-input:focus {
      outline: none;
      border-color: var(--primary-emerald);
      box-shadow: 0 0 0 0.2rem rgba(10, 122, 92, 0.15);
    }
</style>