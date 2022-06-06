import React from "react";

export default function DropdownDeleteMode({ open, children }) {
  if (!open) return null;
  return <div>{children}</div>;
}
