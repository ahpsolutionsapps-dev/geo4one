import { toast } from "sonner";

export function showPrimaryToast(message: string): void {
  toast.success(message);
}
