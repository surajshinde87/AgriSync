/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaSearch,
  FaSeedling,
  FaClipboardList,
  FaTruck,
  FaBell,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes as FaCancel,
  FaSave,
  FaCamera,
  FaStar,
  FaRupeeSign,
  FaUser,
  FaRulerHorizontal,
  FaCalendar,
  FaShoppingCart,
  FaGavel,
  FaComment,
  FaMapMarkerAlt,
  FaChartPie,
  FaBars,
  FaClock,
  FaTimes,
  FaBox,
  FaEnvelope,
} from "react-icons/fa";
import {
  searchBuyerProduce,
  getBuyerOrders,
  getBuyerDashboard,
  placeBuyerBid,
  updateBuyerProfile,
  getBuyerBids,
  placeBuyerOrder,
  cancelBid,
  addBuyerFeedback,
  getBuyerProduce,
  getBuyerProfile,
  getBuyerFeedbacksByFarmer,
  markNotificationRead,
  getUnreadNotifications,
  getBuyerNotifications,
  clearBuyerError,
} from "../redux/buyerSlice";
import { logout } from "../redux/authSlice";

// Main BuyerDashboard component
export default function BuyerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select relevant state from Redux store
  const { user } = useSelector((state) => state.auth);
  const {
    dashboard,
    profile,
    produce,
    orders,
    bids,
    notifications,
    unreadNotifications,
    feedbacks,
    loading,
    error,
  } = useSelector((state) => state.buyer);

  // Memoized fallback user data from localStorage
  const storedUser = useMemo(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }, []);
  const userData = user || storedUser;

  // Local state management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduceForOrder, setSelectedProduceForOrder] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState("");

  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduceForBid, setSelectedProduceForBid] = useState(null);
  const [bidQuantity, setBidQuantity] = useState("");
  const [bidPrice, setBidPrice] = useState("");

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(1);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Search form state
  const [searchForm, setSearchForm] = useState({
    cropType: "",
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
  });

  // Update profile form state
  const [updateProfileForm, setUpdateProfileForm] = useState({
    deliveryAddress: "",
    preferredPaymentMethod: "COD",
    gstNumber: "",
    companyName: "",
    upiId: "",
  });

  // Effect to handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to redirect if user is not logged in or not a buyer
  useEffect(() => {
    if (!userData || !userData.id || userData.role !== "BUYER") {
      toast.error("Access denied. Redirecting to login.");
      navigate("/login");
    }
  }, [userData, navigate]);

  // Effect to fetch buyer profile on component mount
  useEffect(() => {
    const userId = Number(userData?.id);
    if (userId && !isNaN(userId)) {
      dispatch(getBuyerProfile(userId))
        .unwrap()
        .catch((err) => {
          toast.error("Failed to load profile");
        });
    }
  }, [dispatch, userData?.id]);

  // Effect to fetch dashboard data after profile is loaded
  useEffect(() => {
    if (!profile?.id || userData?.role !== "BUYER") return;
    dispatch(getBuyerDashboard(profile.id));
  }, [profile?.id]);

  // Effect to fetch all buyer data after profile loads
  useEffect(() => {
    if (!profile?.id || userData?.role !== "BUYER") return;
    const buyerId = profile.id;

    dispatch(getBuyerDashboard(buyerId))
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load dashboard");
      });

    dispatch(getBuyerOrders(buyerId))
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load orders");
      });

    dispatch(getBuyerBids(buyerId))
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load bids");
      });

    dispatch(getBuyerProduce())
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load produce");
      });

    dispatch(getBuyerNotifications(buyerId))
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load notifications");
      });

    dispatch(getUnreadNotifications(buyerId))
      .unwrap()
      .catch((err) => {
        toast.error("Failed to load unread notifications");
      });
  }, [profile?.id, dispatch]);

  // Effect to populate update profile form with existing data
  useEffect(() => {
    const prof = profile || dashboard?.profile;
    if (!prof) return;

    setUpdateProfileForm({
      deliveryAddress: prof.deliveryAddress || "",
      preferredPaymentMethod: prof.preferredPaymentMethod || "COD",
      gstNumber: prof.gstNumber || "",
      companyName: prof.companyName || "",
      upiId: prof.upiId || "",
      cardLast4: prof.cardLast4 || "",
    });
  }, [profile, dashboard?.profile]);

  // Function to refetch all buyer data
  const refetchData = () => {
    if (profile?.id) {
      const buyerId = profile.id;
      dispatch(getBuyerDashboard(buyerId));
      dispatch(getBuyerOrders(buyerId));
      dispatch(getBuyerBids(buyerId));
      dispatch(getBuyerProduce());
      dispatch(getBuyerNotifications(buyerId));
      dispatch(getUnreadNotifications(buyerId));
    }
  };

  // Handler for search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = {
      cropType: searchForm.cropType || undefined,
      city: searchForm.city || undefined,
      state: searchForm.state || undefined,
      minPrice: searchForm.minPrice ? Number(searchForm.minPrice) : undefined,
      maxPrice: searchForm.maxPrice ? Number(searchForm.maxPrice) : undefined,
    };
    dispatch(searchBuyerProduce(query))
      .unwrap()
      .then(() => {
        toast.success("Search results loaded");
      })
      .catch((err) => {
        toast.error("Search failed");
      });
  };

  // Handler to clear search and load all produce
  const handleClearSearch = () => {
    setSearchForm({
      cropType: "",
      city: "",
      state: "",
      minPrice: "",
      maxPrice: "",
    });
    dispatch(getBuyerProduce())
      .unwrap()
      .then(() => {
        toast.info("Showing all produce");
      })
      .catch((err) => {
        toast.error("Failed to load all produce");
      });
  };

  // Handler to place a buyer order
  const handlePlaceOrder = () => {
    if (!orderQuantity || !selectedProduceForOrder)
      return toast.error("Invalid order data");

    const buyerId = profile.id;
    if (!buyerId) {
      toast.error("User not logged in");
      return;
    }

    const orderData = {
      buyerId,
      produceId: selectedProduceForOrder.id,
      quantityKg: Number(orderQuantity),
    };

    toast.info("Placing order...");
    dispatch(placeBuyerOrder(orderData))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully");
        setShowOrderModal(false);
        setOrderQuantity("");
        setSelectedProduceForOrder(null);
        refetchData();
      })
      .catch((err) => {
        toast.error("Failed to place order");
      });
  };

  // Handler to place a buyer bid
  const handlePlaceBid = () => {
    if (!bidQuantity || !bidPrice || !selectedProduceForBid)
      return toast.error("Invalid bid data");
    const buyerId = profile.id;
    if (!buyerId) {
      toast.error("User not logged in");
      return;
    }
    const bidData = {
      buyerId,
      produceId: selectedProduceForBid.id,
      quantityKg: Number(bidQuantity),
      bidPricePerKg: Number(bidPrice),
    };
    toast.info("Placing bid...");
    dispatch(placeBuyerBid(bidData))
      .unwrap()
      .then(() => {
        toast.success("Bid placed successfully");
        setShowBidModal(false);
        setBidQuantity("");
        setBidPrice("");
        setSelectedProduceForBid(null);
        refetchData();
      })
      .catch((err) => {
        toast.error("Failed to place bid");
      });
  };

  // Handler to cancel a bid
  const handleCancelBid = (bidId) => {
    toast.info("Cancelling bid...");
    dispatch(cancelBid(bidId))
      .unwrap()
      .then(() => {
        toast.success("Bid cancelled successfully");
        refetchData();
      })
      .catch((err) => {
        toast.error("Failed to cancel bid");
      });
  };

  // Handler to open feedback modal for an order
  const handleGiveFeedback = (orderId) => {
    setSelectedOrderId(orderId);
    setFeedbackRating(1);
    setShowFeedbackModal(true);
    setFeedbackComment("");
  };

  // Handler to submit feedback
  const handleSubmitFeedback = () => {
    if (!selectedOrderId || !feedbackRating)
      return toast.error("Invalid feedback data");

    const buyerId = profile?.id;
    const buyerName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();

    if (!buyerId || !buyerName) {
      toast.error("Buyer info missing");
      return;
    }

    const feedbackData = {
      buyerId,
      buyerName,
      orderId: selectedOrderId,
      rating: feedbackRating,
      comment: feedbackComment,
    };

    toast.info("Submitting feedback...");

    dispatch(addBuyerFeedback(feedbackData))
      .unwrap()
      .then(() => {
        toast.success("Feedback submitted successfully");
        setShowFeedbackModal(false);
        setSelectedOrderId(null);
        setFeedbackRating(1);
        setFeedbackComment("");
        refetchData();
      })
      .catch((err) => {
        toast.error(
          typeof err === "string" ? err : "Failed to submit feedback"
        );
      });
  };

  // Handler for profile update form submission
  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    const userId = Number(profile?.user?.id || userData?.id);

    if (!userId || isNaN(userId)) return toast.error("User ID missing");

    // Validate image size
    if (profileImageFile && profileImageFile.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB");
      return;
    }

    const editableKeys = [
      "deliveryAddress",
      "preferredPaymentMethod",
      "gstNumber",
      "companyName",
      "upiId",
      "cardLast4",
    ];

    const formData = new FormData();
    editableKeys.forEach((key) => {
      if (updateProfileForm[key] !== undefined) {
        formData.append(key, updateProfileForm[key]);
      }
    });

    if (profileImageFile) {
      formData.append("profileImageFile", profileImageFile);
    }

    toast.info("Updating profile...");
    dispatch(updateBuyerProfile({ userId, data: formData }))
      .unwrap()
      .then((data) => {
        toast.success("Profile updated successfully");

        // Reset local state
        setProfileImageFile(null);

        // Refill the update form from updated data
        setUpdateProfileForm({
          deliveryAddress: data.deliveryAddress || "",
          preferredPaymentMethod: data.preferredPaymentMethod || "COD",
          gstNumber: data.gstNumber || "",
          companyName: data.companyName || "",
          upiId: data.upiId || "",
          cardLast4: data.cardLast4 || "",
        });

        // Refetch dashboard and profile
        refetchData();
      })
      .catch((err) => {
        toast.error("Failed to update profile");
      });
  };

  // Sidebar navigation tabs configuration
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { id: "search-produce", label: "Search Produce", icon: <FaSearch /> },
    { id: "all-produce", label: "All Produce", icon: <FaSeedling /> },
    { id: "bids", label: "My Bids", icon: <FaGavel /> },
    { id: "orders", label: "Orders", icon: <FaTruck /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "update-profile", label: "Update Profile", icon: <FaEdit /> },
  ];

  // Render loading UI
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

  // Render error UI
  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-400 text-lg bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            dispatch(clearBuyerError());
            if (profile?.id) {
              refetchData();
            }
          }}
          className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );

  // Get current profile for display purposes
  const currentProfile = profile || dashboard?.profile || {};

  // Main JSX structure
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Sidebar navigation */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isDesktop ? 0 : sidebarOpen ? 0 : -260 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed lg:static z-40 h-full w-64 bg-green-800/30 backdrop-blur-xl border-r border-white/20 p-4 flex flex-col justify-between shadow-lg"
      >
        <div>
          {/* Profile section in sidebar */}
          <div className="flex flex-col items-center mb-8">
            {currentProfile.profileImageUrl ? (
              <img
                src={currentProfile.profileImageUrl}
                alt="Buyer"
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

          {/* Navigation tabs */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-all relative ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-green-700/40"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "notifications" &&
                  unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
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

      {/* Mobile sidebar toggle button */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: "Total Spent",
                  value: `₹${dashboard?.summary?.totalSpentAllTime || 0}`,
                  icon: <FaRupeeSign className="text-2xl" />,
                },
                {
                  title: "Spent Last 30 Days",
                  value: `₹${dashboard?.summary?.spentLast30Days || 0}`,
                  icon: <FaRupeeSign className="text-2xl" />,
                },
                {
                  title: "Total Orders",
                  value: orders?.length || 0,
                  icon: <FaTruck className="text-2xl" />,
                },
                {
                  title: "Active Bids",
                  value: dashboard?.summary?.activeBids || bids?.length || 0,
                  icon: <FaGavel className="text-2xl" />,
                },
                {
                  title: "Pending Payments",
                  value: dashboard?.summary?.pendingPayments || 0,
                  icon: <FaClock className="text-2xl" />,
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Bids section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaGavel /> Active Bids
                </h3>
                {dashboard?.activeBids?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.activeBids.slice(0, 3).map((bid, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">{bid.cropType}</span>
                        <span className="font-semibold text-green-400">
                          ₹{bid.bidPricePerKg} ({bid.quantityKg}kg)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No active bids.</p>
                )}
              </motion.div>

              {/* Recent Transactions section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-1 bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaRupeeSign /> Recent Transactions
                </h3>
                {dashboard?.recentTransactions?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recentTransactions
                      .slice(0, 3)
                      .map((trans, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-300">
                            Order #{trans.orderId}
                          </span>
                          <div className="text-right">
                            <span className="font-semibold text-green-400">
                              ₹{trans.amount}
                            </span>
                            <p
                              className={`text-xs ${
                                trans.status === "RELEASED"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {trans.status}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">
                    No transactions yet.
                  </p>
                )}
              </motion.div>

              {/* Unread Notifications summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaBell /> Notifications
                </h3>
                <p className="text-gray-300 mb-4">
                  {unreadNotifications.length}
                </p>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white"
                >
                  View All
                </button>
              </motion.div>
            </div>

            {/* Recent Orders section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-green-300 mb-4">
                Recent Orders
              </h3>
              {dashboard?.recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.recentOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-green-700/20 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-300">
                          Order #{order.orderId}
                        </h4>
                        <p className="text-gray-300">
                          Produce: {order.produceId}
                        </p>
                        <p className="text-gray-300">
                          Qty: {order.quantityKg}kg @ ₹{order.finalPricePerKg}
                          /kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          ₹{order.totalAmount}
                        </p>
                        <p
                          className={`text-sm ${
                            order.status === "DELIVERED"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {order.status}
                        </p>
                        <p
                          className={`text-sm ${
                            order.paymentStatus === "RELEASED"
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No orders yet.</p>
              )}
            </motion.div>

            {/* Available Produce section */}
            {dashboard?.availableProduces?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaSeedling /> Available Produce
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboard.availableProduces.slice(0, 4).map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-green-700/20 rounded-xl p-3 text-center"
                    >
                      {prod.photoUrl && (
                        <img
                          src={prod.photoUrl}
                          alt={prod.cropType}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                      )}
                      <h4 className="font-semibold text-green-300">
                        {prod.cropType}
                      </h4>
                      <p className="text-sm text-gray-300">
                        ₹{prod.pricePerKg}/kg
                      </p>
                      <p className="text-xs text-gray-400">{prod.city}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("all-produce")}
                  className="mt-4 text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                >
                  View All Produce
                </button>
              </motion.div>
            )}

            {/* Recent Feedbacks section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                <FaStar /> Recent Feedbacks
              </h3>
              {dashboard?.recentFeedbacks?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentFeedbacks.slice(0, 3).map((feedback, i) => (
                    <div key={i} className="text-sm text-gray-300">
                      "{feedback.comment || "No comment"}" - {feedback.rating}
                      /5
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No feedbacks yet.
                </p>
              )}
            </motion.div>
          </div>
        )}

        {/* Search Produce tab content */}
        {activeTab === "search-produce" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-green-400/30 backdrop-blur-sm space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Crop Type"
                  value={searchForm.cropType}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, cropType: e.target.value })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={searchForm.city}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, city: e.target.value })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="State"
                  value={searchForm.state}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, state: e.target.value })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                />
                <input
                  type="number"
                  placeholder="Min Price (₹/kg)"
                  value={searchForm.minPrice}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, minPrice: e.target.value })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                />
              </div>
              <input
                type="number"
                placeholder="Max Price (₹/kg)"
                value={searchForm.maxPrice}
                onChange={(e) =>
                  setSearchForm({ ...searchForm, maxPrice: e.target.value })
                }
                className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold"
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Produce grid from search results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produce?.length > 0 ? (
                produce.map((prod) => (
                  <ProduceCard
                    key={prod.id}
                    produce={prod}
                    onBuyNow={() => {
                      setSelectedProduceForOrder(prod);
                      setOrderQuantity("");
                      setShowOrderModal(true);
                    }}
                    onPlaceBid={() => {
                      setSelectedProduceForBid(prod);
                      setBidQuantity("");
                      setBidPrice("");
                      setShowBidModal(true);
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center py-8">
                  No produce found.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* All Produce tab content */}
        {activeTab === "all-produce" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produce?.length > 0 ? (
                produce.map((prod) => (
                  <ProduceCard
                    key={prod.id}
                    produce={prod}
                    onBuyNow={() => {
                      setSelectedProduceForOrder(prod);
                      setOrderQuantity("");
                      setShowOrderModal(true);
                    }}
                    onPlaceBid={() => {
                      setSelectedProduceForBid(prod);
                      setBidQuantity("");
                      setBidPrice("");
                      setShowBidModal(true);
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center py-8">
                  No produce available.
                </p>
              )}
            </div>
          </div>
        )}

        {/* My Bids tab content */}
        {activeTab === "bids" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {bids?.length > 0 ? (
                bids.map((bid) => (
                  <motion.div
                    key={bid.bidId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 rounded-xl p-4 border border-green-400/30 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-green-300">
                        {bid.cropType}
                      </h3>
                      <p className="text-gray-300">Farmer: {bid.farmerId}</p>
                      <p className="text-gray-300">
                        Quantity: {bid.quantityKg} kg
                      </p>
                      <p className="text-gray-300">
                        Bid: ₹{bid.bidPricePerKg}/kg
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          bid.status === "ACCEPTED"
                            ? "text-green-400"
                            : bid.status === "OPEN"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        Status: {bid.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        Placed: {new Date(bid.placedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {bid.status === "OPEN" && (
                      <button
                        onClick={() => handleCancelBid(bid.bidId)}
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold flex items-center gap-1"
                      >
                        <FaCancel /> Cancel
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No bids placed yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Orders tab content */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Orders header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-bold text-green-300 flex items-center gap-2">
                <FaTruck className="text-3xl" />
              </h2>
              {orders?.length > 0 && (
                <p className="text-sm text-gray-400">
                  Total: {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"}
                </p>
              )}
            </div>

            {/* Orders list */}
            <div className="space-y-4">
              {orders?.length > 0 ? (
                [...orders]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order) => (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 250 }}
                      className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:bg-white/20 transition-all shadow-md"
                    >
                      {/* Order header section */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                            <FaBox className="text-green-300 text-lg" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-green-300">
                              {order.produceName || "Unknown Produce"}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Crop Type: {order.cropType || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Ordered on:{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                      </div>

                      {/* Order info grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-gray-300 flex items-center gap-2">
                            <FaUser className="text-green-400" />
                            <span className="text-white font-semibold">
                              Farmer: {order.farmerName}
                            </span>{" "}
                            <span className="text-gray-400">
                              ({order.farmerCity})
                            </span>
                          </p>

                          <p className="text-gray-300 flex items-center gap-2">
                            <FaRulerHorizontal className="text-green-400" />
                            Quantity: {order.quantityKg} kg
                          </p>

                          <p className="text-gray-300 flex items-center gap-2">
                            <FaRupeeSign className="text-green-400" />
                            Price per kg: ₹{order.pricePerKg}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-gray-300 flex items-center gap-2">
                            <FaEnvelope className="text-green-400" />
                            Buyer:{" "}
                            <span className="text-white font-semibold">
                              {order.buyerName}
                            </span>
                          </p>

                          {order.deliveryExpectedAt && (
                            <p className="text-gray-300 flex items-center gap-2">
                              <FaCalendar className="text-green-400" />
                              Delivery Expected:{" "}
                              {new Date(
                                order.deliveryExpectedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order footer with status badges */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-green-400/20">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "DELIVERED"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : order.status === "PENDING"
                                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {order.status}
                          </span>

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.paymentStatus === "RELEASED"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>

                        {order.status === "DELIVERED" && (
                          <button
                            onClick={() => handleGiveFeedback(order.orderId)}
                            className="text-sm bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white flex items-center gap-1"
                          >
                            <FaStar /> Give Feedback
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 bg-white/5 rounded-2xl border border-green-400/20"
                >
                  <FaTruck className="mx-auto text-6xl text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-500">
                    Place an order to get started.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Notifications tab content */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {notifications?.length > 0 ? (
                notifications.map((notif, index) => (
                  <motion.div
                    key={notif.notificationId || notif.id || `${notif.message}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white/10 rounded-xl p-4 border border-green-400/30 backdrop-blur-sm ${
                      !notif.read ? "border-green-400 bg-green-700/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            !notif.read ? "text-green-300" : "text-gray-300"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No notifications yet.
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
                  alt="Buyer"
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

            {/* Editable buyer details form */}
            <h3 className="text-lg font-bold text-green-300 mt-8">
              Update Buyer Details
            </h3>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Address field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={updateProfileForm.deliveryAddress}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        deliveryAddress: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* Preferred Payment Method field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Preferred Payment Method
                  </label>
                  <select
                    value={updateProfileForm.preferredPaymentMethod}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        preferredPaymentMethod: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-1 focus:ring-green-400 appearance-none"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                    }}
                  >
                    <option value="COD" className="bg-gray-800 text-white">
                      COD
                    </option>
                    <option value="UPI" className="bg-gray-800 text-white">
                      UPI
                    </option>
                    <option value="CARD" className="bg-gray-800 text-white">
                      Card
                    </option>
                  </select>
                </div>

                {/* GST Number field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    GST Number
                  </label>
                  <input
                    type="text"
                    placeholder="GST Number"
                    value={updateProfileForm.gstNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        gstNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* Company Name field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={updateProfileForm.companyName}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* UPI ID field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="UPI ID"
                    value={updateProfileForm.upiId}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        upiId: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>

                {/* Card Last 4 Digits field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Card Last 4 Digits
                  </label>
                  <input
                    type="text"
                    placeholder="****"
                    maxLength={4}
                    value={updateProfileForm.cardLast4}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        cardLast4: e.target.value.replace(/\D/g, ""),
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

        {/* Order Modal */}
        {showOrderModal && selectedProduceForOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white/10 p-6 rounded-2xl border border-green-400/30 max-w-md w-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-green-300">
                Buy {selectedProduceForOrder.cropType}
              </h3>
              <p className="text-gray-300 mb-4">
                Price: ₹{selectedProduceForOrder.pricePerKg}/kg
              </p>
              <input
                type="number"
                placeholder="Quantity (kg)"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="1"
                max={selectedProduceForOrder.quantityKg}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 mb-4"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex items-center justify-center flex-1 py-2 gap-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                >
                  <FaShoppingCart /> Place Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bid Modal */}
        {showBidModal && selectedProduceForBid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBidModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white/10 p-6 rounded-2xl border border-green-400/30 max-w-md w-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-green-300">
                Place Bid on {selectedProduceForBid.cropType}
              </h3>
              <p className="text-gray-300 mb-4">
                Current Price: ₹{selectedProduceForBid.pricePerKg}/kg
              </p>
              <input
                type="number"
                placeholder="Quantity (kg)"
                value={bidQuantity}
                onChange={(e) => setBidQuantity(e.target.value)}
                min="1"
                max={selectedProduceForBid.quantityKg}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 mb-4"
                required
              />
              <input
                type="number"
                placeholder="Bid Price (₹/kg)"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 mb-4"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePlaceBid}
                  className="flex flex-1 items-center justify-center gap-2.5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                >
                  <FaGavel /> Place Bid
                </button>
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white/10 p-6 rounded-2xl border border-green-400/30 max-w-md w-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-green-300">
                Give Feedback
              </h3>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      star <= feedbackRating
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => setFeedbackRating(star)}
                  />
                ))}
              </div>
              <textarea
                placeholder="Your comment..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 mb-4"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                >
                  <FaStar /> Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ProduceCard subcomponent for displaying individual produce items
function ProduceCard({ produce, onBuyNow, onPlaceBid }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:bg-white/20 transition-all"
    >
      {produce.photoUrl && (
        <img
          src={produce.photoUrl}
          alt={produce.cropType}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <h3 className="text-lg font-bold text-green-300">{produce.cropType}</h3>
      <p className="text-gray-300 mb-2">Quantity: {produce.quantityKg} kg</p>
      <p className="text-gray-300 mb-2">Price: ₹{produce.pricePerKg}/kg</p>
      <p className="text-gray-300 mb-2">Harvest: {produce.harvestDate}</p>
      <p
        className={`text-sm font-semibold ${
          produce.status === "AVAILABLE" ? "text-green-400" : "text-yellow-400"
        }`}
      >
        Status: {produce.status}
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onPlaceBid}
          className="flex-1 py-2 px-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1"
        >
          <FaGavel /> Bid
        </button>
        <button
          onClick={onBuyNow}
          className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1"
        >
          <FaShoppingCart /> Buy Now
        </button>
      </div>
    </motion.div>
  );
}