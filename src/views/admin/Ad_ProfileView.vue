<template>
    <div class="page-container">
        <!-- Topbar -->
        <div class="topbar bg-white px-5">
            <div class="ps-4">
                <div class="page-title">Profile Settings</div>
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

        <!-- Header Area for Profile -->
        <div class="header-section">
            <div>
                <div class="header-tag">ACCOUNT</div>
                <h2 class="header-title">My Profile</h2>
            </div>
            <div>
                <button class="btn btn-save">
                    <i class="fa-solid fa-check me-2"></i> Save Changes
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="content-wrapper px-4 pb-4">
            <div class="row g-4">
                <!-- Left Column: Profile Card -->
                <div class="col-md-4">
                    <div class="profile-card">
                        <div class="avatar-large mx-auto mb-3">P</div>
                        <h4 class="profile-name mb-1">Platform Admin</h4>
                        <div class="profile-role mb-4">Administrator</div>
                        <hr class="card-divider">
                        <div class="d-flex align-items-center justify-content-center text-muted font-sm mt-3">
                            <i class="fa-solid fa-shield-halved me-2"></i> StayLink Platform
                        </div>
                    </div>
                </div>

                <!-- Right Column: Forms -->
                <div class="col-md-8">
                    <!-- Personal Information Card -->
                    <div class="form-card mb-4">
                        <div class="card-title">Personal Information</div>
                        <div class="card-subtitle mb-4">Update your account information.</div>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" value="Platform">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" value="Admin">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" value="admin@staylink.com">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Phone</label>
                                <input type="text" class="form-control" value="+855 12 000 000">
                            </div>
                            <div class="col-md-12">
                                <label class="form-label">Role</label>
                                <input type="text" class="form-control bg-light" value="Administrator" disabled>
                            </div>
                        </div>
                    </div>

                    <!-- Security Card -->
                    <div class="form-card">
                        <div class="card-title text-dark">Security</div>
                        <div class="card-subtitle mb-4">Update your password.</div>
                        
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">New Password</label>
                                <input type="password" class="form-control" placeholder="........">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" placeholder="........">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// State could go here (e.g. const profile = ref({...}))
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

/* Profile Page Styles */
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 24px 24px 32px 24px;
}

.header-tag {
    font-size: 11px;
    font-weight: 800;
    color: #0f766e;
    letter-spacing: 1px;
    margin-bottom: 4px;
}

.header-title {
    font-size: 24px;
    color: #1e293b;
    margin-bottom: 4px;
    font-family: 'Georgia', serif; /* Gives the classic serif look from the design */
}

.header-subtitle {
    font-size: 14px;
    color: #64748b;
}

.btn-save {
    background-color: #0f766e;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-save:hover {
    background-color: #0d6059;
    color: white;
}

.profile-card {
    background-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #eef2f0;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.avatar-large {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #0f766e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: bold;
    box-shadow: 0 8px 16px rgba(15, 118, 110, 0.2);
}

.profile-name {
    font-size: 18px;
    color: #1e293b;
    font-family: 'Georgia', serif;
}

.profile-role {
    font-size: 13px;
    font-weight: 600;
    color: #0f766e;
}

.card-divider {
    border-color: #e2e8f0;
    opacity: 0.5;
    margin: 20px 0;
}

.form-card {
    background-color: #ffffff;
    border-radius: 12px;
    border: 1px solid #eef2f0;
    padding: 24px 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.card-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f766e;
}

.card-subtitle {
    font-size: 13px;
    color: #64748b;
}

.form-label {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}

.form-control {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    color: #334155;
}

.form-control:focus {
    border-color: #0f766e;
    box-shadow: 0 0 0 0.2rem rgba(15, 118, 110, 0.25);
}

.font-sm {
    font-size: 13px;
}
</style>
