/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaTractor, FaStore, FaTruck } from "react-icons/fa";

const roles = [
  {
    icon: FaTractor,
    role: "Farmer",
    features: [
      "List and manage fresh produce",
      "Accept or reject buyer bids",
      "Track orders and mark deliveries",
      "Gain insights with analytics",
    ],
    color: "text-green-400",
    desc: "Grow your farm's reach by listing produce, managing bids, and tracking orders with real-time analytics.",
  },
  {
    icon: FaStore,
    role: "Buyer",
    features: [
      "Search produce by price or location",
      "Place bids and orders easily",
      "Get live order notifications",
      "Provide feedback on deliveries",
    ],
    color: "text-teal-400",
    desc: "Source fresh produce directly from farmers, bid competitively, and stay updated with live notifications.",
  },
  {
    icon: FaTruck,
    role: "Driver",
    features: [
      "Manage delivery assignments",
      "Track order status in real-time",
      "Monitor earnings and ratings",
      "Access a dedicated dashboard",
    ],
    color: "text-yellow-400",
    desc: "Earn by delivering fresh produce, track orders, and monitor your performance with a driver dashboard.",
  },
];

export default function JoinSection() {
  const roleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" },
    }),
  };

  return (
    <section
      id="roles"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 text-white py-16 sm:py-20 overflow-hidden"
    >
      {/* Animated background particles */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200 py-2">
            Join AgriSync Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 max-w-3xl mx-auto text-gray-200">
            Whether you're a Farmer, Buyer, or Driver, AgriSync empowers you to connect, trade, and deliver fresh produce efficiently.
          </p>
        </motion.div>

        {/* Roles Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.role}
              className="relative p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              custom={index}
              variants={roleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] opacity-10 rounded-2xl"></div>
              <div className="relative flex flex-col items-center gap-4 text-center">
                <role.icon className={`text-5xl ${role.color}`} />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{role.role}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4">{role.desc}</p>
                <ul className="text-gray-300 text-sm sm:text-base space-y-2 text-center">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center gap-2">
                      <span className="text-green-400">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <motion.a
                  href="/register"
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register as {role.role}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}