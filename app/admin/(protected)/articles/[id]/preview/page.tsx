import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { parseMarkdownSections } from "@/lib/markdown";

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { client } = await requireAdmin();
  const { data: article } = await client.from("articles").select("*").eq("id", id).maybeSingle();
  if (!article) notFound();
  const sections = parseMarkdownSections(article.body);
  return <article className="panel mx-auto max-w-4xl p-6 sm:p-10"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5"><div><p className="eyebrow">Protected preview · {article.status}</p><p className="mt-2 text-xs text-slate">This view is never indexed and is not the public article route.</p></div><Link className="button-secondary" href={`/admin/articles?edit=${article.id}`}>Return to editor</Link></div>
    {article.is_sample ? <p className="mt-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">Fictional sample research — not a real market report.</p> : null}
    <header className="py-10"><p className="eyebrow">{article.category}</p><h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-navy sm:text-5xl">{article.title}</h1><p className="mt-5 text-xl leading-8 text-slate">{article.thesis}</p><p className="mt-5 text-sm text-slate">{article.author} · {article.reading_time} min read · {article.publication_date ?? "Unscheduled"}</p></header>
    {article.executive_summary.length ? <section className="border-y border-line bg-mist/40 p-6"><h2 className="font-serif text-2xl text-navy">Executive summary</h2><ul className="mt-4 grid gap-3">{article.executive_summary.map((point) => <li className="border-l-2 border-accent pl-4 text-sm leading-6 text-slate" key={point}>{point}</li>)}</ul></section> : null}
    <div className="mt-10 grid gap-10">{sections.map((section) => <section className="article-copy" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph, index) => <p key={`${section.heading}-${index}`}>{paragraph}</p>)}</section>)}</div>
    {article.limitations.length ? <section className="mt-12 border-t border-line pt-8"><h2 className="font-serif text-2xl text-navy">Limitations</h2><ul className="mt-4 grid gap-2 text-sm leading-6 text-slate">{article.limitations.map((limitation) => <li key={limitation}>— {limitation}</li>)}</ul></section> : null}
  </article>;
}
