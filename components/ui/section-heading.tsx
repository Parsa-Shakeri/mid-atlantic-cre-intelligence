export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="max-w-3xl">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2 className="mt-5 font-serif text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-navy sm:text-5xl lg:text-6xl">{title}</h2>{description ? <p className="section-description mt-5 max-w-2xl text-base leading-7 text-slate">{description}</p> : null}</div>;
}
