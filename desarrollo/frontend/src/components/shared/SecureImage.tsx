import { UserIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ImgHTMLAttributes, useState } from "react";

interface SecureImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

export function SecureImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: SecureImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={clsx(
          "flex size-full items-center justify-center rounded-full bg-primary-600/10 text-primary-600",
          fallbackClassName,
        )}
        aria-label={alt || "Imagen no disponible"}
      >
        <UserIcon className="size-5" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
