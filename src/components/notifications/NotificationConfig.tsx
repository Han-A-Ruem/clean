
import { ReactNode } from "react";
import { NotificationConfig as NotificationConfigProps } from "@/contexts/NotificationContext";
import { usePageNotificationConfig } from "@/hooks/usePageNotificationConfig";

interface Props extends NotificationConfigProps {
  children?: ReactNode;
}

/**
 * Component for configuring notifications on a specific page
 * Wrap your page content with this component to set notification position
 * 
 * @example
 * <NotificationConfig position="bottom-right" offset="6rem">
 *   <YourPageContent />
 * </NotificationConfig>
 */
export const NotificationConfig = ({ children, ...configProps }: Props) => {
  usePageNotificationConfig(configProps);
  
  return <>{children}</>;
};

export default NotificationConfig;
