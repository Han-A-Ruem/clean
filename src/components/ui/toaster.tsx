
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useNotification } from "@/contexts/NotificationContext"

export function Toaster() {
  const { toasts } = useToast()
  const { config } = useNotification()

  // Convert notification context position to viewport CSS variables
  const getViewportStyle = () => {
    const style: React.CSSProperties = {};
    
    if (config.offset) {
      if (config.position?.includes("top")) {
        style.top = config.offset;
      } else if (config.position?.includes("bottom")) {
        style.bottom = config.offset;
      }
      
      if (config.position?.includes("right")) {
        style.right = "0";
      } else if (config.position?.includes("left")) {
        style.left = "0";
      } else {
        // center
        style.left = "50%";
        style.transform = "translateX(-50%)";
      }
    }
    
    return style;
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, hideCloseButton, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {!hideCloseButton && <ToastClose />}
          </Toast>
        )
      })}
      <ToastViewport className="ToastViewport" style={getViewportStyle()} />
    </ToastProvider>
  )
}
