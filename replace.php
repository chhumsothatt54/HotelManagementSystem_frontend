<?php
$file = 'D:\personal\project\project\HotelManagementSystem_api\app\Http\Controllers\AdminController.php';
$content = file_get_contents($file);

$search = <<<EOT
        \$totalRooms = Room::count();

        return response()->json([
            'result' => true,
            'message' => 'Admin Dashboard',
            'data' => [
                'total_users' => \$totalUsers,
                'total_customers' => \$totalCustomers,
                'total_manager' => \$totalManagers,
                'total_hotels' => \$totalHotels,
                'pending_hotels' => \$pendingHotels,
                'total_bookings' => \$totalBookings,
                'total_payments' => \$totalPayments,
                'total_revenue' => \$totalRevenue,
                'total_rooms'=>\$totalRooms
            ],
        ]);
EOT;

$replace = <<<EOT
        \$totalRooms = Room::count();
        
        \$pendingHotelsList = Hotel::with('manager')->where('status', 'pending')->limit(5)->get();

        return response()->json([
            'result' => true,
            'message' => 'Admin Dashboard',
            'data' => [
                'total_users' => \$totalUsers,
                'total_customers' => \$totalCustomers,
                'total_manager' => \$totalManagers,
                'total_hotels' => \$totalHotels,
                'pending_hotels' => \$pendingHotels,
                'pending_hotels_list' => \$pendingHotelsList,
                'total_bookings' => \$totalBookings,
                'total_payments' => \$totalPayments,
                'total_revenue' => \$totalRevenue,
                'total_rooms'=>\$totalRooms
            ],
        ]);
EOT;

if (strpos($content, '$totalRooms = Room::count();') !== false) {
    // Normalizing newlines just in case
    $search = str_replace("\r\n", "\n", $search);
    $content = str_replace("\r\n", "\n", $content);
    $newContent = str_replace($search, $replace, $content);
    if ($content !== $newContent) {
        file_put_contents($file, $newContent);
        echo "Successfully updated AdminController.php";
    } else {
        echo "Could not replace content. The search string didn't exactly match.";
    }
} else {
    echo "File does not contain the expected pattern.";
}
?>
