/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaSearch,
  FaTruck,
  FaEdit,
  FaDollarSign,
  FaStar,
  FaBars,
  FaTimes,
  FaSave,
  FaCamera,
  FaCalendar,
  FaMapMarkerAlt,
  FaChartPie,
  FaBox,
  FaUser,
  FaRupeeSign,
} from "react-icons/fa";
import {
  getDriverOrders,
  getDriverDashboard,
  updateDriverProfile,
  getDriverEarningsByOrder,
  getDriverTotalEarnings,
  searchDriverOrders,
  updateDriverOrderStatus,
  markEarningPaid,
  getDriverRatings,
  getDriverAverageRating,
  getDriverProfile,
  clearDriverError,
} from "../redux/driverSlice";
import { logout } from "../redux/authSlice";

export default function DriverDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux states
  const { user } = useSelector((state) => state.auth);
  const {
    dashboard,
    profile,
    orders,
    earnings,
    ratings,
    totalEarnings,
    averageRating,
    loading,
    error,
  } = useSelector((state) => state.driver);

  // Memoized localStorage user
  const storedUser = useMemo(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }, []);
  const userData = user || storedUser;

  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [orderFilter, setOrderFilter] = useState({ query: "" });
  const [updateProfileForm, setUpdateProfileForm] = useState({
    phoneNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    maxLoadKg: "",
    licenseNumber: "",
  });

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if not driver
  useEffect(() => {
    if (!userData || !userData.id || userData.role !== "DRIVER") {
      toast.error("Access denied. Redirecting to login.");
      navigate("/login");
    }
  }, [userData, navigate]);

  // Check profile role after load
  useEffect(() => {
    if (profile && profile.role !== "DRIVER") {
      toast.error("Access denied. You are not a driver.");
      navigate("/login");
    }
  }, [profile, navigate]);

  // Fetch all driver data using userData.id
  useEffect(() => {
    if (!userData?.id || userData?.role !== "DRIVER") return;

    const driverId = userData.id;

    const fetchDriverData = async () => {
      try {
        await Promise.all([
          dispatch(getDriverProfile(driverId)).unwrap(),
          dispatch(getDriverDashboard(driverId)).unwrap(),
          dispatch(getDriverOrders(driverId)).unwrap(),
          dispatch(getDriverEarningsByOrder(driverId)).unwrap(),
          dispatch(getDriverTotalEarnings(driverId)).unwrap(),
          dispatch(getDriverRatings(driverId)).unwrap(),
          dispatch(getDriverAverageRating(driverId)).unwrap(),
        ]);
      } catch (err) {
        console.error("Driver data fetch failed:", err);
        toast.error("Failed to load some driver data");
      }
    };

    fetchDriverData();
  }, [dispatch, userData?.id, userData?.role]);

  // Populate editable profile form
  useEffect(() => {
    if (!profile) return;
    setUpdateProfileForm({
      phoneNumber: profile.phoneNumber || "",
      vehicleNumber: profile.vehicleNumber || "",
      vehicleType: profile.vehicleType || "",
      maxLoadKg: profile.maxLoadKg || "",
      licenseNumber: profile.licenseNumber || "",
    });
  }, [profile]);

  // Refetch data helper
  const refetchData = () => {
    if (!userData?.id) return;
    const driverId = userData.id;
    dispatch(getDriverDashboard(driverId));
    dispatch(getDriverOrders(driverId));
    dispatch(getDriverEarningsByOrder(driverId));
    dispatch(getDriverTotalEarnings(driverId));
    dispatch(getDriverRatings(driverId));
    dispatch(getDriverAverageRating(driverId));
  };

  // Filter orders
  const handleFilterOrders = (e) => {
    e.preventDefault();
    const { query } = orderFilter;
    if (!query.trim()) {
      if (!userData?.id) return;
      dispatch(getDriverOrders(userData.id));
      return;
    }
    dispatch(searchDriverOrders({ driverId: userData.id, query }))
      .unwrap()
      .then(() => toast.success("Filtered orders loaded"))
      .catch(() => toast.error("Filter failed"));
  };

  // Clear order filters
  const handleClearFilter = () => {
    setOrderFilter({ query: "" });
    if (!userData?.id) return;
    dispatch(getDriverOrders(userData.id))
      .unwrap()
      .then(() => toast.info("Showing all orders"))
      .catch(() => toast.error("Failed to load all orders"));
  };

  // Update order status
  const handleUpdateOrderStatus = (driverOrderId, status) => {
    dispatch(updateDriverOrderStatus({ driverOrderId, status }))
      .unwrap()
      .then(() => {
        toast.success(`Order status updated to ${status}`);
        refetchData();
      })
      .catch(() => toast.error("Failed to update order status"));
  };

  // Mark earning as paid
  const handleMarkPaid = (earningId) => {
    dispatch(markEarningPaid(earningId))
      .unwrap()
      .then(() => {
        toast.success("Earning marked as paid");
        refetchData();
      })
      .catch(() => toast.error("Failed to mark as paid"));
  };

  // Update profile form submit
  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    const userId = Number(userData?.id);
    if (!userId || isNaN(userId)) return toast.error("User ID missing");

    if (profileImageFile && profileImageFile.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB");
      return;
    }

    const editableKeys = [
      "phoneNumber",
      "vehicleNumber",
      "vehicleType",
      "maxLoadKg",
      "licenseNumber",
    ];

    const formData = new FormData();
    editableKeys.forEach((key) => {
      if (updateProfileForm[key]) {
        formData.append(
          key,
          key === "maxLoadKg" ? Number(updateProfileForm[key]) : updateProfileForm[key]
        );
      }
    });

    if (profileImageFile) formData.append("profileImageFile", profileImageFile);

    toast.info("Updating profile...");
    dispatch(updateDriverProfile({ userId, data: formData }))
      .unwrap()
      .then((data) => {
        toast.success("Profile updated successfully");
        setProfileImageFile(null);
        setUpdateProfileForm({
          phoneNumber: data.phoneNumber || "",
          vehicleNumber: data.vehicleNumber || "",
          vehicleType: data.vehicleType || "",
          maxLoadKg: data.maxLoadKg || "",
          licenseNumber: data.licenseNumber || "",
        });
        refetchData();
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  // Tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { id: "orders", label: "Orders", icon: <FaTruck /> },
    { id: "earnings", label: "Earnings", icon: <FaDollarSign /> },
    { id: "ratings", label: "Ratings", icon: <FaStar /> },
    { id: "update-profile", label: "Update Profile", icon: <FaEdit /> },
  ];

  // Loading state
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-green-800 text-white">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mb-4"
        />
        <h2 className="text-2xl font-semibold text-green-300">
          Loading your dashboard...
        </h2>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-400 text-lg bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            dispatch(clearDriverError());
            refetchData();
          }}
          className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );

  // Current profile display
  const currentProfile = profile || dashboard?.profile || {};

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isDesktop ? 0 : sidebarOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed lg:static z-40 h-full w-64 bg-green-800/30 backdrop-blur-xl border-r border-white/20 p-4 flex flex-col justify-between shadow-lg"
      >
        <div>
          {/* Sidebar Profile */}
          <div className="flex flex-col items-center mb-8">
            {currentProfile.profileImageUrl ? (
              <img
                src={currentProfile.profileImageUrl}
                alt="Driver"
                className="w-20 h-20 rounded-full border-2 border-green-400 object-cover"
              />
            ) : (
              <FaUserCircle className="text-6xl text-green-400" />
            )}
            <h2 className="mt-3 text-lg font-bold">
              {currentProfile.firstName || userData?.firstName}{" "}
              {currentProfile.lastName || userData?.lastName}
            </h2>
            <p className="text-green-300 text-sm">{userData?.role}</p>
            <button
              className="mt-3 text-sm px-3 py-1 bg-green-700/60 hover:bg-green-600 rounded-md"
              onClick={() => setActiveTab("update-profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-green-700/40"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            onClick={() => {
              dispatch(logout());
              toast.info("Logged out successfully");
              navigate("/login");
            }}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all"
          >
            Logout
          </button>
          <p className="text-xs text-center text-gray-400 mt-4">
            © 2025 AgriSync. All rights reserved.
          </p>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Toggle */}
      {!isDesktop && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 right-4 z-50 bg-green-700 p-2 rounded-md text-white"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Main content area */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
          {tabs.find((t) => t.id === activeTab)?.label}
        </h1>

        {/* Dashboard tab content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Earnings",
                  value: `₹${dashboard?.summary?.totalEarningsAllTime || 0}`,
                  icon: <FaRupeeSign className="text-2xl" />,
                },
                {
                  title: "Earnings Last 30 Days",
                  value: `₹${dashboard?.summary?.earningsLast30Days || 0}`,
                  icon: <FaRupeeSign className="text-2xl" />,
                },
                {
                  title: "Total Orders",
                  value: dashboard?.summary?.totalOrdersAssigned || 0,
                  icon: <FaTruck className="text-2xl" />,
                },
                {
                  title: "Average Rating",
                  value: dashboard?.summary?.averageRating ? `${dashboard.summary.averageRating}/5` : "0/5",
                  icon: <FaStar className="text-2xl" />,
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-green-700/30 rounded-2xl border border-green-400/20 backdrop-blur-sm hover:bg-green-700/40 transition-all flex items-center gap-4"
                >
                  <div className="p-2 bg-green-600/30 rounded-xl">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-300">{card.title}</h3>
                    <p className="text-3xl font-bold text-green-400">
                      {card.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaTruck /> Recent Orders
                </h3>
                {dashboard?.recentOrders?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recentOrders.slice(0, 3).map((order, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">#{order.orderId} - {order.cropType}</span>
                        <span className={`font-semibold ${
                          order.orderStatus === "DELIVERED" ? "text-green-400" 
                          : order.orderStatus === "IN_TRANSIT" ? "text-blue-400"
                          : "text-yellow-400"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No recent orders.</p>
                )}
              </motion.div>

              {/* Recent Earnings section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaRupeeSign /> Recent Earnings
                </h3>
                {dashboard?.recentEarnings?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recentEarnings.slice(0, 3).map((earning, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">Driver Order #{earning.driverOrderId}</span>
                        <span className="font-semibold text-green-400">
                          ₹{earning.amount} {earning.paid ? "(Paid)" : "(Pending)"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No recent earnings.</p>
                )}
              </motion.div>
            </div>

            {/* Recent Ratings section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                <FaStar /> Recent Ratings
              </h3>
              {dashboard?.recentRatings?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentRatings.slice(0, 3).map((rating, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, j) => (
                          <FaStar
                            key={j}
                            className={j < rating.rating ? "text-yellow-400 fill-current" : "text-gray-400"}
                            size={14}
                          />
                        ))}
                      </div>
                      <span>"{rating.comment}" - {rating.ratedByName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No ratings yet.</p>
              )}
            </motion.div>
          </div>
        )}

        {/* Orders tab content */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Filter form */}
            <form
              onSubmit={handleFilterOrders}
              className="max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-green-400/30 backdrop-blur-sm flex gap-4 items-center"
            >
              <input
                type="text"
                placeholder="Search orders (e.g., order ID, status)"
                value={orderFilter.query}
                onChange={(e) =>
                  setOrderFilter({ ...orderFilter, query: e.target.value })
                }
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaSearch /> Filter
              </button>
              <button
                type="button"
                onClick={handleClearFilter}
                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold"
              >
                Clear
              </button>
            </form>

            {/* Orders list */}
            <div className="space-y-4">
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:bg-white/20 transition-all shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                          <FaBox className="text-green-300 text-lg" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-green-300">
                            Order #{order.orderId}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Produce: {order.cropType || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.assignedAt || order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-green-400">
                        ₹{order.totalAmount || (order.pricePerKg * order.quantityKg)}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <p className="text-gray-300 flex items-center gap-2">
                          <FaUser className="text-green-400" />
                          Buyer: {order.buyerName}
                        </p>
                        <p className="text-gray-300 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-400" />
                          From: {order.city}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-300 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-400" />
                          To: {order.deliveryAddress || "N/A"}
                        </p>
                        {order.deliveryExpectedAt && (
                          <p className="text-gray-300 flex items-center gap-2">
                            <FaCalendar className="text-green-400" />
                            Expected: {new Date(order.deliveryExpectedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status update buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-green-400/20">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : order.orderStatus === "IN_TRANSIT"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : order.orderStatus === "PICKED_UP"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <div className="flex gap-2">
                        {order.orderStatus === "ASSIGNED" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "PICKED_UP")}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs text-white"
                          >
                            Pick Up
                          </button>
                        )}
                        {order.orderStatus === "PICKED_UP" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "IN_TRANSIT")}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                          >
                            In Transit
                          </button>
                        )}
                        {order.orderStatus === "IN_TRANSIT" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center py-8">
                  No orders found.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Earnings tab content */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4">
                  Total Earnings: ₹{dashboard?.summary?.totalEarningsAllTime || totalEarnings || 0}
                </h3>
              </motion.div>
              {earnings?.length > 0 ? (
                earnings.map((earning) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-700/20 rounded-xl p-4 text-center"
                  >
                    <h4 className="font-semibold text-green-300">
                      Driver Order #{earning.driverOrderId || earning.orderId}
                    </h4>
                    <p className="text-sm text-gray-300">₹{earning.amount}</p>
                    <p className={`text-xs ${
                      earning.paid ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {earning.paid ? "Paid" : "Pending"}
                    </p>
                    {!earning.paid && (
                      <button
                        onClick={() => handleMarkPaid(earning.id)}
                        className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white mt-1"
                      >
                        Mark Paid
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center py-8">
                  No earnings yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ratings tab content */}
        {activeTab === "ratings" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-green-300 mb-2">
                Average Rating: {dashboard?.summary?.averageRating ? `${dashboard.summary.averageRating}/5` : "0/5"}
              </h3>
            </div>
            <div className="space-y-4">
              {ratings?.length > 0 ? (
                ratings.map((rating) => (
                  <motion.div
                    key={rating.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 rounded-xl p-4 border border-green-400/30 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-green-300">
                          From {rating.ratedByName}
                        </p>
                        <p className="text-sm text-gray-300">{rating.comment || "No comment"}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex text-2xl text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < rating.rating ? "text-yellow-400 fill-current" : "text-gray-400"} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No ratings yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Update Profile tab content */}
        {activeTab === "update-profile" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-green-400/30 backdrop-blur-sm space-y-6"
          >
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2">
              <FaEdit /> Profile Information
            </h2>

            {/* Profile photo upload and preview */}
            <div className="flex flex-col items-center gap-3 mb-6">
              {profileImageFile ? (
                <img
                  src={URL.createObjectURL(profileImageFile)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full border-2 border-green-400 object-cover shadow-md"
                />
              ) : currentProfile.profileImageUrl ? (
                <img
                  src={currentProfile.profileImageUrl}
                  alt="Driver"
                  className="w-24 h-24 rounded-full border-2 border-green-400 object-cover shadow-md"
                />
              ) : (
                <FaUserCircle className="text-6xl text-green-400" />
              )}

              <label className="flex flex-col items-center text-sm text-gray-300 mt-2">
                <span className="flex items-center gap-2">
                  <FaCamera /> Change Profile Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileSizeInMB = file.size / (1024 * 1024);
                      if (fileSizeInMB > 5) {
                        toast.error("Profile image must be less than 5 MB.");
                        e.target.value = "";
                        return;
                      }
                      setProfileImageFile(file);
                    }
                  }}
                  required
                  className="mt-2 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600"
                />
              </label>
            </div>

            {/* Read-only profile info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "First Name", value: currentProfile.firstName },
                { label: "Last Name", value: currentProfile.lastName },
                { label: "Email", value: currentProfile.email },
                { label: "City", value: currentProfile.city },
                { label: "State", value: currentProfile.state },
                { label: "Pincode", value: currentProfile.pincode },
              ].map((field, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-sm font-semibold text-gray-300">
                    {field.label}
                  </label>
                  <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    {field.value || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {/* Editable driver details form */}
            <h3 className="text-lg font-bold text-green-300 mt-8">
              Update Driver Details
            </h3>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={updateProfileForm.phoneNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* Vehicle Number field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    value={updateProfileForm.vehicleNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        vehicleNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* Vehicle Type field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Vehicle Type
                  </label>
                  <select
                    value={updateProfileForm.vehicleType}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        vehicleType: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-1 focus:ring-green-400 appearance-none"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                    }}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Car" className="bg-gray-800 text-white">Car</option>
                    <option value="SUV" className="bg-gray-800 text-white">SUV</option>
                    <option value="Truck" className="bg-gray-800 text-white">Truck</option>
                    <option value="Van" className="bg-gray-800 text-white">Van</option>
                  </select>
                </div>

                {/* Max Load Kg field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Max Load (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Max Load (kg)"
                    value={updateProfileForm.maxLoadKg}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        maxLoadKg: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* License Number field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300">
                    License Number
                  </label>
                  <input
                    type="text"
                    placeholder="License Number"
                    value={updateProfileForm.licenseNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaSave /> Update Profile
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}