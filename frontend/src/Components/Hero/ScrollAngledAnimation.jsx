import React, { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

// This component links animation progress to scroll progress
const ScrollAngledAnimation = ({ children }) => {
  const targetRef = useRef(null);

  // useScroll monitors scroll progress relative to the target element
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Offset defines when the animation starts and ends relative to viewport
    // 'start end': Animation starts when the top of the target hits the bottom of the viewport
    // 'end start': Animation ends when the bottom of the target hits the top of the viewport
    offset: ['start end', 'end start'],
  });

  // useTransform maps scrollYProgress (0 to 1) to animation values
  // Tweak these values to get the exact angle and distance you want!

  // Horizontal movement (from left -100% to right +100%)
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ['-100%', '0%', '100%']);

  // Vertical movement for the angle (e.g., starts 50px down, ends 50px up)
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ['50px', '0px', '-50px']);

  // Rotation for the angle (e.g., starts rotated left, ends rotated right)
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]); // degrees

  // Opacity (fade in, fully visible, fade out)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]); // Adjust fade points

  return (
    // Use motion.div and apply the transformed values to the style prop
    // The outer div is needed to establish a reference point for positioning if needed
    <div ref={targetRef} style={{ position: 'relative' }}> {/* Ensures positioning context */}
      <motion.div
        style={{
          position: 'relative', // Or 'absolute' if needed within the ref div
          opacity: opacity,
          x: x,
          y: y,
          rotate: rotate,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollAngledAnimation;