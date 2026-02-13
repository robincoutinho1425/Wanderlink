import React from "react";
import { motion } from "framer-motion";
import {
  MapIcon,
  GithubIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  HeartIcon,
  Share2Icon,
  UserIcon,
  MapPinIcon,
} from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: <MapIcon className="w-8 h-8" />,
      title: "Discover Places",
      description:
        "Explore amazing locations shared by our community, with interactive maps and detailed information.",
    },
    {
      icon: <Share2Icon className="w-8 h-8" />,
      title: "Share Your Experiences",
      description:
        "Create and share your favorite places with others, complete with photos and descriptions.",
    },
    {
      icon: <UserIcon className="w-8 h-8" />,
      title: "User Profiles",
      description:
        "Customize your profile, showcase your shared places, and connect with other explorers.",
    },
    {
      icon: <MapPinIcon className="w-8 h-8" />,
      title: "Interactive Maps",
      description:
        "View exact locations with integrated maps and get directions to your next destination.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to YourPlaces
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal space to discover, share, and explore amazing locations
          around the world.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-4 text-yellow-500">
              {feature.icon}
              <h3 className="text-xl font-semibold ml-3 text-gray-800">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          About the Developer
        </h2>
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mb-6 flex items-center justify-center">
            <UserIcon className="w-16 h-16 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Robin Coutinho
          </h3>
          <p className="text-gray-600 text-center max-w-2xl mb-6">
            A passionate full-stack developer dedicated to creating meaningful
            experiences through technology. YourPlaces is built using the MERN
            stack (MongoDB, Express.js, React, Node.js) with features focused on
            community engagement and location sharing.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/https://github.com/robincoutinho1425"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
