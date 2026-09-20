"use client";

import { useEffect, useRef, useState } from "react";

type HoverLabel = {
  text: string;
  x: number;
  y: number;
  placement: "above" | "below";
  element: HTMLElement;
};

const hoverableSelector = "[data-hover-label]";

function getLabel(element: HTMLElement) {
  return (element.dataset.hoverLabel ?? "").trim();
}

function getTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const element = target.closest<HTMLElement>(hoverableSelector);

  if (
    !element ||
    element.closest("[data-hover-label-ignore]") ||
    element === document.body
  ) {
    return null;
  }

  const text = getLabel(element);

  return text ? { element, text: text.slice(0, 96) } : null;
}

export default function HoverLabels() {
  const [label, setLabel] = useState<HoverLabel | null>(null);
  const activeElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function showLabel(event: PointerEvent) {
      const target = getTarget(event.target);

      if (!target) {
        return;
      }

      const relatedTarget = event.relatedTarget;
      if (
        relatedTarget instanceof Node &&
        target.element.contains(relatedTarget)
      ) {
        return;
      }

      if (activeElement.current === target.element) {
        return;
      }

      const bounds = target.element.getBoundingClientRect();
      const placement = target.element.dataset.hoverLabelPlacement === "above" ? "above" : "below";

      activeElement.current = target.element;
      setLabel({
        text: target.text,
        x: bounds.left + bounds.width / 2,
        y: placement === "above" ? bounds.top - 10 : bounds.bottom + 10,
        placement,
        element: target.element,
      });
    }

    function hideLabel(event: PointerEvent) {
      const relatedTarget = event.relatedTarget;

      if (
        activeElement.current &&
        relatedTarget instanceof Node &&
        activeElement.current.contains(relatedTarget)
      ) {
        return;
      }

      activeElement.current = null;
      setLabel(null);
    }

    document.addEventListener("pointerover", showLabel);
    document.addEventListener("pointerout", hideLabel);

    return () => {
      document.removeEventListener("pointerover", showLabel);
      document.removeEventListener("pointerout", hideLabel);
    };
  }, []);

  if (!label) {
    return null;
  }

  return (
    <div
      role="tooltip"
      aria-hidden="true"
      className={`hover-label ${label.placement === "above" ? "hover-label-above" : ""}`}
      style={{ left: label.x, top: label.y }}
    >
      {label.text}
    </div>
  );
}
