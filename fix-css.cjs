const fs = require('fs');

function fixFile(filePath, extraCSS) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Because of UTF-16 garbage, we might have \u0000 bytes.
    // Let's just find the last occurrence of </style>
    const styleEnd = content.indexOf('</style>');
    if (styleEnd !== -1) {
        content = content.substring(0, styleEnd);
        fs.writeFileSync(filePath, content + extraCSS + '\n</style>', 'utf8');
        console.log('Fixed ' + filePath);
    }
}

const dashCSS = `
[data-bs-theme="dark"] .dashboard-page { background-color: #0f172a; color: #f8fafc; }
[data-bs-theme="dark"] .stat-card, [data-bs-theme="dark"] .mini-stat-card, [data-bs-theme="dark"] .panel-card, [data-bs-theme="dark"] .loading-card, [data-bs-theme="dark"] .error-card, [data-bs-theme="dark"] .donut-center, [data-bs-theme="dark"] .icon-btn, [data-bs-theme="dark"] .date-pill { background-color: #1e293b !important; border-color: #334155 !important; color: #f8fafc !important; }
[data-bs-theme="dark"] .stat-value, [data-bs-theme="dark"] .welcome-heading, [data-bs-theme="dark"] .panel-title, [data-bs-theme="dark"] .mini-stat-value, [data-bs-theme="dark"] .donut-pct, [data-bs-theme="dark"] .revenue-value, [data-bs-theme="dark"] .guest-name, [data-bs-theme="dark"] .amount-cell, [data-bs-theme="dark"] .page-title, [data-bs-theme="dark"] .user-chip .name { color: #f8fafc !important; }
[data-bs-theme="dark"] .stat-label, [data-bs-theme="dark"] .stat-foot, [data-bs-theme="dark"] .mini-stat-label, [data-bs-theme="dark"] .panel-sub, [data-bs-theme="dark"] .donut-label, [data-bs-theme="dark"] .revenue-label, [data-bs-theme="dark"] .guest-id, [data-bs-theme="dark"] .stay-date, [data-bs-theme="dark"] .page-subtitle, [data-bs-theme="dark"] .text-muted, [data-bs-theme="dark"] .table.bookings th { color: #94a3b8 !important; }
[data-bs-theme="dark"] .stat-icon, [data-bs-theme="dark"] .revenue-icon, [data-bs-theme="dark"] .avatar-circle, [data-bs-theme="dark"] .guest-avatar { background-color: #334155 !important; color: #f8fafc !important; }
[data-bs-theme="dark"] .revenue-summary { background-color: #1e293b !important; }
[data-bs-theme="dark"] .table.bookings td, [data-bs-theme="dark"] .revenue-row { border-color: #334155 !important; }
[data-bs-theme="dark"] .icon-btn:hover { background-color: #334155 !important; }
`;

fixFile('src/views/manager/DashMgView.vue', dashCSS);

const layoutCSS = `
[data-bs-theme="dark"] .manager-layout { background-color: #0f172a !important; }
`;

fixFile('src/components/layout/manager/Managerlayout.vue', layoutCSS);
