/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { to: "home", label: "Home" },
    { to: "features", label: "Features" },
    { to: "howitworks", label: "How It Works" },
    { to: "roles", label: "Join AgriSync" },
    { to: "why-agrisync", label: "Why AgriSync" },
    { to: "about", label: "About" }
  ];

  const logoVariants = {
    initial: { opacity: 0, x: -20, scale: 0.8 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  return (
    <nav className="fixed w-full bg-gradient-to-r from-gray-900/90 to-green-900/90 backdrop-blur-lg shadow-lg z-50 py-2">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="home" smooth duration={600} offset={-80} className="cursor-pointer">
          <motion.div
            className="flex items-center gap-3 font-bold text-2xl sm:text-3xl lg:text-4xl text-white"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <FaLeaf className="text-4xl sm:text-5xl text-green-400 drop-shadow-md" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 tracking-tight">
              AgriSync
            </span>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-4 lg:gap-6 text-white font-medium font-sans">
          {navItems.map((item, index) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                to={item.to}
                smooth
                duration={600}
                offset={-80}
                className="cursor-pointer hover:text-green-400 transition-colors duration-300"
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3 lg:gap-4">
          <motion.a
            href="/login"
            className="px-4 py-2 bg-transparent border border-green-400 text-green-400 rounded-full hover:bg-green-400 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.a>
          <motion.a
            href="/register"
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-full hover:bg-green-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white text-2xl sm:text-3xl" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-gray-900/95 backdrop-blur-lg py-6"
            variants={{
              hidden: { opacity: 0, y: -100 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              exit: { opacity: 0, y: -100, transition: { duration: 0.3 } },
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="flex flex-col items-center gap-4 text-white font-medium font-sans">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={item.to}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer hover:text-green-400 transition-colors duration-300"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.a
                href="/login"
                className="px-6 py-2 bg-transparent border border-green-400 text-green-400 rounded-full hover:bg-green-400 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
              >
                Login
              </motion.a>
              <motion.a
                href="/register"
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-full hover:bg-green-500 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
              >
                Register
              </motion.a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}