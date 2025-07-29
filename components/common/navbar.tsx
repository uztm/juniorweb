import React from "react";
import { AccountDialogMenu } from "./items/accountDialog";

export default function Navbar() {
  return (
    <div className="w-full py-2 bg-white shadow flex items-center justify-between px-6">
      <h1>Dashboard</h1>

      <AccountDialogMenu />
    </div>
  );
}
