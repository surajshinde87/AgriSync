/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaTractor, FaExchangeAlt, FaShoppingBasket } from "react-icons/fa";

const steps = [
  {
    icon: FaTractor,
    title: "Farmers List & Manage Produce",
    desc: "Farmers digitize produce listings, manage bids, and track orders with a powerful dashboard and analytics.",
    color: "text-green-400",
  },
  {
    icon: FaExchangeAlt,
    title: "Buyers Bid & Order",
    desc: "Buyers search produce by price or location, place bids, and receive live order updates with feedback options.",
    color: "text-teal-400",
  },
  {
    icon: FaShoppingBasket,
    title: "Drivers Deliver Efficiently",
    desc: "Drivers manage assigned orders, track deliveries, and monitor earnings through a dedicated dashboard.",
    color: "text-yellow-400",
  },
];

export default function HowItWorks() {
  const stepVariants = {
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
      id="howitworks"
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
            How AgriSync Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 max-w-3xl mx-auto text-gray-200">
            Seamlessly connecting farmers, buyers, and drivers through a hyperlocal marketplace with smart bidding, logistics, and analytics.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              custom={index}
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gradient-start)] to-[var(--color-gradient-end)] opacity-10 rounded-2xl"></div>
              <div className="relative flex flex-col items-center gap-4 text-center">
                <step.icon className={`text-5xl ${step.color}`} />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}