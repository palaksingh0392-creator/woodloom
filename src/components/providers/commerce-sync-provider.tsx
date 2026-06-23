"use client";

import { useEffect } from "react";

import { commerceActions } from "@/store/commerce-store";

export default function CommerceSyncProvider() {
  useEffect(() => {
    void commerceActions.syncWithAccount();
  }, []);

  return null;
}
