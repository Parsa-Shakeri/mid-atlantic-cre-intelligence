import type { PropertyListItem, PropertyRecord, SampleArticle, SummaryMetrics } from "./types";

const createdAt = "2026-01-15T12:00:00.000Z";

const propertyBase: Omit<PropertyRecord, "transactions" | "sources">[] = [
  { id: "10000000-0000-4000-8000-000000000001", slug: "harbor-point-offices-sample", propertyName: "Harbor Point Offices — Fictional Sample", streetAddress: "100 Sample Harbor Way", city: "Baltimore", state: "MD", zipCode: "21201", county: "Baltimore City", latitude: null, longitude: null, propertyType: "Office", buildingSqFt: 121000, lotAcres: 2.1, yearBuilt: 1998, yearRenovated: 2019, numberOfFloors: 8, parkingSpaces: 240, majorTenants: ["Sample Legal Group", "Placeholder Advisory LLC"], description: "Fictional office property created solely to demonstrate the research database. It does not represent a real building or transaction.", leaseStructure: "Sample multi-tenant leases", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000002", slug: "potomac-trade-center-sample", propertyName: "Potomac Trade Center — Fictional Sample", streetAddress: "200 Placeholder Commerce Drive", city: "Landover", state: "MD", zipCode: "20785", county: "Prince George's County", latitude: null, longitude: null, propertyType: "Industrial", buildingSqFt: 245000, lotAcres: 14.8, yearBuilt: 2006, yearRenovated: null, numberOfFloors: 1, parkingSpaces: 156, majorTenants: ["Example Logistics Co."], description: "Fictional industrial record for interface testing only. No real transaction or tenant is represented.", leaseStructure: "Sample triple-net lease", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000003", slug: "wilson-boulevard-shops-sample", propertyName: "Wilson Boulevard Shops — Fictional Sample", streetAddress: "300 Demonstration Boulevard", city: "Arlington", state: "VA", zipCode: "22201", county: "Arlington County", latitude: null, longitude: null, propertyType: "Retail", buildingSqFt: 38750, lotAcres: 1.4, yearBuilt: 1987, yearRenovated: 2016, numberOfFloors: 2, parkingSpaces: 82, majorTenants: ["Sample Market", "Example Coffee"], description: "Fictional neighborhood retail center used only as labeled placeholder content.", leaseStructure: "Sample multi-tenant net leases", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000004", slug: "north-capitol-flats-sample", propertyName: "North Capitol Flats — Fictional Sample", streetAddress: "400 Research Place NW", city: "Washington", state: "DC", zipCode: "20001", county: "District of Columbia", latitude: null, longitude: null, propertyType: "Multifamily", buildingSqFt: 164000, lotAcres: 1.2, yearBuilt: 2012, yearRenovated: null, numberOfFloors: 10, parkingSpaces: 96, majorTenants: [], description: "Fictional multifamily property. Unit and transaction details are placeholders and not claims about a real asset.", leaseStructure: "Sample residential leases", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000005", slug: "i95-distribution-annex-sample", propertyName: "I-95 Distribution Annex — Fictional Sample", streetAddress: "500 Example Distribution Lane", city: "Jessup", state: "MD", zipCode: "20794", county: "Howard County", latitude: null, longitude: null, propertyType: "Industrial", buildingSqFt: 178500, lotAcres: 10.5, yearBuilt: 2001, yearRenovated: 2021, numberOfFloors: 1, parkingSpaces: 118, majorTenants: ["Placeholder Supply Inc."], description: "Fictional warehouse record included only for testing calculations, search, and filtering.", leaseStructure: "Sample single-tenant net lease", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000006", slug: "old-town-medical-pavilion-sample", propertyName: "Old Town Medical Pavilion — Fictional Sample", streetAddress: "600 Prototype Health Street", city: "Alexandria", state: "VA", zipCode: "22314", county: "City of Alexandria", latitude: null, longitude: null, propertyType: "Medical Office", buildingSqFt: 62400, lotAcres: 2.3, yearBuilt: 1994, yearRenovated: 2018, numberOfFloors: 4, parkingSpaces: 190, majorTenants: ["Example Health Partners"], description: "Fictional medical office example. All names, values, and transaction details are placeholders.", leaseStructure: "Sample modified-gross leases", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000007", slug: "bethesda-mixed-use-court-sample", propertyName: "Bethesda Mixed-Use Court — Fictional Sample", streetAddress: "700 Sample Wisconsin Court", city: "Bethesda", state: "MD", zipCode: "20814", county: "Montgomery County", latitude: null, longitude: null, propertyType: "Mixed-Use", buildingSqFt: 210000, lotAcres: 1.8, yearBuilt: 2009, yearRenovated: null, numberOfFloors: 12, parkingSpaces: 280, majorTenants: ["Demo Grocer", "Placeholder Fitness"], description: "Fictional mixed-use property for development and quality-assurance purposes only.", leaseStructure: "Sample residential and retail leases", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000008", slug: "frederick-storage-park-sample", propertyName: "Frederick Storage Park — Fictional Sample", streetAddress: "800 Testing Pike", city: "Frederick", state: "MD", zipCode: "21701", county: "Frederick County", latitude: null, longitude: null, propertyType: "Self-Storage", buildingSqFt: 84500, lotAcres: 4.6, yearBuilt: 2003, yearRenovated: 2020, numberOfFloors: 3, parkingSpaces: 22, majorTenants: [], description: "Fictional self-storage property; this record is not a real-world transaction claim.", leaseStructure: "Sample month-to-month agreements", createdAt, updatedAt: createdAt, isSample: true },
  { id: "10000000-0000-4000-8000-000000000009", slug: "navy-yard-hotel-sample", propertyName: "Navy Yard Hotel — Fictional Sample", streetAddress: "900 Illustration Avenue SE", city: "Washington", state: "DC", zipCode: "20003", county: "District of Columbia", latitude: null, longitude: null, propertyType: "Hotel", buildingSqFt: 132000, lotAcres: 0.9, yearBuilt: 2015, yearRenovated: null, numberOfFloors: 11, parkingSpaces: 54, majorTenants: ["Example Hospitality Brand"], description: "Fictional hotel property. The displayed brand, address, and economics are placeholders.", leaseStructure: "Sample hotel management agreement", createdAt, updatedAt: createdAt, isSample: true },
];

const transactionInputs = [
  ["20000000-0000-4000-8000-000000000001", 0, "2025-11-14", 18400000, "Sample Harbor Buyer LLC", "Example Office Seller LP", 0.061, 1122400, "Asset Sale", "Estimated", "2025-11-21"],
  ["20000000-0000-4000-8000-000000000002", 1, "2025-10-02", 32750000, "Placeholder Industrial Fund", "Sample Logistics Owner LLC", null, null, "Asset Sale", "Incomplete", null],
  ["20000000-0000-4000-8000-000000000003", 2, "2025-08-21", 12100000, "Example Retail Partners", "Placeholder Shops LLC", 0.058, 701800, "Asset Sale", "Estimated", "2025-08-29"],
  ["20000000-0000-4000-8000-000000000004", 3, "2025-06-30", 41600000, "Sample Residential Fund", "Example Multifamily LP", null, null, "Entity Sale", "Incomplete", null],
  ["20000000-0000-4000-8000-000000000005", 4, "2025-04-18", 22900000, "Demo Distribution REIT", "Sample Warehouse Owner", 0.055, 1259500, "Asset Sale", "Estimated", "2025-04-25"],
  ["20000000-0000-4000-8000-000000000006", 5, "2024-12-10", 15600000, "Placeholder Medical Investors", "Example Health Properties", null, null, "Asset Sale", "Incomplete", null],
  ["20000000-0000-4000-8000-000000000007", 6, "2024-09-05", 58500000, "Sample Mixed-Use Capital", "Demo Urban Owner LP", 0.052, 3042000, "Asset Sale", "Estimated", "2024-09-13"],
  ["20000000-0000-4000-8000-000000000008", 7, "2024-05-22", 9800000, "Example Storage Holdings", "Placeholder Storage LLC", null, null, "Asset Sale", "Incomplete", null],
  ["20000000-0000-4000-8000-000000000009", 8, "2024-02-16", 44300000, "Sample Hospitality Group", "Example Hotel Capital", null, null, "Asset Sale", "Incomplete", null],
  ["20000000-0000-4000-8000-000000000010", 0, "2018-03-09", 14300000, "Example Office Seller LP", "Sample Prior Owner", null, null, "Asset Sale", "Incomplete", null],
] as const;

export const sampleProperties: PropertyRecord[] = propertyBase.map((property, propertyIndex) => ({
  ...property,
  transactions: transactionInputs.filter((input) => input[1] === propertyIndex).map((input) => ({
    id: input[0], propertyId: property.id, saleDate: input[2], salePrice: input[3], buyer: input[4], seller: input[5],
    reportedCapRate: input[6], reportedNoi: input[7], pricePerSqFt: property.buildingSqFt ? Math.round((input[3] / property.buildingSqFt) * 100) / 100 : null,
    transactionType: input[8], notes: "Fictional sample transaction for development only.", verificationStatus: input[9], dateVerified: input[10], createdAt, isSample: true,
  })),
  sources: [{ id: `30000000-0000-4000-8000-00000000000${propertyIndex + 1}`, sourceName: "Fictional Development Source", sourceUrl: "https://example.com/fictional-sample", publicationDate: null, accessedDate: "2026-01-15", sourceType: "Sample record", notes: "Placeholder citation. Not evidence of a real transaction.", isSample: true }],
}));

export const samplePropertyList: PropertyListItem[] = sampleProperties.flatMap((property) => property.transactions.map((transaction) => ({
  propertyId: property.id, transactionId: transaction.id, slug: property.slug, propertyName: property.propertyName,
  streetAddress: property.streetAddress, city: property.city, state: property.state, zipCode: property.zipCode, county: property.county,
  propertyType: property.propertyType, buildingSqFt: property.buildingSqFt, majorTenants: property.majorTenants,
  saleDate: transaction.saleDate, salePrice: transaction.salePrice, buyer: transaction.buyer, seller: transaction.seller,
  reportedCapRate: transaction.reportedCapRate, reportedNoi: transaction.reportedNoi, pricePerSqFt: transaction.pricePerSqFt,
  transactionType: transaction.transactionType, verificationStatus: transaction.verificationStatus, dateVerified: transaction.dateVerified,
  dateAdded: transaction.createdAt, isSample: true,
})));

export const sampleArticles: SampleArticle[] = [
  { slug: "reading-local-industrial-demand", title: "Reading Local Industrial Demand Beyond the Headline Number", thesis: "A practical framework for separating durable demand signals from short-term leasing noise.", summary: "A sample research note on interpreting absorption, vacancy, and transaction evidence across submarkets.", category: "Property Sector Analysis", publishedAt: "2026-01-12", readingTime: 7, isSample: true },
  { slug: "what-public-records-can-tell-us", title: "What Public Records Can—and Cannot—Tell Us About a Sale", thesis: "Reliable transaction research depends as much on documenting uncertainty as finding a price.", summary: "A sample methodology explainer covering deeds, reporting lags, entity names, and corroboration.", category: "Educational Explainers", publishedAt: "2025-12-08", readingTime: 6, isSample: true },
  { slug: "comparing-price-per-square-foot", title: "Comparing Price per Square Foot Across Property Types", thesis: "A familiar metric becomes misleading when physical and operating contexts are ignored.", summary: "A sample analysis of the adjustments needed before making cross-sector pricing comparisons.", category: "Deal Breakdowns", publishedAt: "2025-11-17", readingTime: 8, isSample: true },
];

export const sampleSummary: SummaryMetrics = {
  properties: sampleProperties.length,
  transactions: samplePropertyList.length,
  totalValue: samplePropertyList.reduce((sum, item) => sum + item.salePrice, 0),
  markets: new Set(sampleProperties.map((property) => `${property.city}, ${property.state}`)).size,
  reports: 7,
  source: "sample",
};

export const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const formatCompactCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(value);
export const formatNumber = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
export const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
