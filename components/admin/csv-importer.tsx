"use client";

import { useMemo, useState } from "react";
import { importCsvRowsAction } from "@/app/admin/actions";
import { autoMapCsvHeaders, CSV_TARGET_FIELDS, mapAndValidateCsvRows, parseCsvText, type CsvColumnMapping } from "@/lib/csv-import";

const emptyMapping = () => Object.fromEntries(CSV_TARGET_FIELDS.map(([field]) => [field, -1])) as CsvColumnMapping;

export function CsvImporter({ existingAddressKeys }: { existingAddressKeys: string[] }) {
  const [text, setText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<CsvColumnMapping>(emptyMapping);
  const [message, setMessage] = useState("Paste CSV data or select a local .csv file. Nothing is sent until you confirm the reviewed import.");
  const addressSet = useMemo(() => new Set(existingAddressKeys), [existingAddressKeys]);
  const results = useMemo(() => mapAndValidateCsvRows(rows, mapping).map((result) => {
    if (!result.row) return result;
    const key = `${result.row.street_address}|${result.row.city}|${result.row.state}|${result.row.zip_code}`.toLocaleLowerCase();
    return addressSet.has(key) ? { ...result, row: null, errors: [...result.errors, "Likely duplicate address already exists in the database."] } : result;
  }), [addressSet, mapping, rows]);
  const errorCount = results.reduce((total, result) => total + result.errors.length, 0);
  const warningCount = results.reduce((total, result) => total + result.warnings.length, 0);
  const validRows = results.flatMap((result) => result.row ? [result.row] : []);

  function review(value = text) {
    const parsed = parseCsvText(value);
    if (parsed.length < 2) { setHeaders(parsed[0] ?? []); setRows([]); setMessage("Add a header and at least one data row before reviewing."); return; }
    setHeaders(parsed[0]); setRows(parsed.slice(1)); setMapping(autoMapCsvHeaders(parsed[0]));
    setMessage(`${parsed.length - 1} row${parsed.length === 2 ? "" : "s"} ready for validation. Review the column matches and every warning below.`);
  }

  async function readFile(file?: File) {
    if (!file) return;
    const value = await file.text();
    setText(value); review(value);
  }

  return <div className="grid gap-7"><section className="panel p-5"><h2 className="font-serif text-2xl text-navy">1. Load CSV data</h2><p className="mt-2 text-sm leading-6 text-slate">Maximum 500 rows. Files are parsed in your browser, then validated again on the server and database before an atomic import.</p><div className="mt-5 grid gap-4"><label className="admin-field">Select a CSV file<input accept=".csv,text/csv" className="admin-input py-2" onChange={(event) => void readFile(event.target.files?.[0])} type="file" /></label><label className="admin-field">Or paste CSV<textarea className="admin-input min-h-48 font-mono text-xs leading-5" onChange={(event) => setText(event.target.value)} placeholder="property_name,street_address,city,..." value={text} /></label><button className="button-secondary justify-self-start" onClick={() => review()} type="button">Review pasted data</button><p aria-live="polite" className="text-sm text-slate">{message}</p></div></section>
    {headers.length ? <section className="panel p-5"><h2 className="font-serif text-2xl text-navy">2. Match columns</h2><p className="mt-2 text-sm leading-6 text-slate">Automatic matches use normalized header names. Confirm every required field before importing.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{CSV_TARGET_FIELDS.map(([field, label, required]) => <label className="admin-field" key={field}>{label}{required ? " *" : ""}<select className="admin-input" onChange={(event) => setMapping((current) => ({ ...current, [field]: Number(event.target.value) }))} value={mapping[field]}><option value={-1}>Not mapped</option>{headers.map((header, index) => <option key={`${header}-${index}`} value={index}>{header || `Column ${index + 1}`}</option>)}</select></label>)}</div></section> : null}
    {results.length ? <section className="panel p-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-2xl text-navy">3. Validate and confirm</h2><p className="mt-2 text-sm text-slate">{validRows.length} valid · {errorCount} errors · {warningCount} warnings</p></div><span className={`tag ${errorCount ? "border-red-300 text-red-800" : "border-emerald-300 text-emerald-800"}`}>{errorCount ? "Import blocked" : "Ready for confirmation"}</span></div><div className="mt-5 overflow-x-auto"><table className="admin-table"><thead><tr><th>CSV row</th><th>Property</th><th>Transaction</th><th>Review</th></tr></thead><tbody>{results.slice(0, 50).map((result) => <tr key={result.rowNumber}><td>{result.rowNumber}</td><td>{result.row?.property_name ?? "Invalid row"}<br /><span className="text-xs">{result.row ? `${result.row.city}, ${result.row.state}` : "Correct errors and review again"}</span></td><td>{result.row?.sale_date ?? "—"}<br />{result.row?.sale_price ? `$${Number(result.row.sale_price).toLocaleString()}` : "—"}</td><td>{result.errors.map((error) => <p className="text-xs font-semibold text-red-800" key={error}>Error: {error}</p>)}{result.warnings.map((warning) => <p className="mt-1 text-xs text-amber-800" key={warning}>Warning: {warning}</p>)}</td></tr>)}</tbody></table></div>{results.length > 50 ? <p className="mt-3 text-xs text-slate">Preview limited to 50 rows; all {results.length} rows were validated.</p> : null}
      <form action={importCsvRowsAction} className="mt-6 border-t border-line pt-5"><input name="payload" type="hidden" value={JSON.stringify(validRows)} /><label className="flex items-start gap-3 text-sm leading-6 text-navy"><input className="mt-1" name="confirm_import" required type="checkbox" value="yes" /><span>I reviewed the mapped columns, errors, warnings, and fictional-sample labels. Import these rows in one transaction.</span></label><button className="button-primary mt-5 disabled:cursor-not-allowed disabled:opacity-50" disabled={Boolean(errorCount) || !validRows.length} type="submit">Import {validRows.length} reviewed row{validRows.length === 1 ? "" : "s"}</button></form>
    </section> : null}</div>;
}
