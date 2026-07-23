export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="max-w-3xl">{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}<h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-navy sm:text-5xl">{title}</h2>{description ? <p className="section-description mt-5 max-w-2xl text-base leading-7 text-slate">{description}</p> : null}</div>;
}
