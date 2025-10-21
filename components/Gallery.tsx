"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    category: "yoga",
    title: "Morning Yoga Session",
    description: "Start your day with energizing yoga flows",
  },
  {
    id: 2,
    category: "food",
    title: "Healthy Breakfast Bowl",
    description: "Nutritious and delicious organic meals",
  },
  {
    id: 3,
    category: "icebath",
    title: "Ice Bath Experience",
    description: "Embrace the cold for ultimate wellness",
  },
  {
    id: 4,
    category: "nature",
    title: "Alpine Setting",
    description: "Surrounded by breathtaking mountain views",
  },
  {
    id: 5,
    category: "yoga",
    title: "Sunset Meditation",
    description: "Find peace in the golden hour",
  },
  {
    id: 6,
    category: "food",
    title: "Fresh Organic Salad",
    description: "Farm-to-table ingredients",
  },
  {
    id: 7,
    category: "wimhof",
    title: "Breathing Workshop",
    description: "Master the Wim Hof breathing technique",
  },
  {
    id: 8,
    category: "nature",
    title: "Camp Menina",
    description: "Your wellness sanctuary in the Alps",
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "yoga", label: "Yoga" },
  { id: "food", label: "Food" },
  { id: "icebath", label: "Ice Bath" },
  { id: "wimhof", label: "Wim Hof" },
  { id: "nature", label: "Nature" },
];

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = activeCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-24 md:py-40 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="mb-8">
            <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
              GALLERY
            </span>
            <div className="w-16 h-1 bg-primary mt-3 mx-auto"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Experience Healthy Corner
          </h2>
          <p className="text-xl text-neutral-700 font-light">
            Explore our facilities, classes, and the beautiful Alpine environment
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              {/* Placeholder with gradient - replace with actual images */}
              <div className={`absolute inset-0 bg-gradient-to-br ${
                image.category === "yoga" ? "from-purple-400 to-pink-400" :
                image.category === "food" ? "from-green-400 to-primary" :
                image.category === "icebath" ? "from-cyan-400 to-blue-500" :
                image.category === "wimhof" ? "from-blue-400 to-cyan-400" :
                "from-primary to-yellow-400"
              }`} />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-end p-6">
                <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {image.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {image.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-w-4xl w-full aspect-video rounded-2xl overflow-hidden"
            >
              {/* Placeholder - replace with actual image */}
              <div className="w-full h-full bg-gradient-to-br from-primary to-yellow-400" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
