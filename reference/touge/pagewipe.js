import { jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import * as FramerLib from "framer";
import { addPropertyControls } from "framer";
const useRouter = FramerLib.useRouter;
const TOUCH = typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;
const OUT_MS = TOUCH ? 240 : 300;
const IN_MS = TOUCH ? 440 : 520;
const OUT_EASE = "cubic-bezier(0.55, 0, 0.75, 0.45)";
const IN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const depth = (path) => path.split("/").filter(Boolean).length;
const pageRoot = () => document.getElementById("main");
function resolveRoute(routes, pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const [id, r] of Object.entries(routes)) {
    const pattern = r?.path;
    if (!pattern) continue;
    const keys = [];
    const re = new RegExp("^" + pattern.replace(/\/+$/, "").replace(/:([A-Za-z0-9_]+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$");
    const m = clean.match(re);
    if (!m) continue;
    const vars = {};
    keys.forEach((k, i) => vars[k] = decodeURIComponent(m[i + 1]));
    return { id, vars };
  }
  return null;
}
const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
async function newPageReady(from) {
  const started = performance.now();
  while (window.location.pathname === from && performance.now() - started < 400) await wait(16);
  await Promise.race([frame().then(frame), wait(80)]);
  await wait(40);
}
let running = false;
async function transition(go, back) {
  const el = pageRoot();
  if (running || !el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return go();
  running = true;
  const w = window;
  w.__jlMoving = true;
  const html = document.documentElement;
  const from = window.location.pathname;
  const dir = back ? 1 : -1;
  try {
    html.style.overflowX = "clip";
    el.style.willChange = "transform";
    el.style.transition = `transform ${OUT_MS}ms ${OUT_EASE}`;
    el.style.transform = `translate3d(${dir * 100}vw, 0, 0)`;
    await wait(OUT_MS);
    go();
    await newPageReady(from);
    const nu = pageRoot() || el;
    nu.style.willChange = "transform";
    nu.style.transition = "none";
    nu.style.transform = `translate3d(${-dir * 100}vw, 0, 0)`;
    void nu.offsetWidth;
    nu.style.transition = `transform ${IN_MS}ms ${IN_EASE}`;
    nu.style.transform = "translate3d(0, 0, 0)";
    await wait(IN_MS + 30);
    for (const node of /* @__PURE__ */ new Set([el, nu])) {
      node.style.transition = "";
      node.style.transform = "";
      node.style.willChange = "";
    }
  } finally {
    html.style.overflowX = "";
    w.__jlMoving = false;
    running = false;
  }
}
function PageWipe(props) {
  const router = useRouter?.();
  const routerRef = useRef(router);
  routerRef.current = router;
  useEffect(() => {
    const routes = router?.routes;
    if (!routes) return;
    const warm = () => {
      for (const r of Object.values(routes)) {
        try {
          r?.page?.preload?.();
        } catch {
        }
      }
    };
    const w = window;
    const id = w.requestIdleCallback ? w.requestIdleCallback(warm, { timeout: 3e3 }) : window.setTimeout(warm, 1500);
    return () => w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id);
  }, [router]);
  useEffect(() => {
    const w = window;
    if (w.__jlGlideBound) return;
    w.__jlGlideBound = true;
    w.__jlCover = (go) => transition(go, true);
    const target = (a, e) => {
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
      if (a.target && a.target !== "_self") return null;
      if (a.hasAttribute("download")) return null;
      const raw = a.getAttribute("href") || "";
      if (!raw || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw)) return null;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return null;
      }
      if (url.origin !== window.location.origin || /\.(pdf|png|jpe?g|webp|svg|zip)$/i.test(url.pathname)) return null;
      if (url.pathname === window.location.pathname) return null;
      const routes = routerRef.current?.routes;
      const route = routes && typeof routerRef.current?.navigate === "function" ? resolveRoute(routes, url.pathname) : null;
      if (!route) return null;
      const back = depth(url.pathname) < depth(window.location.pathname) || !!a.closest('[data-framer-name="Previous project"]');
      return { route, hash: url.hash ? url.hash.slice(1) : void 0, back };
    };
    const open = (t) => transition(() => routerRef.current.navigate(t.route.id, t.hash, t.route.vars), t.back);
    let swallowClickUntil = 0;
    let bypass = false;
    const onClick = (e) => {
      if (!bypass && performance.now() < swallowClickUntil) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      const t = target(e.target?.closest?.("a"), e);
      if (!t) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open(t);
    };
    window.addEventListener("click", onClick, true);
    let down = null;
    window.addEventListener(
      "pointerdown",
      (e) => {
        down = e.pointerType === "touch" || e.pointerType === "pen" ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId } : null;
      },
      true
    );
    window.addEventListener(
      "pointerup",
      (e) => {
        if (e.pointerType !== "touch" && e.pointerType !== "pen" || !down || down.id !== e.pointerId) return;
        const isTap = Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10 && performance.now() - down.t < 600;
        down = null;
        if (!isTap) return;
        const t = target(e.target?.closest?.("a"), e);
        if (!t) {
          const btn = e.target?.closest?.('[role="button"]');
          if (!btn || e.target?.closest?.("a")) return;
          e.preventDefault();
          swallowClickUntil = performance.now() + 800;
          bypass = true;
          try {
            btn.click();
          } finally {
            bypass = false;
          }
          return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        swallowClickUntil = performance.now() + 800;
        open(t);
      },
      true
    );
  }, []);
  return /* @__PURE__ */ jsx("div", { style: { ...props.style, width: 1, height: 1, pointerEvents: "none" } });
}
addPropertyControls(PageWipe, {});
export {
  PageWipe as default
};
