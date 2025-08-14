export const cardVariants = {
  enter: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    rotateX: -15,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    rotateX: 15,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.06, 0.68, 0.19] as const,
    },
  },
};

export const timerVariants = {
  green: { stroke: "#10b981" },
  amber: { stroke: "#f59e0b" },
  red: { stroke: "#ef4444" },
};

export const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};