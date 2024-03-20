import { ImgHTMLAttributes } from "react";
import { Fullscreen } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const ImageViewer: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
}) => {
  const openImg = () => {
    window.open(src, "_blank");
  };

  return (
    <>
      {!src && (
        <Skeleton className="flex aspect-video w-[364px] items-center justify-center rounded-xl">
          Processing Image
        </Skeleton>
      )}
      {src && (
        <Button
          variant="outline"
          type="button"
          className="group relative aspect-video h-full w-[364px] cursor-pointer px-1 py-2"
          onClick={openImg}
          title="Open image"
        >
          <img
            src={src}
            loading="lazy"
            alt={alt}
            className="flex aspect-video w-[364px] rounded-xl object-cover p-2 transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 flex flex-row gap-4">
            <Button variant="ghost" onClick={openImg} title="Open image">
              <Fullscreen />
            </Button>
          </div>
        </Button>
      )}
    </>
  );
};

export default ImageViewer;
