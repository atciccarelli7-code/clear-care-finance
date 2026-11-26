import { EDITORIAL_COVERS, coverPath } from "@/data/editorialCovers";

export function EditorialCover({ slug, priority = false, caption = false, className = "", sizes = "(min-width: 768px) 50vw, 100vw" }: {
  slug: string; priority?: boolean; caption?: boolean; className?: string; sizes?: string;
}) {
  const cover = EDITORIAL_COVERS[slug];
  if (!cover) return null;
  return (
    <figure className={`editorial-cover ${className}`}>
      <img src={coverPath(cover.file)}
        srcSet={[480, 960, 1440].map(width => `${coverPath(cover.file, width)} ${width}w`).join(", ")}
        sizes={sizes} width={1440} height={960} alt={caption ? cover.alt : ""}
        loading={priority ? "eager" : "lazy"} {...(priority && { fetchpriority: "high" })} decoding="async" />
      {caption && <figcaption>CAF editorial illustration · Created with AI assistance. Conceptual; does not depict an actual event.</figcaption>}
    </figure>
  );
}
