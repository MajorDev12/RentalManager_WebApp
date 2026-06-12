import { systemCodeItemService } from "./systemCodeItemService";
const STORAGE_KEY = "system_config_cache_v1";

// =======================
// Singleton state
// =======================
let memoryCache = null;
let isLoading = false;
let listeners = [];

// =======================
// Normalize API response
// =======================
function normalize(data) {
  if (!Array.isArray(data)) return {};
  const map = {};

  data.forEach((x) => {
    const key = x.systemCodeName;

    if (!map[key]) {
      map[key] = [];
    }

    map[key].push({
      id: x.id,
      item: x.item,
      displayName: x.displayName,
      color: x.color,
      iconKey: x.iconKey,
      groupKey: x.groupKey,
      notes: x.notes,
      systemCodeId: x.systemCodeId,
    });
  });

  return map;
}

// =======================
// Load system config (single source of truth)
// =======================
export async function loadSystemConfig() {
  // already in memory
  if (memoryCache) return memoryCache;

  // if already loading → queue request
  if (isLoading) {
    return new Promise((resolve) => listeners.push(resolve));
  }

  isLoading = true;

  try {
    // 1. try localStorage first
    const cached = localStorage.getItem(STORAGE_KEY);

    if (cached) {
      try {
        memoryCache = JSON.parse(cached);

        // resolve queued listeners
        listeners.forEach((cb) => cb(memoryCache));
        listeners = [];

        isLoading = false;

        return memoryCache;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. fetch from API
    const response = await systemCodeItemService.getAll();
    console.log("System config loaded from API:", response);

    memoryCache = normalize(response.data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));

    // resolve queued listeners
    listeners.forEach((cb) => cb(memoryCache));
    listeners = [];

    isLoading = false;

    return memoryCache;
  } catch (err) {
    console.error("System config load failed:", err);

    isLoading = false;
    listeners = [];

    return {};
  }
}

// =======================
// Internal API call (centralized)
// =======================

// =======================
// Ensure loaded
// =======================
export async function ensureSystemConfig() {
  if (memoryCache) return memoryCache;
  return await loadSystemConfig();
}

// =======================
// Get all items under a system code
// =======================
export function getSystemItems(code) {
  if (!memoryCache) return [];
  return memoryCache[code] ?? [];
}

// =======================
// Get dropdown-ready options
// =======================
export function getSystemItemOptions(code) {
  if (!memoryCache?.[code]) return [];

  return memoryCache[code].map((x) => ({
    label: x.displayName,
    value: x.item,
    icon: x.iconKey,
    color: x.color,
  }));
}

// =======================
// Get single item
// =======================
export function getSystemItem(code, item) {
  return memoryCache?.[code]?.find((x) => x.item === item) ?? null;
}

// =======================
// Clear cache (logout / refresh / admin update)
// =======================
export function clearSystemConfigCache() {
  memoryCache = null;
  localStorage.removeItem(STORAGE_KEY);
}
