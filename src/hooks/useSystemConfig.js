import { useEffect, useState, useCallback } from "react";
import {
  loadSystemConfig,
  getSystemItems,
  getSystemItemOptions,
  getSystemItem,
} from "../features/systemCodeItems/systemConfigService";

export function useSystemConfig() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadSystemConfig().then(() => {
      if (mounted) setReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const getItems = useCallback((code) => getSystemItems(code), []);
  const getOptions = useCallback((code) => getSystemItemOptions(code), []);
  const getItem = useCallback((code, item) => getSystemItem(code, item), []);

  return {
    ready,
    getItems,
    getOptions,
    getItem,
  };
}
