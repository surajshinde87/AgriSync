/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaSeedling,
  FaChartPie,
  FaBox,
  FaClipboardList,
  FaTruck,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes as FaReject,
  FaSave,
  FaCamera,
  FaStar,
  FaRupeeSign,
  FaUser,
  FaRulerHorizontal,
  FaCalendar
} from "react-icons/fa";
import {
  getFarmerDashboard,
  getFarmerProfile,
  getFarmerAllProduce,
  getFarmerOrders,
  getFarmerBids,
  createFarmerProduce,
  updateFarmerProfile,
  clearFarmerError,
  updateFarmerProduce,
  deleteFarmerProduce,
  acceptBid,
  rejectBid,
} from "../redux/farmerSlice";
import { logout } from "../redux/authSlice";

export default function FarmerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { dashboard, profile, produce, orders, bids, loading, error } =
    useSelector((state) => state.farmer);

  // Fallback user (from localStorage)
  const storedUser = useMemo(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }, []);
  const userData = user || storedUser;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [photoFile, setPhotoFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [addProduceForm, setAddProduceForm] = useState({
    cropType: "",
    quantityKg: "",
    pricePerKg: "",
    harvestDate: "",
    city: "",
    state: "",
  });
  const [editProduceId, setEditProduceId] = useState(null);
  const [editProduceForm, setEditProduceForm] = useState({});
  const [updateProfileForm, setUpdateProfileForm] = useState({
    aadhaarNumber: "",
    bankAccountNumber: "",
    bankName: "",
    farmLocation: "",
    ifscCode: "",
    upiId: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if user not logged in
  useEffect(() => {
    if (!userData || !userData.id) {
      toast.error("User data missing. Redirecting to login.");
      navigate("/login");
    }
  }, [userData, navigate]);

  // Fetch profile only once
  useEffect(() => {
    const userId = Number(userData?.id);
    if (userId && !isNaN(userId)) {
      dispatch(getFarmerProfile(userId)).unwrap().catch(() => {
        toast.error("Failed to load profile");
      });
    }
  }, []); // ✅ Runs once only

  // Fetch dashboard & other data once after profile loads
  useEffect(() => {
    if (!profile?.id || userData?.role !== "FARMER") return;
    const userId = Number(userData.id);
    const farmerId = profile.id;

    dispatch(getFarmerDashboard(userId)).catch(() =>
      toast.error("Failed to load dashboard")
    );
    dispatch(getFarmerAllProduce(farmerId)).catch(() =>
      toast.error("Failed to load produce")
    );
    dispatch(getFarmerOrders(farmerId)).catch(() =>
      toast.error("Failed to load orders")
    );
    dispatch(getFarmerBids(farmerId)).catch(() =>
      toast.error("Failed to load bids")
    );
  }, [profile?.id]); // ✅ Runs once after profile loads

  const refetchData = () => {
    if (profile?.id && userData?.id) {
      dispatch(getFarmerAllProduce(profile.id));
      dispatch(getFarmerDashboard(userData.id));
    }
  };

  const handleAddProduceSubmit = (e) => {
    e.preventDefault();
    if (!profile?.id) return toast.error("Farmer ID missing");

    const formData = new FormData();
    formData.append("farmerId", profile.id);
    Object.entries(addProduceForm).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (photoFile) formData.append("photoFile", photoFile);

    toast.info("Adding produce...");
    dispatch(createFarmerProduce(formData))
      .unwrap()
      .then(() => {
        toast.success("Produce added successfully");
        setAddProduceForm({
          cropType: "",
          quantityKg: "",
          pricePerKg: "",
          harvestDate: "",
          city: "",
          state: "",
        });
        setPhotoFile(null);
        refetchData();
      })
      .catch(() => toast.error("Failed to add produce"));
  };

  const handleEditProduce = (prod) => {
    setEditProduceId(prod.id);
    setEditProduceForm({
      cropType: prod.cropType,
      quantityKg: prod.quantityKg,
      pricePerKg: prod.pricePerKg,
      harvestDate: prod.harvestDate,
      city: prod.city,
      state: prod.state,
    });
  };

  const handleUpdateProduceSubmit = (e) => {
    e.preventDefault();
    if (!editProduceId || !profile?.id) return toast.error("Invalid data");

    const formData = new FormData();
    formData.append("farmerId", profile.id);
    Object.entries(editProduceForm).forEach(([key, value]) =>
      formData.append(key, value)
    );

    toast.info("Updating produce...");
    dispatch(updateFarmerProduce({ id: editProduceId, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("Produce updated successfully");
        setEditProduceId(null);
        setEditProduceForm({});
        refetchData();
      })
      .catch(() => toast.error("Failed to update produce"));
  };

  const handleDeleteProduce = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    toast.info("Deleting produce...");
    dispatch(deleteFarmerProduce(deleteId))
      .unwrap()
      .then(() => {
        toast.success("Produce deleted successfully");
        refetchData();
      })
      .catch(() => toast.error("Failed to delete produce"))
      .finally(() => {
        setShowDeleteModal(false);
        setDeleteId(null);
      });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleAcceptBid = (bidId) => {
    toast.info("Accepting bid...");
    dispatch(acceptBid(bidId))
      .unwrap()
      .then(() => {
        toast.success("Bid accepted successfully");
        refetchData();
      })
      .catch(() => toast.error("Failed to accept bid"));
  };

  const handleRejectBid = (bidId) => {
    toast.info("Rejecting bid...");
    dispatch(rejectBid(bidId))
      .unwrap()
      .then(() => {
        toast.success("Bid rejected successfully");
        refetchData();
      })
      .catch(() => toast.error("Failed to reject bid"));
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    const userId = Number(profile?.user?.id || userData?.id);
    if (!userId || isNaN(userId)) return toast.error("User ID missing");

    if (profileImageFile && profileImageFile.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be less than 5MB");
      return;
    }

    const formData = new FormData();
    Object.entries(updateProfileForm).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (profileImageFile) formData.append("profileImageFile", profileImageFile);

    toast.info("Updating profile...");
    dispatch(updateFarmerProfile({ userId, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
        setProfileImageFile(null);
        refetchData();
      })
      .catch(() => toast.error("Failed to update profile"));
  };

  // Sidebar tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartPie /> },
    { id: "add-produce", label: "Add Produce", icon: <FaSeedling /> },
    { id: "all-produce", label: "All Produce", icon: <FaBox /> },
    { id: "bids", label: "Bids", icon: <FaClipboardList /> },
    { id: "orders", label: "Orders", icon: <FaTruck /> },
    { id: "update-profile", label: "Update Profile", icon: <FaEdit /> },
  ];

  // Loading UI
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

  // Error UI
  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-400 text-lg bg-gradient-to-br from-green-900 via-gray-900 to-green-800">
        <p>Error: {error}</p>
        <button
          onClick={() => {
            dispatch(clearFarmerError());
            const userId = Number(userData?.id);
            if (profile?.id && userId && !isNaN(userId)) {
              dispatch(getFarmerDashboard(userId));
              dispatch(getFarmerAllProduce(profile.id));
              dispatch(getFarmerOrders(profile.id));
              dispatch(getFarmerBids(profile.id));
            }
          }}
          className="mt-3 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );

  // Main UI
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
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            {dashboard?.profile?.profileImageUrl || profile?.profileImageUrl ? (
              <img
                src={
                  dashboard?.profile?.profileImageUrl ||
                  profile?.profileImageUrl
                }
                alt="Farmer"
                className="w-20 h-20 rounded-full border-2 border-green-400 object-cover"
              />
            ) : (
              <FaUserCircle className="text-6xl text-green-400" />
            )}
            <h2 className="mt-3 text-lg font-bold">
              {dashboard?.profile?.firstName ||
                profile?.user?.firstName ||
                userData?.firstName}{" "}
              {dashboard?.profile?.lastName ||
                profile?.user?.lastName ||
                userData?.lastName}
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
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
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

      {/* Mobile Toggle */}
      {!isDesktop && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 right-4 z-50 bg-green-700 p-2 rounded-md text-white"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
          {tabs.find((t) => t.id === activeTab)?.label}
        </h1>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Active Listings",
                  value: dashboard?.produceList?.length || produce?.length || 0,
                  icon: <FaBox className="text-2xl" />,
                },
                {
                  title: "Active Bids",
                  value: dashboard?.activeBids?.length || bids?.length || 0,
                  icon: <FaClipboardList className="text-2xl" />,
                },
                {
                  title: "Total Orders",
                  value: dashboard?.orders?.length || orders?.length || 0,
                  icon: <FaTruck className="text-2xl" />,
                },
                {
                  title: "Total Earnings",
                  value: `₹${dashboard?.summary?.totalEarningsAllTime || 0}`,
                  icon: <FaRupeeSign className="text-2xl" />,
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
              {/* Top Crops */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaSeedling /> Top Crops
                </h3>
                {dashboard?.topCrops?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.topCrops.map((crop, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-300">{crop.crop}</span>
                        <span className="font-semibold text-green-400">
                          ₹{crop.revenue} ({crop.qtyKg}kg)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No top crops yet.</p>
                )}
              </motion.div>

              {/* Recent Transactions */}
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
                            {trans.orderId ? `Order #${trans.orderId}` : "N/A"}
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

              {/* Recent Feedbacks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1 bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <FaStar /> Recent Feedbacks
                </h3>
                {dashboard?.recentFeedbacks?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recentFeedbacks
                      .slice(0, 3)
                      .map((feedback, i) => (
                        <div key={i} className="text-sm text-gray-300">
                          {feedback.comment || "No comment"} - {feedback.rating}
                          /5
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No feedbacks yet.</p>
                )}
              </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm"
            >
              <h3 className="text-lg font-bold text-green-300 mb-4">
                Recent Orders
              </h3>
              {dashboard?.orders?.length > 0 ? (
                <div className="space-y-4">
                  {dashboard.orders.slice(0, 5).map((order) => (
                    <div
                      key={order.orderId}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-green-700/20 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-300">
                          Order #{order.orderId}
                        </h4>
                        <p className="text-gray-300">
                          Produce: {order.produceId} | Buyer: {order.buyerName}
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
          </div>
        )}

        {/* Add Produce */}
        {activeTab === "add-produce" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white/10 p-6 rounded-2xl border border-green-400/30 backdrop-blur-sm"
          >
            <h2 className="text-xl font-bold mb-6 text-green-300 flex items-center gap-2">
              <FaSeedling /> Add New Produce
            </h2>
            <form onSubmit={handleAddProduceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Crop Type"
                  value={addProduceForm.cropType}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      cropType: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 col-span-2 sm:col-span-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity (kg)"
                  value={addProduceForm.quantityKg}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      quantityKg: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 col-span-2 sm:col-span-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price per Kg (₹)"
                  value={addProduceForm.pricePerKg}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      pricePerKg: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 col-span-2 sm:col-span-1"
                  required
                />
                <input
                  type="date"
                  value={addProduceForm.harvestDate}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      harvestDate: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white col-span-2 sm:col-span-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={addProduceForm.city}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      city: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 col-span-2 sm:col-span-1"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={addProduceForm.state}
                  onChange={(e) =>
                    setAddProduceForm({
                      ...addProduceForm,
                      state: e.target.value,
                    })
                  }
                  className="p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400 col-span-2 sm:col-span-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <FaCamera /> Photo 
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileSizeInMB = file.size / (1024 * 1024);
                      if (fileSizeInMB > 5) {
                        toast.error("Produce image must be less than 5 MB.");
                        e.target.value = "";
                        return;
                      }
                      setPhotoFile(file);
                    }
                  }}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <FaSave /> Add Produce
              </button>
            </form>
          </motion.div>
        )}

        {/* All Produce */}
        {activeTab === "all-produce" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-green-300">
              Your Produce Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produce?.map((prod) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:bg-white/20 transition-all"
                >
                  {prod.photoUrl && (
                    <img
                      src={prod.photoUrl}
                      alt={prod.cropType}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  <h3 className="text-lg font-bold text-green-300">
                    {prod.cropType}
                  </h3>
                  <p className="text-gray-300 mb-2">
                    Quantity: {prod.quantityKg} kg
                  </p>
                  <p className="text-gray-300 mb-2">
                    Price: ₹{prod.pricePerKg}/kg
                  </p>
                  <p className="text-gray-300 mb-2">
                    Harvest: {prod.harvestDate}
                  </p>
                  <p className="text-gray-300 mb-2">
                    Location: {prod.city}, {prod.state}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      prod.status === "AVAILABLE"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    Status: {prod.status}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditProduce(prod)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduce(prod.id)}
                      className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </motion.div>
              )) || (
                <p className="text-gray-400 col-span-full text-center py-8">
                  No produce listed yet.
                </p>
              )}
            </div>

            {/* Edit Produce Modal/Form */}
            {editProduceId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setEditProduceId(null)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-white/10 p-6 rounded-2xl border border-green-400/30 max-w-md w-full backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4 text-green-300">
                    Edit Produce
                  </h3>
                  <form
                    onSubmit={handleUpdateProduceSubmit}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Crop Type"
                      value={editProduceForm.cropType || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          cropType: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity (kg)"
                      value={editProduceForm.quantityKg || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          quantityKg: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price per Kg (₹)"
                      value={editProduceForm.pricePerKg || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          pricePerKg: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="date"
                      value={editProduceForm.harvestDate || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          harvestDate: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={editProduceForm.city || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          city: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editProduceForm.state || ""}
                      onChange={(e) =>
                        setEditProduceForm({
                          ...editProduceForm,
                          state: e.target.value,
                        })
                      }
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                      required
                    />
                    <div className="flex gap-2 pt-4">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduceId(null)}
                        className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-white/10 p-6 rounded-2xl border border-green-400/30 max-w-md w-full backdrop-blur-sm text-center"
                >
                  <h3 className="text-xl font-bold mb-4 text-red-300">
                    Confirm Delete
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Are you sure you want to delete this produce? This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={confirmDelete}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all"
                    >
                      Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}

        {/* Bids */}
        {activeTab === "bids" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-green-300">Incoming Bids</h2>
            <div className="space-y-4">
              {bids?.map((bid) => (
                <motion.div
                  key={bid.bidId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 rounded-xl p-4 border border-green-400/30 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-green-300">{bid.cropType}</h3>
                    <p className="text-gray-300">Buyer: {bid.buyerName}</p>
                    <p className="text-gray-300">
                      Quantity: {bid.quantityKg} kg
                    </p>
                    <p className="text-gray-300">
                      Bid Price: ₹{bid.bidPricePerKg}/kg
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptBid(bid.bidId)}
                        className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold flex items-center gap-1 transition-all"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleRejectBid(bid.bidId)}
                        className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold flex items-center gap-1 transition-all"
                      >
                        <FaReject /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              )) || (
                <p className="text-gray-400 text-center py-8">
                  No bids received yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Orders */}
    {activeTab === "orders" && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-green-300 flex items-center gap-2">
        <FaTruck className="text-xl" />
        Your Orders
      </h2>
      {orders?.length > 0 && (
        <p className="text-sm text-gray-400">
          Total: {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      )}
    </div>
    <div className="space-y-4">
      {orders?.length > 0 ? (
        orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                  <FaTruck className="text-green-300 text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-green-300">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Created: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">₹{order.totalAmount}</p>
                <p className="text-xs text-gray-500">Total Amount</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <p className="text-gray-300 flex items-center gap-2">
                  <FaBox className="text-green-400" />
                  Produce ID: {order.produceId}
                </p>
                <p className="text-gray-300 flex items-center gap-2">
                  <FaUser className="text-green-400" />
                  Buyer ID: {order.buyerId}
                </p>
                <p className="text-gray-300 flex items-center gap-2">
                  <FaRulerHorizontal className="text-green-400" />
                  Quantity: {order.quantityKg} kg
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300 flex items-center gap-2">
                  <FaRupeeSign className="text-green-400" />
                  Price: ₹{order.pricePerKg}/kg
                </p>
                {order.deliveryExpectedAt && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <FaCalendar className="text-green-400" />
                    Expected Delivery: {new Date(order.deliveryExpectedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-green-400/20">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "DELIVERED"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : order.status === "PENDING"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {order.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  order.paymentStatus === "RELEASED"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
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
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Your orders will appear here once you receive some.</p>
        </motion.div>
      )}
    </div>
  </div>
)}

        {/* Update Profile */}
        {activeTab === "update-profile" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white/10 p-6 rounded-2xl border border-green-400/30 backdrop-blur-sm space-y-6"
          >
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2">
              <FaEdit /> Profile Information
            </h2>
            {/* Display All Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  First Name
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.firstName ||
                    profile?.user?.firstName ||
                    "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Last Name
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.lastName ||
                    profile?.user?.lastName ||
                    "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Email
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.email || profile?.user?.email || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  City
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.city || profile?.user?.city || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  State
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.state || profile?.user?.state || "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Pincode
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.pincode ||
                    profile?.user?.pincode ||
                    "N/A"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">
                  Role
                </label>
                <p className="p-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  {dashboard?.profile?.role || profile?.user?.role || "N/A"}
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">
                  Farm Location
                </label>
                <input
                  type="text"
                  placeholder="Farm Location"
                  value={updateProfileForm.farmLocation}
                  onChange={(e) =>
                    setUpdateProfileForm({
                      ...updateProfileForm,
                      farmLocation: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-green-300">
              Banking Details
            </h3>
            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Aadhaar Number"
                    value={updateProfileForm.aadhaarNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        aadhaarNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Bank Account Number"
                    value={updateProfileForm.bankAccountNumber}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        bankAccountNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={updateProfileForm.bankName}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        bankName: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={updateProfileForm.ifscCode}
                    onChange={(e) =>
                      setUpdateProfileForm({
                        ...updateProfileForm,
                        ifscCode: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-green-400 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <label className="flex text-sm text-gray-300 mb-2 items-center gap-2">
                  <FaCamera /> Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes → MB
                      if (fileSizeInMB > 5) {
                        toast.error("Profile image must be less than 5 MB.");
                        e.target.value = ""; // clear the input field
                        return;
                      }
                      setProfileImageFile(file);
                    }
                  }}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-600"
                />
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
