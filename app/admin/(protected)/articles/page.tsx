import Link from "next/link";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { deleteArticleAction, saveArticleAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { RESEARCH_CATEGORIES } from "@/lib/types";

type Params = Promise<{ edit?: string; status?: string; error?: string }>;

export default async function AdminArticlesPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const { data: articles, error } = await client.from("articles").select("*").order("updated_at", { ascending: false }).limit(75);
  const edited = query.edit ? articles?.find((article) => article.id === query.edit) : undefined;
  return <><AdminPageHeader eyebrow="Publishing" title="Research articles" description="Draft, preview, and publish research. Public routes expose published records only; previews remain inside the protected admin area." />
    <AdminNotice error={query.error ?? error?.message} status={query.status} />
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_470px]"><section className="panel min-w-0 p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">Editorial queue</h2><span className="tag">{articles?.length ?? 0} shown</span></div><div className="mt-4 overflow-x-auto"><table className="admin-table"><thead><tr><th>Article</th><th>Status</th><th>Publication</th><th>Action</th></tr></thead><tbody>{articles?.map((article) => <tr key={article.id}><td className="font-semibold text-navy">{article.title}{article.is_sample ? <span className="ml-2 tag">Sample</span> : null}<br /><span className="font-normal text-slate">{article.category}</span></td><td><span className="tag">{article.status}</span>{article.featured ? <span className="ml-2 tag">Featured</span> : null}</td><td>{article.publication_date ?? "Not scheduled"}</td><td><div className="flex gap-3"><Link className="font-semibold text-accent" href={`/admin/articles?edit=${article.id}`}>Edit</Link><Link className="font-semibold text-accent" href={`/admin/articles/${article.id}/preview`}>Preview</Link></div><DeleteForm action={deleteArticleAction} id={article.id} label={article.title} /></td></tr>)}</tbody></table></div>{!articles?.length ? <p className="py-8 text-sm text-slate">No articles found.</p> : null}</section>
      <section className="panel p-5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl text-navy">{edited ? "Edit article" : "New article"}</h2>{edited ? <Link className="text-xs font-semibold text-accent" href="/admin/articles">Cancel</Link> : null}</div><form action={saveArticleAction} className="mt-5 grid gap-4">{edited ? <input name="id" type="hidden" value={edited.id} /> : null}
        <label className="admin-field">Title<input className="admin-input" defaultValue={edited?.title} name="title" required /></label><label className="admin-field">Slug <span className="font-normal text-slate">Leave blank to generate.</span><input className="admin-input" defaultValue={edited?.slug} name="slug" /></label>
        <label className="admin-field">One-sentence thesis<textarea className="admin-input min-h-20" defaultValue={edited?.thesis} name="thesis" required /></label><label className="admin-field">Index summary<textarea className="admin-input min-h-24" defaultValue={edited?.summary} name="summary" required /></label>
        <label className="admin-field">Executive summary <span className="font-normal text-slate">One point per line.</span><textarea className="admin-input min-h-28" defaultValue={edited?.executive_summary.join("\n")} name="executive_summary" /></label>
        <label className="admin-field">Article body <span className="font-normal text-slate">Markdown headings use ##.</span><textarea className="admin-input min-h-80 font-mono text-xs leading-6" defaultValue={edited?.body} name="body" required /></label>
        <label className="admin-field">Limitations <span className="font-normal text-slate">One point per line.</span><textarea className="admin-input min-h-24" defaultValue={edited?.limitations.join("\n")} name="limitations" /></label>
        <label className="admin-field">Category<select className="admin-input" defaultValue={edited?.category ?? RESEARCH_CATEGORIES[0]} name="category">{RESEARCH_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Author<input className="admin-input" defaultValue={edited?.author ?? "Editorial Team"} name="author" required /></label><label className="admin-field">Reading time (min.)<input className="admin-input" defaultValue={edited?.reading_time ?? 1} min="1" name="reading_time" type="number" /></label></div>
        <label className="admin-field">Featured image URL<input className="admin-input" defaultValue={edited?.featured_image ?? ""} name="featured_image" type="url" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="admin-field">Status<select className="admin-input" defaultValue={edited?.status ?? "draft"} name="status"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="admin-field">Publication date<input className="admin-input" defaultValue={edited?.publication_date ?? ""} name="publication_date" type="date" /></label></div>
        <div className="flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.featured ?? false} name="featured" type="checkbox" /> Featured report</label><label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.is_sample ?? false} name="is_sample" type="checkbox" /> Fictional sample</label></div>
        <button className="button-primary" type="submit">{edited ? "Save article" : "Create draft"}</button>
      </form></section></div>
  </>;
}
