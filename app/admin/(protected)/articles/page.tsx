import Link from "next/link";
import { deleteArticleAction, saveArticleAction } from "@/app/admin/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteForm } from "@/components/admin/delete-form";
import { requireAdmin } from "@/lib/admin-auth";
import { researchExhibitToFormFields } from "@/lib/research-exhibit";
import { RESEARCH_CATEGORIES } from "@/lib/types";

type Params = Promise<{ edit?: string; status?: string; error?: string }>;

export default async function AdminArticlesPage({ searchParams }: { searchParams: Params }) {
  const query = await searchParams;
  const { client } = await requireAdmin();
  const [articlesResult, propertiesResult] = await Promise.all([
    client.from("articles").select("*").order("updated_at", { ascending: false }).limit(75),
    client.from("properties").select("id, property_name, city, state, property_type, is_sample").order("property_name").limit(500),
  ]);
  const articles = articlesResult.data ?? [];
  const properties = propertiesResult.data ?? [];
  const edited = query.edit ? articles.find((article) => article.id === query.edit) : undefined;
  const linksResult = edited
    ? await client.from("article_properties").select("property_id").eq("article_id", edited.id)
    : { data: [], error: null };
  const linkedPropertyIds = new Set((linksResult.data ?? []).map((link) => link.property_id));
  const exhibitFields = researchExhibitToFormFields(edited?.exhibit ?? null);
  const loadError = articlesResult.error?.message ?? propertiesResult.error?.message ?? linksResult.error?.message;

  return <>
    <AdminPageHeader
      eyebrow="Publishing"
      title="Research articles"
      description="Draft, preview, and publish research. Add structured exhibits and connect every property record referenced by a report."
    />
    <AdminNotice error={query.error ?? loadError} status={query.status} />
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_540px]">
      <section className="panel min-w-0 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-navy">Editorial queue</h2>
          <span className="tag">{articles.length} shown</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead><tr><th>Article</th><th>Status</th><th>Publication</th><th>Action</th></tr></thead>
            <tbody>{articles.map((article) => <tr key={article.id}>
              <td className="font-semibold text-navy">
                {article.title}
                {article.is_sample ? <span className="ml-2 tag">Sample</span> : null}
                <br /><span className="font-normal text-slate">{article.category}</span>
              </td>
              <td><span className="tag">{article.status}</span>{article.featured ? <span className="ml-2 tag">Featured</span> : null}</td>
              <td>{article.publication_date ?? "Not scheduled"}</td>
              <td>
                <div className="flex gap-3">
                  <Link className="font-semibold text-accent" href={`/admin/articles?edit=${article.id}`}>Edit</Link>
                  <Link className="font-semibold text-accent" href={`/admin/articles/${article.id}/preview`}>Preview</Link>
                </div>
                <DeleteForm action={deleteArticleAction} id={article.id} label={article.title} />
              </td>
            </tr>)}</tbody>
          </table>
        </div>
        {!articles.length ? <p className="py-8 text-sm text-slate">No articles found.</p> : null}
      </section>

      <section className="panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-navy">{edited ? "Edit article" : "New article"}</h2>
          {edited ? <Link className="text-xs font-semibold text-accent" href="/admin/articles">Cancel</Link> : null}
        </div>
        <form action={saveArticleAction} className="mt-5 grid gap-4" key={edited?.id ?? "new"}>
          {edited ? <input name="id" type="hidden" value={edited.id} /> : null}
          <label className="admin-field">Title<input className="admin-input" defaultValue={edited?.title} name="title" required /></label>
          <label className="admin-field">
            Slug <span className="font-normal text-slate">Leave blank to generate.</span>
            <input className="admin-input" defaultValue={edited?.slug} name="slug" />
          </label>
          <label className="admin-field">One-sentence thesis<textarea className="admin-input min-h-20" defaultValue={edited?.thesis} name="thesis" required /></label>
          <label className="admin-field">Index summary<textarea className="admin-input min-h-24" defaultValue={edited?.summary} name="summary" required /></label>
          <label className="admin-field">
            Executive summary <span className="font-normal text-slate">One point per line.</span>
            <textarea className="admin-input min-h-28" defaultValue={edited?.executive_summary.join("\n")} name="executive_summary" />
          </label>
          <label className="admin-field">
            Article body <span className="font-normal text-slate">Markdown headings use ##.</span>
            <textarea className="admin-input min-h-80 font-mono text-xs leading-6" defaultValue={edited?.body} name="body" required />
          </label>
          <label className="admin-field">
            Limitations <span className="font-normal text-slate">One point per line.</span>
            <textarea className="admin-input min-h-24" defaultValue={edited?.limitations.join("\n")} name="limitations" />
          </label>

          <fieldset className="rounded-sm border border-line bg-mist/30 p-4">
            <legend className="px-2 font-serif text-xl font-semibold text-navy">Research exhibit</legend>
            <p className="mb-4 text-xs leading-5 text-slate" id="exhibit-help">
              Optional. Complete every field to publish an accessible, mobile-scrollable comparison table.
            </p>
            <div className="grid gap-4">
              <label className="admin-field">Exhibit title<input aria-describedby="exhibit-help" className="admin-input" defaultValue={exhibitFields.title} name="exhibit_title" /></label>
              <label className="admin-field">Description<textarea aria-describedby="exhibit-help" className="admin-input min-h-20" defaultValue={exhibitFields.description} name="exhibit_description" /></label>
              <label className="admin-field">
                Column headings <span className="font-normal text-slate">Separate with |</span>
                <input aria-describedby="exhibit-help" className="admin-input font-mono text-xs" defaultValue={exhibitFields.columns} name="exhibit_columns" placeholder="Property | Market | Type | Sale price | Price / sq. ft." />
              </label>
              <label className="admin-field">
                Rows <span className="font-normal text-slate">One row per line; separate cells with |</span>
                <textarea aria-describedby="exhibit-help" className="admin-input min-h-36 font-mono text-xs leading-6" defaultValue={exhibitFields.rows} name="exhibit_rows" placeholder="Property name | City, ST | Office | $25.0M | $175" />
              </label>
              <label className="admin-field">Exhibit note<textarea aria-describedby="exhibit-help" className="admin-input min-h-20" defaultValue={exhibitFields.note} name="exhibit_note" /></label>
            </div>
          </fieldset>

          <fieldset className="rounded-sm border border-line p-4">
            <legend className="px-2 font-serif text-xl font-semibold text-navy">Related properties</legend>
            <p className="mb-4 text-xs leading-5 text-slate" id="related-properties-help">
              Select the property records discussed in this report. They will appear as links on the public article.
            </p>
            {properties.length ? <div aria-describedby="related-properties-help" className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {properties.map((property) => <label className="flex min-h-14 cursor-pointer items-start gap-3 border border-line bg-white p-3 text-sm transition-colors hover:bg-mist/50" key={property.id}>
                <input className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]" defaultChecked={linkedPropertyIds.has(property.id)} name="property_ids" type="checkbox" value={property.id} />
                <span>
                  <span className="block font-semibold leading-5 text-navy">{property.property_name}{property.is_sample ? " (sample)" : ""}</span>
                  <span className="mt-1 block text-xs leading-4 text-slate">{property.city}, {property.state} · {property.property_type}</span>
                </span>
              </label>)}
            </div> : <p className="text-sm text-slate">Add property records before linking them to a report.</p>}
          </fieldset>

          <label className="admin-field">Category
            <select className="admin-input" defaultValue={edited?.category ?? RESEARCH_CATEGORIES[0]} name="category">
              {RESEARCH_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">Author<input className="admin-input" defaultValue={edited?.author ?? "Editorial Team"} name="author" required /></label>
            <label className="admin-field">Reading time (min.)<input className="admin-input" defaultValue={edited?.reading_time ?? 1} min="1" name="reading_time" type="number" /></label>
          </div>
          <label className="admin-field">Featured image URL<input className="admin-input" defaultValue={edited?.featured_image ?? ""} name="featured_image" type="url" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="admin-field">Status
              <select className="admin-input" defaultValue={edited?.status ?? "draft"} name="status">
                <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
            </label>
            <label className="admin-field">Publication date<input className="admin-input" defaultValue={edited?.publication_date ?? ""} name="publication_date" type="date" /></label>
          </div>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.featured ?? false} name="featured" type="checkbox" /> Featured report</label>
            <label className="flex items-center gap-2 text-sm text-navy"><input defaultChecked={edited?.is_sample ?? false} name="is_sample" type="checkbox" /> Fictional sample</label>
          </div>
          <button className="button-primary" type="submit">{edited ? "Save article" : "Create draft"}</button>
        </form>
      </section>
    </div>
  </>;
}
