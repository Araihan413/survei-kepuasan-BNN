// hooks/useDiagramColor.js
import { useEffect, useState } from "react";

export function useDiagramColor(id, defaultColor = "#1bdd24") {
  const key = `diagramColor-${id}`;
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setColor(stored);
  }, [key]);

  const updateColor = (newColor) => {
    setColor(newColor);
    localStorage.setItem(key, newColor);
  };

  return [color, updateColor];
}
