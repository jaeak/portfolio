import { jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as FramerLib from "framer";
const useRouter = FramerLib.useRouter;
const KEY = "jl-return";
function saveSpot() {
  try {
    const spot = { path: window.location.pathname, y: window.scrollY };
    sessionStorage.setItem(KEY, JSON.stringify(spot));
  } catch {
  }
}
function withSaveReturnSpot(Component) {
  return (props) => /* @__PURE__ */ jsx(
    "div",
    {
      style: { display: "contents" },
      onPointerDownCapture: saveSpot,
      onKeyDownCapture: (event) => {
        if (event.key === "Enter" || event.key === " ") saveSpot();
      },
      children: /* @__PURE__ */ jsx(Component, { ...props })
    }
  );
}
function withHistoryBack(Component) {
  return (props) => {
    const router = useRouter();
    const down = useRef(null);
    const skipClickUntil = useRef(0);
    const goBack = () => {
      if (typeof window === "undefined") return;
      let saved = null;
      try {
        saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
      } catch {
      }
      const targetPath = saved?.path || "/";
      const routes = router?.routes || {};
      const routeId = Object.keys(routes).find((id) => routes[id]?.path === targetPath) ?? Object.keys(routes).find((id) => routes[id]?.path === "/");
      if (routeId && typeof router?.navigate === "function") {
        const cover = window.__jlCover;
        const go = () => {
          if (!saved) {
            router.navigate(routeId, "projects");
            return;
          }
          router.navigate(routeId);
          const started = performance.now();
          const pin = () => {
            if (window.location.pathname === targetPath) {
              const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
              const top = Math.min(saved.y, max);
              if (Math.abs(window.scrollY - top) > 1) {
                window.scrollTo({ top, behavior: "instant" });
              }
            }
            if (performance.now() - started < 700) requestAnimationFrame(pin);
          };
          pin();
          requestAnimationFrame(pin);
        };
        if (typeof cover === "function") cover(go);
        else go();
      }
    };
    return /* @__PURE__ */ jsx(
      Component,
      {
        ...props,
        role: "button",
        tabIndex: 0,
        onPointerDown: (event) => {
          down.current = event.pointerType === "mouse" ? null : { x: event.clientX, y: event.clientY, t: performance.now() };
        },
        onPointerUp: (event) => {
          const d = down.current;
          down.current = null;
          if (!d || event.pointerType === "mouse") return;
          if (Math.hypot(event.clientX - d.x, event.clientY - d.y) > 10 || performance.now() - d.t > 600) return;
          skipClickUntil.current = performance.now() + 800;
          goBack();
        },
        onClick: (event) => {
          event?.preventDefault?.();
          event?.stopPropagation?.();
          if (performance.now() < skipClickUntil.current) return;
          goBack();
        }
      }
    );
  };
}
export {
  withHistoryBack,
  withSaveReturnSpot
};
