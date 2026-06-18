"use client";
import { useToastStore } from "@/lib/store";

export default function Toast() {
  const { visible, title, sub, isError } = useToastStore();
  return (
    <div className={`toast ${visible ? "show" : ""} ${isError ? "error" : ""}`} id="toast">
      <i id="toast-icon" className={isError ? "ti ti-alert-circle-filled" : "ti ti-circle-check-filled"}></i>
      <div className="toast-body">
        <div id="toast-text">{title}</div>
        <div id="toast-sub" style={{ display: sub ? "block" : "none" }}>{sub}</div>
      </div>
    </div>
  );
}
