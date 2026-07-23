import { sampleProperties } from "./sample-data";
import type { ResearchArticle, ResearchArticleSummary, ResearchCategory, ResearchExhibit, SourceRecord } from "./types";

type SampleResearchInput = Omit<ResearchArticle, "sources" | "relatedProperties" | "relatedArticles"> & {
  relatedPropertySlugs: string[];
  relatedArticleSlugs: string[];
};

const createdAt = "2026-02-01T12:00:00.000Z";

const exhibit = (title: string, description: string, columns: string[], rows: string[][], note: string): ResearchExhibit => ({ title, description, columns, rows, note });

const inputs: SampleResearchInput[] = [
  {
    id: "40000000-0000-4000-8000-000000000001", slug: "reading-local-industrial-demand", title: "Reading Local Industrial Demand Beyond the Headline Number",
    thesis: "A durable industrial-demand view separates leasing activity from tenant quality, physical fit, and the depth of competing supply.",
    summary: "A sample research note on interpreting absorption, vacancy, tenant demand, and transaction evidence across local industrial submarkets.",
    category: "Property Sector Analysis", publicationDate: "2026-01-12", status: "published", featured: true, readingTime: 7, author: "Student Research Desk", isSample: true,
    executiveSummary: ["Net absorption is an outcome, not a complete explanation of demand.", "Building specifications and tenant requirements can create several markets inside one geography.", "A repeatable review should connect leasing evidence with new supply, rollover risk, and transaction liquidity."],
    body: "## Start with the question behind the metric\n\nVacancy and absorption are useful only after the analyst defines the property set, time period, and tenant segment being studied. A broad regional average can conceal a shortage of modern logistics space alongside weaker demand for older flex buildings.\n\n## Separate activity from durability\n\nA signed lease shows activity. Durable demand requires a second layer of questions: Is the tenant expanding or relocating? Does the building solve a specific operational need? How much comparable space remains available? These questions turn a headline statistic into an investment-relevant explanation.\n\n## Connect leasing and capital markets\n\nTransaction evidence should be used as a cross-check rather than a substitute for operating data. A thin sales market may say more about financing conditions than tenant demand. The research record should preserve that distinction.",
    limitations: ["This sample report contains no real leasing or transaction observations.", "Industrial definitions vary by source and submarket.", "Private lease terms and concessions are often unavailable."],
    exhibit: exhibit("Illustrative demand scorecard", "A hypothetical framework for organizing evidence; values are not market observations.", ["Signal", "Hypothetical reading", "Research implication"], [["Modern-space vacancy", "Low", "Check the active construction pipeline"], ["Older flex vacancy", "Elevated", "Segment results by building quality"], ["Leasing velocity", "Stable", "Compare renewals with expansions"]], "Hypothetical example only. No row represents an actual market statistic."),
    relatedPropertySlugs: ["potomac-trade-center-sample", "i95-distribution-annex-sample"], relatedArticleSlugs: ["comparing-price-per-square-foot", "building-a-repeatable-quarterly-market-brief"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000002", slug: "what-public-records-can-tell-us", title: "What Public Records Can—and Cannot—Tell Us About a Sale",
    thesis: "Reliable transaction research depends as much on documenting uncertainty as finding a recorded price.",
    summary: "A sample methodology explainer covering deeds, reporting lags, entity names, source conflicts, and corroboration.",
    category: "Educational Explainers", publicationDate: "2025-12-08", status: "published", featured: true, readingTime: 6, author: "Student Research Desk", isSample: true,
    executiveSummary: ["A deed can establish that a transfer occurred without explaining the complete economics.", "Entity names should be resolved cautiously and never treated as proof of ultimate ownership by themselves.", "Material fields should retain source dates and visible verification status."],
    body: "## What the record establishes\n\nPublic records can provide a parcel reference, legal parties, filing date, and stated consideration. Each field should be transcribed with its source and access date because later corrections or related filings may change the interpretation.\n\n## What may remain outside the record\n\nPortfolio allocations, assumed debt, partnership interests, concessions, and post-closing adjustments may not appear in a single filing. A reported sale price can therefore require corroboration before it is used in a comparison.\n\n## A defensible workflow\n\nBegin with the original filing, compare credible secondary accounts, and document conflicts. When only one source is available, say so. When a material field is missing, leave it unavailable.",
    limitations: ["Recording practices differ across jurisdictions.", "A public filing may lag the economic closing date.", "This article is educational and does not provide legal guidance."],
    exhibit: exhibit("Source reconciliation worksheet", "A hypothetical audit trail showing how conflicts remain visible.", ["Field", "Source A", "Source B", "Published value"], [["Transfer date", "Date 1", "Date 1", "Date 1"], ["Consideration", "$X", "$X", "$X"], ["Buyer identity", "Entity name", "Parent reported", "Entity; parent unverified"]], "Hypothetical labels only. No parties, dates, or prices refer to an actual filing."),
    relatedPropertySlugs: ["harbor-point-offices-sample"], relatedArticleSlugs: ["building-a-repeatable-quarterly-market-brief", "comparing-price-per-square-foot"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000003", slug: "comparing-price-per-square-foot", title: "Comparing Price per Square Foot Across Property Types",
    thesis: "Price per square foot becomes misleading when physical, income, and transaction contexts are ignored.",
    summary: "A sample deal-analysis framework for making more disciplined cross-sector and cross-market pricing comparisons.",
    category: "Deal Breakdowns", publicationDate: "2025-11-17", status: "published", featured: true, readingTime: 8, author: "Student Research Desk", isSample: true,
    executiveSummary: ["The denominator must be defined consistently before two prices can be compared.", "Property age, land contribution, occupancy, and capital needs can overwhelm the apparent pricing signal.", "Price per square foot is a starting point for questions, not a stand-alone valuation conclusion."],
    body: "## Confirm the denominator\n\nPublished square footage may refer to gross building area, rentable area, or another measurement. An analyst should not divide first and investigate later. Record the measurement definition and use unavailable when it cannot be reconciled.\n\n## Normalize the context\n\nTwo equal prices per square foot can imply very different economics when one asset is stabilized and another requires lease-up or renovation. Land, parking, tenancy, and assumed obligations also affect comparability.\n\n## Use a comparison range\n\nA useful comp set explains why records are included and shows the spread rather than presenting one average as definitive. Outliers remain visible with notes instead of being silently removed.",
    limitations: ["The hypothetical exhibit omits taxes, debt, and transaction costs.", "Building-area definitions may not be comparable.", "No sample value should be used for valuation or investment decisions."],
    exhibit: exhibit("Hypothetical comparison grid", "Three fictional examples demonstrate why context accompanies the metric.", ["Example", "Price / sq. ft.", "Occupancy context", "Capital context"], [["Sample A", "$150", "Stabilized", "Limited near-term work"], ["Sample B", "$150", "Lease-up", "Tenant improvements required"], ["Sample C", "$190", "Stabilized", "Recent renovation"]], "All figures are invented for educational illustration."),
    relatedPropertySlugs: ["harbor-point-offices-sample", "old-town-medical-pavilion-sample"], relatedArticleSlugs: ["what-public-records-can-tell-us", "financing-sensitivity-without-false-precision"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000004", slug: "financing-sensitivity-without-false-precision", title: "Financing Sensitivity Without False Precision",
    thesis: "A transparent financing scenario should show its assumptions and ranges instead of implying a forecast is certain.",
    summary: "A sample framework for testing how hypothetical debt costs and coverage requirements affect transaction capacity.",
    category: "Interest Rates and Financing", publicationDate: "2025-10-06", status: "published", featured: false, readingTime: 7, author: "Student Research Desk", isSample: true,
    executiveSummary: ["Sensitivity analysis is more useful than a single financing forecast.", "Coverage, amortization, leverage, and fees should move together in a coherent scenario.", "The output describes model behavior, not a prediction of lender terms."],
    body: "## Define the decision variable\n\nA financing model should begin with the question it needs to answer: proceeds, debt service, coverage, or equity requirement. Changing every input at once makes the result difficult to interpret.\n\n## Build a small scenario set\n\nA base, lower-cost, and higher-cost case can reveal which assumptions matter most. Each input needs a source or an explicit hypothetical label, and outputs should be rounded to avoid false precision.\n\n## Keep financing separate from value\n\nDebt capacity can influence what a buyer can pay, but it does not by itself establish property value. Operating evidence and financing evidence should remain distinct in the research narrative.",
    limitations: ["Financing structures vary substantially by lender and borrower.", "The example excludes fees, reserves, and hedging costs.", "No scenario represents a current loan quote."],
    exhibit: exhibit("Illustrative debt-cost sensitivity", "A hypothetical directional example with no current rate claim.", ["Scenario", "Debt-cost assumption", "Direction of proceeds"], [["Lower-cost case", "Base less 0.50%", "Higher"], ["Base case", "Hypothetical base", "Reference"], ["Higher-cost case", "Base plus 0.50%", "Lower"]], "This is a conceptual model, not lending or investment advice."),
    relatedPropertySlugs: ["north-capitol-flats-sample", "navy-yard-hotel-sample"], relatedArticleSlugs: ["comparing-price-per-square-foot", "scenario-mapping-local-development"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000005", slug: "scenario-mapping-local-development", title: "A Scenario Map for Local Development Research",
    thesis: "Development research improves when entitlement, construction, leasing, and financing risks are tracked as separate evidence streams.",
    summary: "A sample workflow for describing a hypothetical project without turning uncertain milestones into promised outcomes.",
    category: "Local Development", publicationDate: "2025-09-15", status: "published", featured: false, readingTime: 6, author: "Student Research Desk", isSample: true,
    executiveSummary: ["An announced project is not the same as a financed or delivered project.", "Milestones should carry dates, sources, and confidence labels.", "Scenario maps make dependencies visible without inventing a completion forecast."],
    body: "## Track status, not promotion\n\nDevelopment announcements often describe an intended program. Research should distinguish proposals, approvals, financing, construction, and delivery using the latest attributable evidence.\n\n## Identify the dependencies\n\nA project may depend on permits, infrastructure, preleasing, or capital. Mapping those dependencies explains what could change without assigning unsupported probabilities.\n\n## Revisit the record\n\nA dated status log is more credible than a continuously rewritten narrative. When plans change, the previous state remains part of the documented history.",
    limitations: ["Development milestones can change after publication.", "Private budgets and financing commitments may be unavailable.", "The hypothetical timeline is not associated with a real site."],
    exhibit: exhibit("Hypothetical milestone register", "A sample structure for tracking project evidence.", ["Milestone", "Evidence state", "Research treatment"], [["Concept announced", "Observed", "Record source and date"], ["Entitlement", "Pending", "Do not assume approval"], ["Construction start", "Unconfirmed", "Leave forecast unavailable"]], "Every status is fictional and demonstrates methodology only."),
    relatedPropertySlugs: ["bethesda-mixed-use-court-sample"], relatedArticleSlugs: ["financing-sensitivity-without-false-precision", "building-a-repeatable-quarterly-market-brief"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000006", slug: "tenant-concentration-worksheet", title: "A Tenant-Concentration Worksheet for Retail Research",
    thesis: "Tenant lists become more useful when lease exposure, use category, and replacement difficulty are analyzed together.",
    summary: "A sample retail research worksheet that avoids treating every occupied square foot as equivalent demand.",
    category: "Retail and Tenant Analysis", publicationDate: "2025-08-11", status: "published", featured: false, readingTime: 6, author: "Student Research Desk", isSample: true,
    executiveSummary: ["Tenant concentration is both a credit question and a merchandising question.", "Lease expiration and replacement cost can matter more than tenant count.", "Public tenant lists rarely provide the complete lease data needed for a definitive conclusion."],
    body: "## Look beyond occupancy\n\nA center can be highly occupied while relying on one tenant for traffic, rent, or both. Research should identify what the available tenant list does not reveal before assigning a concentration conclusion.\n\n## Group the exposures\n\nTenant use, unit size, lease timing, and co-tenancy relationships create different forms of exposure. A worksheet makes those categories visible even when the underlying leases remain private.\n\n## Document replacement assumptions\n\nAn analyst should not assume a vacated unit can be released at the same rent or without capital. Replacement difficulty is a scenario input, not an observed fact.",
    limitations: ["Public sources rarely disclose complete lease economics.", "Tenant credit quality can change after publication.", "The exhibit contains invented tenant labels only."],
    exhibit: exhibit("Illustrative tenant worksheet", "Fictional tenant labels show a non-financial concentration screen.", ["Tenant", "Use", "Relative unit size", "Replacement note"], [["Sample Market", "Grocery", "Large", "Specialized layout"], ["Example Coffee", "Food and beverage", "Small", "Broader user pool"], ["Demo Services", "Service", "Medium", "Build-out dependent"]], "Fictional labels only. No named tenant is a real occupant or company claim."),
    relatedPropertySlugs: ["wilson-boulevard-shops-sample", "bethesda-mixed-use-court-sample"], relatedArticleSlugs: ["reading-local-industrial-demand", "building-a-repeatable-quarterly-market-brief"], createdAt, updatedAt: createdAt,
  },
  {
    id: "40000000-0000-4000-8000-000000000007", slug: "building-a-repeatable-quarterly-market-brief", title: "Building a Repeatable Quarterly Market Brief",
    thesis: "A useful market report keeps definitions stable, exposes sample sizes, and separates observed change from interpretation.",
    summary: "A sample reporting template for producing consistent local market research as the underlying database grows.",
    category: "Market Reports", publicationDate: "2025-07-07", status: "published", featured: false, readingTime: 7, author: "Student Research Desk", isSample: true,
    executiveSummary: ["Stable definitions make quarter-to-quarter comparisons auditable.", "Every chart should display its record count and missing-data treatment.", "Commentary should explain evidence without extending beyond the sample."],
    body: "## Freeze the definitions first\n\nA quarterly brief needs a written rule for geography, property type, transaction date, and inclusion thresholds. Changing a definition should trigger a visible note and, when practical, a restated history.\n\n## Show the denominator\n\nTotals, medians, and distributions become easier to evaluate when the reader can see the sample size and missing-field count. Small samples should be described rather than disguised with precise-looking charts.\n\n## Separate observation and interpretation\n\nThe report should first state what changed in the recorded sample, then offer possible explanations with supporting evidence. Alternative explanations and limitations belong in the same publication.",
    limitations: ["A selective database cannot represent the full market.", "Reporting lags can shift results between periods.", "The exhibit is a process checklist, not a current market report."],
    exhibit: exhibit("Quarterly publication checklist", "A reusable quality-control sequence for each reporting cycle.", ["Step", "Required disclosure", "Completion test"], [["Define", "Geography and inclusion rules", "Comparable to prior period"], ["Measure", "Sample and missing counts", "Shown beside every exhibit"], ["Interpret", "Evidence and alternatives", "Limits stated explicitly"]], "Process illustration only; no market performance is asserted."),
    relatedPropertySlugs: ["harbor-point-offices-sample", "potomac-trade-center-sample"], relatedArticleSlugs: ["what-public-records-can-tell-us", "scenario-mapping-local-development"], createdAt, updatedAt: createdAt,
  },
];

const sourceFor = (article: SampleResearchInput): SourceRecord => ({
  id: `50000000-0000-4000-8000-${article.id.slice(-12)}`,
  sourceName: "Fictional Editorial Demonstration",
  sourceUrl: "https://example.com/fictional-research-source",
  publicationDate: article.publicationDate,
  accessedDate: "2026-02-01",
  sourceType: "Sample source",
  notes: "Placeholder citation used only to demonstrate the article source interface.",
  isSample: true,
});

const toSummary = (article: ResearchArticleSummary): ResearchArticleSummary => ({
  id: article.id, slug: article.slug, title: article.title, thesis: article.thesis, summary: article.summary, category: article.category,
  publicationDate: article.publicationDate, status: "published", featured: article.featured, readingTime: article.readingTime,
  author: article.author, isSample: article.isSample,
});

export const sampleResearchArticles: ResearchArticle[] = inputs.map((article) => ({
  ...article,
  sources: [sourceFor(article)],
  relatedProperties: sampleProperties.filter((property) => article.relatedPropertySlugs.includes(property.slug)).map((property) => ({
    id: property.id, slug: property.slug, propertyName: property.propertyName, city: property.city, state: property.state,
    propertyType: property.propertyType, isSample: property.isSample,
  })),
  relatedArticles: inputs.filter((candidate) => article.relatedArticleSlugs.includes(candidate.slug)).map(toSummary),
}));

export const sampleResearchSummaries = sampleResearchArticles.map(toSummary);

export function isResearchCategory(value: string): value is ResearchCategory {
  const categories: readonly string[] = ["Market Reports", "Deal Breakdowns", "Property Sector Analysis", "Interest Rates and Financing", "Local Development", "Retail and Tenant Analysis", "Educational Explainers"];
  return categories.includes(value);
}

export function getCategoryCount(category: ResearchCategory) {
  return sampleResearchSummaries.filter((article) => article.category === category).length;
}
