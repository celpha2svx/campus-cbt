"use client";

import { useSyncExternalStore } from "react";
import { getProgressMap } from "./progress";
import { QuestionProgressMap } from "./types";

const EMPTY_PROGRESS: QuestionProgressMap = {};

export function useProgressMap() {
  return useSyncExternalStore(subscribeToProgress, getProgressMap, getServerSnapshot);
}

function subscribeToProgress(onStoreChange: () => void) {
  window.addEventListener("campus-cbt-progress-updated", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("campus-cbt-progress-updated", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot() {
  return EMPTY_PROGRESS;
}
