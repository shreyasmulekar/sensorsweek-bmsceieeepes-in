type EventPosterProps = {
  src: string;
  name: string;
  eager?: boolean;
};

export function EventPoster({ src, name, eager = false }: EventPosterProps) {
  return (
    <div className="w-full overflow-hidden rounded-t-2xl bg-background/40">
      <img
        src={src}
        alt={`${name} poster`}
        width={768}
        height={768}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block h-auto w-full object-cover"
      />
    </div>
  );
}