import { useEffect, useState } from "react";

/** Indica si la página está desplazada, para compactar el navbar. */
export function useScrollCompact(threshold = 24) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return compact;
}
