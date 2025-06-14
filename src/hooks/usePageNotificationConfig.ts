
import { useEffect } from "react";
import { NotificationConfig, useNotification } from "@/contexts/NotificationContext";

/**
 * Hook for setting notification configuration for a specific page or component
 * 
 * @param config The notification configuration for this page
 * @returns void
 * 
 * @example
 * // In your page component:
 * usePageNotificationConfig({
 *   position: "bottom-right",
 *   offset: "5rem",
 *   reset: true // Reset to defaults when component unmounts
 * });
 */
export function usePageNotificationConfig(config: NotificationConfig): void {
  const { updateConfig, resetConfig } = useNotification();
  
  useEffect(() => {
    updateConfig(config);
    
    return () => {
      // Only reset if reset is true or undefined (default behavior)
      if (config.reset !== false) {
        resetConfig();
      }
    };
  }, [config.position, config.offset, config.reset]);
}
