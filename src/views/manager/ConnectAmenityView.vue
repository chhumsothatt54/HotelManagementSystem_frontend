<template>
  <div class="connect-page">

    <!-- ================= TOPBAR ================= -->
    <div class="topbar bg-white border-bottom">
      <div>
        <h1 class="page-title mb-1">
          Connect Amenities
        </h1>

        <p class="page-subtitle mb-0">
          Assign amenities to rooms in your hotel
        </p>
      </div>

      <div class="d-flex align-items-center gap-3">

        <!-- Notification -->
        <button class="notification-btn position-relative">
          <i class="bi bi-bell"></i>
          <span class="notification-dot"></span>
        </button>

        <!-- Refresh -->
        <button
          class="btn btn-outline-success refresh-btn"
          @click="loadData"
          :disabled="manager.loading"
        >
          <i
            class="bi"
            :class="
              manager.loading
                ? 'bi-arrow-repeat spin'
                : 'bi-arrow-clockwise'
            "
          ></i>

          Refresh
        </button>

      </div>
    </div>


    <!-- ================= CONTENT ================= -->
    <div class="container-fluid content">

      <!-- Loading -->
      <div
        v-if="manager.loading && manager.roomAmenities.length === 0"
        class="card border-0 shadow-sm"
      >
        <div class="card-body loading-box">
          <div class="spinner-border text-success" role="status"></div>

          <span>
            Loading rooms...
          </span>
        </div>
      </div>


      <!-- Error -->
      <div
        v-else-if="manager.error"
        class="alert alert-danger d-flex align-items-center gap-2"
      >
        <i class="bi bi-exclamation-circle"></i>

        <span>
          {{ manager.error }}
        </span>
      </div>


      <!-- ================= MAIN ================= -->
      <div
        v-else
        class="row g-4 align-items-start"
      >

        <!-- ================= ROOMS ================= -->
        <div class="col-12 col-lg-4 col-xl-3">

          <div class="card rooms-card shadow-sm">

            <!-- Header -->
            <div class="card-header bg-white border-bottom">
              <h5 class="card-title mb-1">
                Hotel Rooms
              </h5>

              <p class="text-muted small mb-0">
                Select a room to manage its amenities.
              </p>
            </div>


            <!-- No rooms -->
            <div
              v-if="manager.roomAmenities.length === 0"
              class="card-body text-center py-5"
            >
              <i
                class="bi bi-door-open empty-icon"
              ></i>

              <h6 class="mt-3">
                No rooms found
              </h6>

              <p class="text-muted small mb-0">
                Create a room first before connecting amenities.
              </p>
            </div>


            <!-- Room list -->
            <div
              v-else
              class="list-group list-group-flush room-list"
            >

              <button
                v-for="room in manager.roomAmenities"
                :key="room.id"
                type="button"
                class="list-group-item list-group-item-action room-item border-0"
                :class="{
                  selected:
                    selectedRoom &&
                    Number(selectedRoom.id) === Number(room.id)
                }"
                @click="selectRoom(room)"
              >

                <div class="d-flex align-items-center gap-3">

                  <!-- Icon -->
                  <div class="room-icon flex-shrink-0">
                    <i class="bi bi-door-closed"></i>
                  </div>


                  <!-- Info -->
                  <div class="flex-grow-1 text-start">

                    <div class="fw-semibold room-name">
                      Room {{ room.room_number }}
                    </div>

                    <div class="small text-muted">
                      Floor {{ room.floor || "—" }}
                    </div>

                  </div>


                  <!-- Count -->
                  <span class="badge room-count">
                    {{ room.amenities?.length || 0 }}
                  </span>


                  <i
                    class="bi bi-chevron-right room-arrow"
                  ></i>

                </div>

              </button>

            </div>

          </div>

        </div>


        <!-- ================= DETAILS ================= -->
        <div class="col-12 col-lg-8 col-xl-9">

          <div class="card details-card shadow-sm">

            <!-- No room selected -->
            <div
              v-if="!selectedRoom"
              class="card-body select-room"
            >

              <div class="select-icon">
                <i class="bi bi-hand-index"></i>
              </div>

              <h4>
                Select a Room
              </h4>

              <p class="text-muted mb-0">
                Choose a room from the left to manage its amenities.
              </p>

            </div>


            <!-- ================= SELECTED ROOM ================= -->
            <div v-else>

              <!-- Room Header -->
              <div class="room-header p-4 border-bottom">

                <div
                  class="d-flex justify-content-between align-items-start gap-3"
                >

                  <div>

                    <div class="small text-muted text-uppercase">
                      Selected Room
                    </div>

                    <h3 class="room-title mb-1">
                      Room {{ selectedRoom.room_number }}
                    </h3>

                    <div class="text-muted small">
                      <i class="bi bi-layers me-1"></i>

                      Floor {{ selectedRoom.floor || "—" }}
                    </div>

                  </div>


                  <!-- Status -->
                  <span class="badge room-status">
                    {{ selectedRoom.status || "available" }}
                  </span>

                </div>

              </div>


              <!-- ================= CONNECTED ================= -->
              <div class="p-4 border-bottom">

                <div
                  class="d-flex justify-content-between align-items-start mb-3"
                >

                  <div>

                    <h5 class="section-title mb-1">
                      Connected Amenities
                    </h5>

                    <p class="text-muted small mb-0">
                      Amenities currently assigned to this room.
                    </p>

                  </div>


                  <span class="badge count-badge">
                    {{ selectedRoom.amenities?.length || 0 }}
                  </span>

                </div>


                <!-- Empty -->
                <div
                  v-if="
                    !selectedRoom.amenities ||
                    selectedRoom.amenities.length === 0
                  "
                  class="empty-amenities"
                >

                  <i class="bi bi-stars"></i>

                  <span>
                    No amenities connected yet.
                  </span>

                </div>


                <!-- Connected list -->
                <div
                  v-else
                  class="d-flex flex-column gap-2"
                >

                  <div
                    v-for="amenity in selectedRoom.amenities"
                    :key="amenity.id"
                    class="amenity-item"
                  >

                    <!-- Icon -->
                    <div class="amenity-icon">

                      <i
                        :class="
                          amenity.icon ||
                          'bi bi-stars'
                        "
                      ></i>

                    </div>


                    <!-- Information -->
                    <div class="flex-grow-1 min-width-0">

                      <div class="fw-semibold amenity-name">
                        {{ amenity.name }}
                      </div>

                      <div class="small text-muted text-truncate">
                        {{ amenity.description || "Amenity" }}
                      </div>

                    </div>


                    <!-- Remove -->
                    <button
                      type="button"
                      class="btn btn-sm remove-btn flex-shrink-0"
                      @click="removeAmenity(amenity)"
                    >

                      <i class="bi bi-x-lg me-1"></i>

                      Remove

                    </button>

                  </div>

                </div>

              </div>


              <!-- ================= ADD AMENITIES ================= -->
              <div class="p-4">

                <div class="mb-3">

                  <h5 class="section-title mb-1">
                    Add Amenities
                  </h5>

                  <p class="text-muted small mb-0">
                    Choose an amenity to connect to this room.
                  </p>

                </div>


                <!-- Available -->
                <div
                  v-if="availableToConnect.length > 0"
                  class="row g-3"
                >

                  <div
                    v-for="amenity in availableToConnect"
                    :key="amenity.id"
                    class="col-12 col-md-6"
                  >

                    <button
                      type="button"
                      class="available-item w-100 text-start"
                      @click="connectAmenity(amenity)"
                    >

                      <div
                        class="d-flex align-items-center gap-3"
                      >

                        <!-- Icon -->
                        <div class="available-icon flex-shrink-0">

                          <i
                            :class="
                              amenity.icon ||
                              'bi bi-stars'
                            "
                          ></i>

                        </div>


                        <!-- Text -->
                        <div class="flex-grow-1 min-width-0">

                          <div class="fw-semibold amenity-name">
                            {{ amenity.name }}
                          </div>

                          <div
                            class="small text-muted text-truncate"
                          >
                            {{
                              amenity.description ||
                              "Add amenity"
                            }}
                          </div>

                        </div>


                        <!-- Plus -->
                        <i
                          class="bi bi-plus-circle add-icon"
                        ></i>

                      </div>

                    </button>

                  </div>

                </div>


                <!-- All connected -->
                <div
                  v-else
                  class="empty-amenities"
                >

                  <i class="bi bi-check-circle"></i>

                  <span>
                    All available amenities are already
                    connected to this room.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup>
import {
  ref,
  computed,
  onMounted
} from "vue";

import { useManagerStore } from "@/stores/manager";

const manager = useManagerStore();

const selectedRoom = ref(null);


/*
|--------------------------------------------------------------------------
| Load data
|--------------------------------------------------------------------------
*/

onMounted(async () => {
  await loadData();
});


async function loadData() {
  try {

    await manager.getRoomAmenities();

    /*
    |--------------------------------------------------------------------------
    | Keep currently selected room after refresh
    |--------------------------------------------------------------------------
    */

    if (selectedRoom.value) {

      const updatedRoom =
        manager.roomAmenities.find(
          room =>
            Number(room.id) ===
            Number(selectedRoom.value.id)
        );

      if (updatedRoom) {
        selectedRoom.value = updatedRoom;
      }

    }

    /*
    |--------------------------------------------------------------------------
    | Auto select first room
    |--------------------------------------------------------------------------
    */

    if (
      !selectedRoom.value &&
      manager.roomAmenities.length > 0
    ) {
      selectedRoom.value =
        manager.roomAmenities[0];
    }

  } catch (error) {

    console.error(
      "Load room amenities error:",
      error
    );

  }
}


/*
|--------------------------------------------------------------------------
| Select room
|--------------------------------------------------------------------------
*/

function selectRoom(room) {
  selectedRoom.value = room;
}


/*
|--------------------------------------------------------------------------
| Available amenities
|--------------------------------------------------------------------------
*/

const availableToConnect = computed(() => {

  if (!selectedRoom.value) {
    return [];
  }

  const connectedIds =
    selectedRoom.value.amenities?.map(
      amenity => Number(amenity.id)
    ) || [];

  return manager.availableAmenities.filter(
    amenity =>
      !connectedIds.includes(
        Number(amenity.id)
      )
  );

});


/*
|--------------------------------------------------------------------------
| Connect amenity
|--------------------------------------------------------------------------
*/

async function connectAmenity(amenity) {

  if (!selectedRoom.value) {
    return;
  }

  try {

    await manager.attachAmenity(
      selectedRoom.value.id,
      amenity.id
    );


    /*
    |--------------------------------------------------------------------------
    | Update UI immediately
    |--------------------------------------------------------------------------
    */

    if (!selectedRoom.value.amenities) {
      selectedRoom.value.amenities = [];
    }


    const exists =
      selectedRoom.value.amenities.some(
        item =>
          Number(item.id) ===
          Number(amenity.id)
      );


    if (!exists) {

      selectedRoom.value.amenities.push(
        amenity
      );

    }

  } catch (error) {

    console.error(
      "Connect amenity error:",
      error
    );

  }

}


/*
|--------------------------------------------------------------------------
| Remove amenity
|--------------------------------------------------------------------------
*/

async function removeAmenity(amenity) {

  if (!selectedRoom.value) {
    return;
  }


  const confirmed = confirm(
    `Remove "${amenity.name}" from Room ${selectedRoom.value.room_number}?`
  );


  if (!confirmed) {
    return;
  }


  try {

    await manager.detachAmenity(
      selectedRoom.value.id,
      amenity.id
    );


    /*
    |--------------------------------------------------------------------------
    | Update UI immediately
    |--------------------------------------------------------------------------
    */

    selectedRoom.value.amenities =
      selectedRoom.value.amenities.filter(
        item =>
          Number(item.id) !==
          Number(amenity.id)
      );

  } catch (error) {

    console.error(
      "Remove amenity error:",
      error
    );

  }

}
</script>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

.connect-page {
  min-height: 100vh;
  background: var(--page-bg);
  color: #17231f;

  /*
   * Important:
   * Do NOT use overflow: hidden here.
   * It allows the whole page to scroll.
   */
}


/* =========================================================
   TOPBAR
========================================================= */

.topbar {
  min-height: var(--topbar-height);

  padding: 18px 28px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  position: sticky;
  top: 0;

  z-index: 20;
}


.page-title {
  margin: 0;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 28px;

  font-weight: 600;

  color: var(--sidebar-bg);
}


.page-subtitle {
  color: var(--text-muted);

  font-size: 13px;
}


/* =========================================================
   NOTIFICATION
========================================================= */

.notification-btn {
  width: 40px;
  height: 40px;

  border: 1px solid var(--card-border);

  border-radius: 50%;

  background: #ffffff;

  color: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;

  cursor: pointer;
}


.notification-btn:hover {
  background: var(--blue-light);
}


.notification-dot {
  position: absolute;

  top: 7px;
  right: 7px;

  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #e74c3c;
}


/* =========================================================
   REFRESH
========================================================= */

.refresh-btn {
  min-width: 100px;

  border-color: var(--accent);

  color: var(--accent);

  font-weight: 600;
}


.refresh-btn:hover {
  background: var(--accent);

  border-color: var(--accent);

  color: #ffffff;
}


/* =========================================================
   CONTENT
========================================================= */

.content {
  padding: 28px;

  /*
   * Important for the screenshot issue.
   * Content can grow naturally.
   */
  padding-bottom: 60px;
}


/* =========================================================
   CARDS
========================================================= */

.rooms-card,
.details-card {
  border: 1px solid var(--card-border);

  border-radius: 14px;

  background: #ffffff;
}


.rooms-card {
  overflow: hidden;
}


.details-card {
  overflow: visible;
}


/* =========================================================
   ROOM LIST
========================================================= */

.room-list {
  max-height: calc(100vh - 190px);

  overflow-y: auto;
}


.room-item {
  padding: 14px 16px;

  background: #ffffff;

  transition: 0.2s ease;

  color: #17231f;
}


.room-item:hover {
  background: #f4f8f6;
}


.room-item.selected {
  background: #e8f6f2;
}


.room-icon {
  width: 40px;
  height: 40px;

  border-radius: 9px;

  background: #f0f5f3;

  color: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
}


.room-item.selected .room-icon {
  background: var(--accent);

  color: #ffffff;
}


.room-name {
  color: var(--sidebar-bg);

  font-size: 14px;
}


.room-count {
  min-width: 25px;

  background: #e8f6f2;

  color: var(--accent);

  font-size: 11px;

  border-radius: 20px;
}


.room-arrow {
  color: #9aa7a3;

  font-size: 12px;
}


/* =========================================================
   EMPTY
========================================================= */

.empty-icon {
  font-size: 35px;

  color: var(--accent);
}


.empty-amenities {
  padding: 20px;

  border: 1px dashed #d5e0dc;

  border-radius: 10px;

  background: #fafcfb;

  color: var(--text-muted);

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  font-size: 13px;
}


.empty-amenities i {
  color: var(--accent);

  font-size: 17px;
}


/* =========================================================
   SELECT ROOM
========================================================= */

.select-room {
  min-height: 500px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;
}


.select-icon {
  width: 70px;
  height: 70px;

  margin-bottom: 18px;

  border-radius: 50%;

  background: #e8f6f2;

  color: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 27px;
}


/* =========================================================
   ROOM HEADER
========================================================= */

.room-title {
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  color: var(--sidebar-bg);

  font-size: 26px;
}


.room-status {
  background: #e8f6f2;

  color: var(--accent);

  padding: 7px 12px;

  border-radius: 20px;

  font-size: 11px;

  text-transform: capitalize;
}


/* =========================================================
   SECTION
========================================================= */

.section-title {
  font-family:
    Georgia,
    "Times New Roman",
    serif;

  color: var(--sidebar-bg);

  font-size: 18px;
}


.count-badge {
  min-width: 27px;

  background: #e8f6f2;

  color: var(--accent);

  border-radius: 20px;

  padding: 6px 9px;
}


/* =========================================================
   CONNECTED AMENITY
========================================================= */

.amenity-item {
  min-height: 62px;

  padding: 11px;

  border: 1px solid var(--card-border);

  border-radius: 10px;

  background: #ffffff;

  display: flex;
  align-items: center;

  gap: 12px;

  transition: 0.2s ease;
}


.amenity-item:hover {
  border-color: #cbded8;

  background: #fcfefd;
}


.amenity-icon,
.available-icon {
  width: 38px;
  height: 38px;

  flex-shrink: 0;

  border-radius: 8px;

  background: #e8f6f2;

  color: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;
}


.amenity-name {
  color: var(--sidebar-bg);

  font-size: 13px;
}


.min-width-0 {
  min-width: 0;
}


/* =========================================================
   REMOVE
========================================================= */

.remove-btn {
  background: #fff2f2;

  border-color: #fff2f2;

  color: #c84e4e;

  font-size: 11px;
}


.remove-btn:hover {
  background: #ffe5e5;

  border-color: #ffe5e5;

  color: #b53d3d;
}


/* =========================================================
   AVAILABLE
========================================================= */

.available-item {
  padding: 14px;

  border: 1px solid var(--card-border);

  border-radius: 10px;

  background: #ffffff;

  transition: 0.2s ease;

  color: #17231f;
}


.available-item:hover {
  border-color: var(--accent);

  background: #f5fbf9;

  transform: translateY(-1px);

  box-shadow:
    0 4px 12px
    rgba(6, 59, 50, 0.06);
}


.add-icon {
  color: var(--accent);

  font-size: 18px;
}


/* =========================================================
   LOADING
========================================================= */

.loading-box {
  min-height: 250px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  color: var(--text-muted);
}


/* =========================================================
   SPIN
========================================================= */

.spin {
  animation: spin 0.7s linear infinite;
}


@keyframes spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 991px) {

  .topbar {
    position: relative;
  }

  .room-list {
    max-height: 400px;
  }

}


@media (max-width: 575px) {

  .topbar {
    padding: 16px;

    align-items: flex-start;

    flex-direction: column;
  }


  .topbar > div:last-child {
    width: 100%;

    justify-content: space-between;
  }


  .content {
    padding: 16px;

    padding-bottom: 40px;
  }


  .room-header {
    padding: 20px !important;
  }


  .room-title {
    font-size: 22px;
  }


  .amenity-item {
    align-items: flex-start;
  }


  .remove-btn {
    padding: 6px 8px;
  }

}

</style>