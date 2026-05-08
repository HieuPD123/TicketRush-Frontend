import { motion } from "framer-motion";
import { useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 500,
  height = 200,
  className = ""
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate scale factor based on default size (500x200)
  const scale = Math.min(width / 500, height / 200);

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wind effect particles container */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isHovered && (
          <>
            {/* Horizontal wind streaks */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`streak-${i}`}
                className="absolute h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                style={{
                  width: (80 + Math.random() * 120) * scale,
                  left: -200 * scale,
                  top: (30 + Math.random() * 100) * scale,
                }}
                initial={{ x: 0, opacity: 0 }}
                animate={{
                  x: [0, 700 * scale],
                  opacity: [0, 0.8, 0.9, 0],
                }}
                transition={{
                  duration: 0.4 + Math.random() * 0.2,
                  delay: 0.15 + i * 0.02,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            ))}

            {/* Particle dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  width: scale * 4,
                  height: scale * 4,
                  left: (250 + Math.random() * 50) * scale,
                  top: (40 + Math.random() * 80) * scale,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  x: [0, (100 + Math.random() * 150) * scale],
                  y: [0, (-20 + Math.random() * 40) * scale],
                  scale: [0, 1.5, 0.5, 0],
                  opacity: [0, 1, 0.7, 0],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  delay: 0.2 + i * 0.03,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Larger wind burst */}
            <motion.div
              className="absolute rounded-full bg-white/20 blur-xl"
              style={{
                width: 128 * scale,
                height: 128 * scale,
                left: 280 * scale,
                top: 50 * scale,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 3],
                opacity: [0, 0.3, 0],
                x: [0, 150 * scale],
              }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: "easeOut",
              }}
            />
          </>
        )}
      </motion.div>

      {/* Main ticket body */}
      <motion.div className="absolute" style={{ transform: `scale(${scale})` }}>
        <svg width="400" height="160" viewBox="0 0 400 160" className="overflow-visible">
          <defs>
            <filter id="sword-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="flash-gradient">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Main ticket part (remains after cut) */}
          <motion.g
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{
              x: isHovered ? [0, -6, 6, -3, 35] : 0,
              y: isHovered ? [0, 3, -3, 2, 0] : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              duration: 0.7,
              delay: isHovered ? 0.15 : 0,
              times: isHovered ? [0, 0.1, 0.2, 0.3, 1] : undefined,
              ease: "easeOut"
            }}
            style={{ transformOrigin: "165px 80px" }}
          >
            {/* Ticket body */}
            <path
              d="M 30 20 L 300 20 L 300 140 L 30 140 L 30 95 Q 40 95 40 85 Q 40 75 30 75 Z"
              fill="#12121c"
              stroke="#7c3aed"
              strokeWidth="2"
            />

            {/* Text */}
            <text
              x="165"
              y="95"
              textAnchor="middle"
              fill="#7c3aed"
              fontSize="48"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              TicketRush
            </text>
          </motion.g>

          {/* Stub (the part that gets cut off) */}
          <motion.g
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: isHovered ? [0, 30, 180] : 0,
              y: isHovered ? [0, -15, -60] : 0,
              rotate: isHovered ? [0, 25, 75] : 0,
              opacity: isHovered ? [1, 1, 0] : 1,
            }}
            transition={{
              duration: 0.7,
              delay: isHovered ? 0.15 : 0,
              times: isHovered ? [0, 0.2, 1] : undefined,
              ease: "easeOut"
            }}
            style={{ transformOrigin: "300px 80px" }}
          >
            <path
              d="M 300 20 L 370 20 Q 375 20 375 25 L 375 75 Q 365 75 365 85 Q 365 95 375 95 L 375 135 Q 375 140 370 140 L 300 140 Z"
              fill="#171726"
              stroke="#7c3aed"
              strokeWidth="2"
            />

            {/* Dashed line at intersection */}
            <line
              x1="300"
              y1="20"
              x2="300"
              y2="140"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Perforation circles */}
            {[35, 50, 65, 80, 95, 110, 125].map((y) => (
              <circle
                key={y}
                cx="300"
                cy={y}
                r="2"
                fill="#7c3aed"
                opacity="0.8"
              />
            ))}
          </motion.g>

          {/* Slash Flash at intersection */}
          <motion.circle
            cx="300"
            cy="80"
            r="60"
            fill="url(#flash-gradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? [0, 1.5, 2.5] : 0,
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 0.25,
              delay: isHovered ? 0.1 : 0,
              ease: "easeOut"
            }}
            style={{ pointerEvents: "none" }}
          />

          {/* Cutting slash outer glow */}
          <motion.path
            d="M 340 -40 Q 300 80 260 200"
            stroke="#7c3aed"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            filter="url(#sword-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isHovered ? [0, 1] : 0,
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 0.25,
              delay: isHovered ? 0.05 : 0,
              ease: "easeOut",
              opacity: { times: isHovered ? [0, 0.4, 1] : undefined }
            }}
            style={{ pointerEvents: "none" }}
          />

          {/* Cutting slash inner core */}
          <motion.path
            d="M 340 -40 Q 300 80 260 200"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isHovered ? [0, 1] : 0,
              opacity: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: 0.25,
              delay: isHovered ? 0.05 : 0,
              ease: "easeOut",
              opacity: { times: isHovered ? [0, 0.4, 1] : undefined }
            }}
            style={{ pointerEvents: "none" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
