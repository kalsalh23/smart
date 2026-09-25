import Link from "next/link";
import Icon from "./Icon";

/** Editorial section header: gold eyebrow + Amiri heading + hairline. */
export default function SectionHead({
  eyebrow,
  title,
  linkHref,
  linkLabel = "عرض الكل",
}: {
  eyebrow: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2.5">
            <Icon name="sparkle" className="h-3 w-3 text-gold-500" strokeWidth={1.4} />
            {eyebrow}
          </p>
          <h2 className="mt-1.5 font-display-ar text-[26px] font-bold leading-tight text-ink md:text-3xl">
            {title}
          </h2>
        </div>
        {linkHref && (
          <Link
            href={linkHref}
            className="shrink-0 text-[13px] font-bold text-plum underline-offset-4 transition hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      <div className="mt-3 h-px w-full bg-gradient-to-l from-ink/12 via-ink/5 to-transparent" />
    </div>
  );
}
