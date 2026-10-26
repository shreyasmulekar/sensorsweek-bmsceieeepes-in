import type { EventPosterProps } from "./EventPoster.types";

/**
 * Event poster, cropped to its frame so no dead space shows.
 * The top of the artwork (title and key art) is always kept; the bottom,
 * where fees and contact numbers live, is repeated in the card text anyway.
 */
export function EventPoster({ src, name, eager = false, frameClass = "aspect-[4/3] sm:aspect-[16/9]" }: EventPosterProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-t-2xl bg-background/40 ${frameClass}`}>
      <img
        src={src}
        alt={`${name} poster`}
        width={768}
        height={768}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      {/* fades the poster into the card so the edge never reads as empty space */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}
