import { useEffect, useState } from "react";

export default function AlertMessage({ type, text, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [text, duration]);

  if (!text || !visible) return null;

  const styles =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      role="alert"
      className={`p-3 rounded-lg text-white font-medium ${styles} 
        transition-opacity duration-500 ease-in-out 
        ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {text}
    </div>
  );
}