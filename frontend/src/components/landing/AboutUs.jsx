/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaLeaf, FaLinkedin } from "react-icons/fa";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 text-white py-16 sm:py-20 overflow-hidden"
    >
      {/* Animated background particles */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-10 left-10 w-64 sm:w-72 h-64 sm:h-72 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            About AgriSync
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 max-w-3xl mx-auto text-gray-200">
            A platform built from the heart of a farmer’s son to revolutionize produce trading and empower agricultural communities.
          </p>
        </motion.div>

        {/* About Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 sm:p-8"
          >
            <div className="flex justify-center mb-4">
              <FaLeaf className="text-4xl sm:text-5xl text-green-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Our Mission</h3>
            <p className="text-sm sm:text-base text-gray-300">
              AgriSync is dedicated to solving real agricultural challenges by digitizing produce trading, reducing food waste, and connecting farmers, buyers, and drivers seamlessly. With smart bidding, real-time analytics, and efficient logistics, we empower fair pricing and sustainable growth for all.
            </p>
          </motion.div>

          {/* Developer Story */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 sm:p-8"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Our Story</h3>
            <p className="text-sm sm:text-base text-gray-300">
              I’m Suraj Shinde, a farmer’s son and the sole creator of AgriSync. Inspired by the struggles of farmers like my family, I built this platform to bridge the gap between farmers, buyers, and drivers. AgriSync is my commitment to making produce trading accessible, transparent, and efficient, empowering communities with technology.
            </p>
            <p className="text-sm sm:text-base text-gray-300 mt-4 flex items-center justify-center gap-2">
              Connect with me:
              <motion.a
                href="https://www.linkedin.com/in/surajshinde87"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="text-2xl sm:text-3xl" />
              </motion.a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}