export function SectionHeading({ eyebrow, title, description, tone = "light" }: { eyebrow?: string; title: string; description?: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return <div className="max-w-3xl">{eyebrow ? <p className={dark ? "eyebrow text-[#e89a76]" : "eyebrow"}>{eyebrow}</p> : null}<h2 className={`mt-5 font-serif text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl ${dark ? "text-white" : "text-navy"}`}>{title}</h2>{description ? <p className={`section-description mt-5 max-w-2xl text-base leading-7 ${dark ? "text-[#c7d0d6]" : "text-slate"}`}>{description}</p> : null}</div>;
}
