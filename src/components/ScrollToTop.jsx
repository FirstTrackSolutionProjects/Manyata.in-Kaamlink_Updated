
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();

  // Automatically scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    setVisible(false);
  }, [pathname]);

  // Show scroll button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      className={`
        group fixed bottom-5 right-4 sm:bottom-7 sm:right-7 z-[999]
        flex h-12 w-12 sm:h-14 sm:w-14
        items-center justify-center
        rounded-2xl border border-white/20
        bg-[#142b3b] text-amber-400
        shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:bg-amber-400 hover:text-[#142b3b]
        active:scale-95
        focus-visible:outline-none
        focus-visible:ring-4 focus-visible:ring-amber-400/40
        ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-8 scale-75 opacity-0"
        }
      `}
    >
      <ArrowUp
        size={23}
        strokeWidth={2.5}
        className="transition-transform duration-300 group-hover:-translate-y-1"
      />
    </button>
  );
}