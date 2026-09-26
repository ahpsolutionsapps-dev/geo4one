import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, RefObject, useRef } from "react";

import { Button } from "@/components/ui";

interface EntityImagenFieldProps {
  title: string;
  entityId?: string;
  imagenUrl?: string | null;
  disabled?: boolean;
  pendingFile?: File | null;
  onPendingFileChange?: (file: File | null) => void;
  enableCrop?: boolean;
  cropAspectRatio?: number;
  cropTitle?: string;
  addButtonRef?: RefObject<HTMLButtonElement | null>;
  addButtonTitle?: string;
  onUpload?: (file: File) => Promise<string | null>;
  onRemove?: () => Promise<string | null>;
}

export function EntityImagenField({
  title,
  entityId,
  imagenUrl,
  disabled,
  pendingFile,
  onPendingFileChange,
  addButtonRef,
  addButtonTitle,
  onUpload,
  onRemove,
}: EntityImagenFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = pendingFile ? URL.createObjectURL(pendingFile) : imagenUrl;

  const handleChoose = () => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onPendingFileChange?.(file);

    if (file && entityId && onUpload) {
      await onUpload(file);
      onPendingFileChange?.(null);
    }

    event.target.value = "";
  };

  const handleRemove = async () => {
    if (disabled) {
      return;
    }

    if (entityId && onRemove) {
      await onRemove();
    }

    onPendingFileChange?.(null);
  };

  return (
    <section className="rounded-lg border border-gray-200 p-4 dark:border-dark-500">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-dark-100">{title}</h4>

      <div className="mt-3 overflow-hidden rounded-lg border border-dashed border-gray-300 dark:border-dark-400">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 items-center justify-center bg-gray-50 text-sm text-gray-500 dark:bg-dark-600 dark:text-dark-200">
            Sin imagen
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div className="mt-3 flex gap-2">
        <Button
          ref={addButtonRef}
          type="button"
          variant="outlined"
          className="h-9 flex-1"
          disabled={disabled}
          title={addButtonTitle}
          onClick={handleChoose}
        >
          <ArrowUpTrayIcon className="size-4" />
          <span>Subir imagen</span>
        </Button>

        <Button
          type="button"
          color="error"
          variant="soft"
          className="h-9"
          disabled={disabled || (!previewUrl && !pendingFile)}
          onClick={() => {
            void handleRemove();
          }}
        >
          <TrashIcon className="size-4" />
          <span>Quitar</span>
        </Button>
      </div>
    </section>
  );
}
