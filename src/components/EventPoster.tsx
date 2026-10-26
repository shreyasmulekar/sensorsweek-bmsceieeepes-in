type EventPosterProps = {
  src: string;
  name: string;
  eager?: boolean;
};

/**
 * Event poster shown whole — nothing is cropped and no empty space is left
 * beside it, because the frame is exactly the poster's own width and height.
 */
export function EventPoster({ src, name, eager = false }: EventPosterProps) {
  return (
    <div className="w-full overflow-hidden rounded-t-2xl">
      <img
        src={src}
        alt={`${name} poster`}
        width={768}
        height={768}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
