import { useEffect, useState } from "react";

export default (timestamp) => {
  const [text, setText] = useState("Unknown");

  useEffect(() => {
    const update = () => {
      if (!timestamp) return;

      const now = Date.now();
      const diff = (now - new Date(timestamp)) / 1000; // seconds

      let result;
      if (diff < 60) result = "just now";
      else if (diff < 3600) result = `${Math.floor(diff / 60)} min ago`;
      else if (diff < 86400) result = `${Math.floor(diff / 3600)} hr ago`;
      else result = `${Math.floor(diff / 86400)} days ago`;

      setText(result);
    };

    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return text;
};
