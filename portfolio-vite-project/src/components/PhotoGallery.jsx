import { motion } from 'framer-motion';

export default function PhotoGallery({ images }) {
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* The Columns Container */}
      <div className="columns-2 md:columns-3 gap-2 p-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="mb-2 break-inside-avoid"
          >
            <img
              src={img}
              alt={`Gallery item ${i}`}
              className="w-full h-auto object-cover rounded-lg shadow-sm cursor-pointer border border-black/5"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
