import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const CYAN = "255, 160, 64";
function withP3Heading(Component) {
  return (props) => /* @__PURE__ */ jsx(
    Component,
    {
      ...props,
      style: {
        ...props.style,
        transform: "rotate(-3deg)",
        transformOrigin: "left center",
        paddingLeft: 4,
        paddingRight: 14,
        textShadow: "2px 2px 0 rgba(0, 18, 70, 0.55)"
      }
    }
  );
}
function withP3Tilt(Component) {
  return (props) => /* @__PURE__ */ jsx(
    Component,
    {
      ...props,
      style: {
        ...props.style,
        transform: "rotate(-4deg)",
        transformOrigin: "left center",
        textShadow: "3px 3px 0 rgba(0, 18, 70, 0.55)"
      }
    }
  );
}
const WRAP_CSS = ``;
function withP3HeadingWrap(Component) {
  return (props) => /* @__PURE__ */ jsxs("div", { "data-jl-p3wrap": "", style: { display: "contents" }, children: [
    /* @__PURE__ */ jsx("style", { children: WRAP_CSS }),
    /* @__PURE__ */ jsx(
      Component,
      {
        ...props,
        style: {
          ...props.style,
          transform: "rotate(-3deg)",
          transformOrigin: "left center",
          textShadow: "2px 2px 0 rgba(0, 18, 70, 0.55)"
        }
      }
    )
  ] });
}
function withReadableShadow(Component) {
  return (props) => /* @__PURE__ */ jsx(Component, { ...props, style: { ...props.style, textShadow: "0 1px 2px rgba(0, 0, 0, 0.9), 0 0 14px rgba(0, 0, 0, 0.75), 0 0 28px rgba(0, 0, 0, 0.45)" } });
}
const SPEC_CSS = `
.jl-spec-row{display:flex;flex-wrap:wrap;align-content:flex-start;gap:6px;overflow:hidden}
.jl-spec{display:inline-flex;align-items:baseline;gap:6px;padding:4px 8px 4px 7px;border-radius:6px;background:rgba(8,8,12,.62);border:1px solid rgba(255,160,64,.32);box-shadow:inset 0 1px 0 rgba(255,255,255,.05);white-space:nowrap;max-width:100%}
.jl-spec b{font:700 10px/1 "Pixelify Sans",ui-monospace,monospace;letter-spacing:.06em;color:#FFA040;text-transform:uppercase}
.jl-spec span{font:500 11.5px/1.15 Inter,sans-serif;color:rgba(242,244,250,.9);overflow:hidden;text-overflow:ellipsis}
`;
const SPEC_FONT = "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@700&display=swap";
function withSpecPlate(Component) {
  return (props) => {
    const ref = useRef(null);
    const [text, setText] = useState("");
    useEffect(() => {
      if (!document.getElementById("jl-spec-font")) {
        const l = document.createElement("link");
        l.id = "jl-spec-font";
        l.rel = "stylesheet";
        l.href = SPEC_FONT;
        document.head.appendChild(l);
      }
      const el = ref.current;
      if (!el) return;
      const read = () => setText((el.textContent || "").trim());
      read();
      const mo = new MutationObserver(read);
      mo.observe(el, { childList: true, subtree: true, characterData: true });
      return () => mo.disconnect();
    }, []);
    const parts = text.split(/\s+·\s+/).map((p) => p.trim()).filter(Boolean).map((p) => {
      const i = p.indexOf(":");
      return i > 0 ? [p.slice(0, i).trim(), p.slice(i + 1).trim()] : ["", p];
    });
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: SPEC_CSS }),
      /* @__PURE__ */ jsx(Component, { ...props, ref, style: { ...props.style, position: "absolute", visibility: "hidden", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx("div", { className: "jl-spec-row", style: { width: props.style?.width ?? "100%", height: props.style?.height, minHeight: 22 }, children: parts.map(([k, v], i) => /* @__PURE__ */ jsxs("div", { className: "jl-spec", children: [
        k && /* @__PURE__ */ jsx("b", { children: k }),
        /* @__PURE__ */ jsx("span", { children: v })
      ] }, i)) })
    ] });
  };
}
export {
  withP3Heading,
  withP3HeadingWrap,
  withP3Tilt,
  withReadableShadow,
  withSpecPlate
};
