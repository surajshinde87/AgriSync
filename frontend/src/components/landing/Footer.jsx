/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaLeaf, FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Link } from "react-scroll";

export default function Footer() {
  const navLinks = [
    { to: "home", label: "Home" },
    { to: "features", label: "Features" },
    { to: "howitworks", label: "How It Works" },
    { to: "roles", label: "Roles" },
    { to: "why-agrisync", label: "Why AgriSync" },
    { to: "contact", label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://x.com/surajshinde_87", icon: FaTwitter, label: "Twitter" },
    { href: "https://github.com/surajshinde87", icon: FaGithub, label: "GitHub" },
    { href: "https://www.linkedin.com/in/surajshinde87", icon: FaLinkedin, label: "LinkedIn" },
    { href: "https://www.instagram.com/surajshinde_87", icon: FaInstagram, label: "Instagram" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 text-white py-12 sm:py-16 overflow-hidden">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <FaLeaf className="text-3xl sm:text-4xl text-green-400" />
              <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
                AgriSync
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 max-w-xs mx-auto">
              Empowering farmers, buyers, and drivers with a hyperlocal marketplace to digitize produce trading and reduce food waste.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-1 ml-8 text-sm sm:text-base text-gray-300 flex flex-col items-start">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={link.to}
                    smooth
                    duration={600}
                    offset={-80}
                    className="cursor-pointer hover:text-green-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social and Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Connect On Social Platforms</h3>
            <div className="flex gap-4 mb-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="text-2xl sm:text-3xl" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              Contact us: <a href="https://surajshindeportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors duration-300">surajshindeportfolio.netlify.app</a>
            </p>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-8 border-t border-white/20 text-center text-sm sm:text-base text-gray-300"
        >
          <p>© {new Date().getFullYear()} AgriSync. All Rights Reserved.</p>
          <p className="mt-2">Developed by Suraj Shinde for Farmers, Buyers, and Drivers</p>
        </motion.div>
      </div>
    </footer>
  );
}