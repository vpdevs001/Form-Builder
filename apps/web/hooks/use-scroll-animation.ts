import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            // Once animated, we don't need to observe it anymore
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px", // triggers slightly before entering view
      }
    );

    // Give a short delay to make sure DOM elements are mounted and styled
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-animate");
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
