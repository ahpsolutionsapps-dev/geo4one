import { useEffect } from "react";

import {
  getRealtimeBrowserEventName,
  RealtimeEvent,
} from "@/shared/api/websocket-client";

export function useWebSocketEvent(
  event: RealtimeEvent,
  handler: () => void,
): void {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const eventName = getRealtimeBrowserEventName(event);
    const listener = () => handler();

    window.addEventListener(eventName, listener as EventListener);

    return () => {
      window.removeEventListener(eventName, listener as EventListener);
    };
  }, [event, handler]);
}
