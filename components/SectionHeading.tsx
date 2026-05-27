type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
