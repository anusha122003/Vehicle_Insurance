import { useState } from 'react';

export function useMouseParallax() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e, elementRef) => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);

    // Update CSS custom variables dynamically for modern spotlight/border mask effects
    elementRef.current.style.setProperty('--mouse-x', `${x}px`);
    elementRef.current.style.setProperty('--mouse-y', `${y}px`);

    const width = rect.width;
    const height = rect.height;
    
    // Normalise offsets from -1 to 1 for delicate parallax depth shifting
    const relativeX = (e.clientX - rect.left - width / 2) / (width / 2);
    const relativeY = (e.clientY - rect.top - height / 2) / (height / 2);

    setCoords({ x: relativeX, y: relativeY });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return {
    coords,
    mousePos,
    isHovered,
    handleMouseMove,
    handleMouseLeave
  };
}
