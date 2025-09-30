/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaLeaf, FaUsers, FaTruck, FaChartLine } from "react-icons/fa";

export default function HeroSection() {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 text-white overflow-hidden pt-28" 
    >
      {/* Animated background particles */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="text-center relative z-10 px-4 sm:px-6 max-w-6xl mx-auto font-sans">
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Connecting Farmers, Buyers, <br /> and Drivers Seamlessly
        </motion.h1>

        {/* Subline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl mb-12 font-medium max-w-3xl mx-auto text-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          AgriSync: Your hyperlocal B2B marketplace for fresh produce trading, powered by smart dashboards, real-time analytics, and seamless logistics.
        </motion.p>

     
        {/* Feature Highlights */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            {
              Icon: FaLeaf,
              title: "Fresh Produce",
              description: "Locally sourced, organic produce at its freshest.",
              color: "text-green-400",
            },
            {
              Icon: FaUsers,
              title: "Smart Bidding",
              description: "Intelligent pricing for fair and transparent trades.",
              color: "text-orange-400",
            },
            {
              Icon: FaTruck,
              title: "Seamless Logistics",
              description: "Efficient delivery with real-time tracking.",
              color: "text-blue-400",
            },
            {
              Icon: FaChartLine,
              title: "Real-time Analytics",
              description: "Live insights to optimize your operations.",
              color: "text-pink-400",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col items-center gap-4 p-6 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all duration-300"
              custom={index}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <feature.Icon className={`text-4xl ${feature.color}`} />
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}