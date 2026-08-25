export const PROPERTY_TYPES = [
  "Office", "Retail", "Industrial", "Multifamily", "Hotel", "Medical Office",
  "Self-Storage", "Mixed-Use", "Land", "Special Purpose",
] as const;

export const VERIFICATION_STATUSES = ["Verified", "Single Source", "Estimated", "Incomplete"] as const;
export const US_STATES = ["DC", "MD", "VA"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];
export type CoveredState = (typeof US_STATES)[number];
export type ValueKind = "Reported" | "Calculated" | "Estimated" | "Unavailable";

export interface TransactionRecord {
  id: string;
  propertyId: string;
  saleDate: string;
  salePrice: number;
  buyer: string | null;
  seller: string | null;
  reportedCapRate: number | null;
  reportedNoi: number | null;
  pricePerSqFt: number | null;
  transactionType: string;
  notes: string | null;
  verificationStatus: VerificationStatus;
  dateVerified: string | null;
  createdAt: string;
  isSample: boolean;
}

export interface SourceRecord {
  id: string;
  sourceName: string;
  sourceUrl: string;
  publicationDate: string | null;
  accessedDate: string;
  sourceType: string;
  notes: string | null;
  isSample: boolean;
}

export interface PropertyRecord {
  id: string;
  slug: string;
  propertyName: string;
  streetAddress: string;
  city: string;
  state: CoveredState;
  zipCode: string;
  county: string;
  latitude: number | null;
  longitude: number | null;
  propertyType: PropertyType;
  buildingSqFt: number | null;
  lotAcres: number | null;
  yearBuilt: number | null;
  yearRenovated: number | null;
  numberOfFloors: number | null;
  parkingSpaces: number | null;
  majorTenants: string[];
  description: string;
  leaseStructure: string | null;
  createdAt: string;
  updatedAt: string;
  isSample: boolean;
  transactions: TransactionRecord[];
  sources: SourceRecord[];
}

export interface PropertyListItem {
  propertyId: string;
  transactionId: string;
  slug: string;
  propertyName: string;
  streetAddress: string;
  city: string;
  state: CoveredState;
  zipCode: string;
  county: string;
  propertyType: PropertyType;
  buildingSqFt: number | null;
  majorTenants: string[];
  saleDate: string;
  salePrice: number;
  buyer: string | null;
  seller: string | null;
  reportedCapRate: number | null;
  reportedNoi: number | null;
  pricePerSqFt: number | null;
  transactionType: string;
  verificationStatus: VerificationStatus;
  dateVerified: string | null;
  dateAdded: string;
  isSample: boolean;
}

export type PropertySort = "sale_date" | "sale_price" | "building_sq_ft" | "price_per_sq_ft" | "reported_cap_rate" | "date_added";
export type SortDirection = "asc" | "desc";

export interface PropertyQuery {
  search: string;
  state: CoveredState | "";
  county: string;
  city: string;
  propertyType: PropertyType | "";
  saleYear: string;
  priceMin: number | null;
  priceMax: number | null;
  sizeMin: number | null;
  sizeMax: number | null;
  capRateMin: number | null;
  capRateMax: number | null;
  verificationStatus: VerificationStatus | "";
  sort: PropertySort;
  direction: SortDirection;
  page: number;
  pageSize: number;
}

export interface PropertyFilterOptions {
  counties: string[];
  cities: string[];
  saleYears: string[];
}

export type PublicDataSource = "supabase" | "sample" | "unavailable";

export interface PaginatedProperties {
  records: PropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
  source: PublicDataSource;
}

export interface SummaryMetrics {
  properties: number;
  transactions: number;
  totalValue: number;
  markets: number;
  reports: number;
  source: PublicDataSource;
}

export interface CoverageBreakdown {
  label: string;
  propertyCount: number;
  transactionCount: number;
  transactionShare: number;
}

export interface CoverageField {
  key: "building-area" | "price-per-square-foot" | "reported-cap-rate" | "reported-noi" | "buyer" | "seller" | "verification-date";
  label: string;
  scope: "properties" | "transactions";
  availableCount: number;
  missingCount: number;
  totalCount: number;
  availabilityRate: number;
  missingRate: number;
}

export interface CoverageVerificationStatus {
  status: VerificationStatus;
  count: number;
  share: number;
}

export interface CoverageData {
  source: "supabase" | "unavailable";
  propertyCount: number;
  transactionCount: number;
  sourceCount: number;
  earliestSaleDate: string | null;
  latestSaleDate: string | null;
  latestUpdatedAt: string | null;
  sourceLinkedTransactionCount: number;
  multiSourceTransactionCount: number;
  unsourcedTransactionCount: number;
  byState: CoverageBreakdown[];
  byPropertyType: CoverageBreakdown[];
  fields: CoverageField[];
  verificationStatuses: CoverageVerificationStatus[];
  truncated: boolean;
  queryLimit: number;
}

export interface SampleArticle {
  slug: string;
  title: string;
  thesis: string;
  summary: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  isSample: true;
}

export const RESEARCH_CATEGORIES = [
  "Market Reports",
  "Deal Breakdowns",
  "Property Sector Analysis",
  "Interest Rates and Financing",
  "Local Development",
  "Retail and Tenant Analysis",
  "Educational Explainers",
] as const;

export type ResearchCategory = (typeof RESEARCH_CATEGORIES)[number];

export interface ResearchExhibit {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  note: string;
}

export interface RelatedPropertySummary {
  id: string;
  slug: string;
  propertyName: string;
  city: string;
  state: CoveredState;
  propertyType: PropertyType;
  isSample: boolean;
}

export interface ResearchArticleSummary {
  id: string;
  slug: string;
  title: string;
  thesis: string;
  summary: string;
  category: ResearchCategory;
  publicationDate: string;
  status: "published";
  featured: boolean;
  readingTime: number;
  author: string;
  isSample: boolean;
}

export interface ResearchArticle extends ResearchArticleSummary {
  executiveSummary: string[];
  body: string;
  limitations: string[];
  exhibit: ResearchExhibit | null;
  sources: SourceRecord[];
  relatedProperties: RelatedPropertySummary[];
  relatedArticles: ResearchArticleSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface MarkdownSection {
  heading: string;
  paragraphs: string[];
}

export const CAP_RATE_MINIMUM_SAMPLE = 3;

export interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
  state: CoveredState | "";
  county: string;
  city: string;
  propertyType: PropertyType | "";
}

export interface DashboardFilterOptions {
  states: string[];
  counties: string[];
  cities: string[];
  propertyTypes: string[];
}

export interface DashboardMetrics {
  transactionCount: number;
  totalSalesVolume: number;
  medianSalePrice: number | null;
  medianPricePerSqFt: number | null;
  medianReportedCapRate: number | null;
  averageBuildingSize: number | null;
  pricePerSqFtSampleSize: number;
  capRateSampleSize: number;
  buildingSizeSampleSize: number;
}

export interface DashboardTimePoint {
  period: string;
  label: string;
  transactionCount: number;
  salesVolume: number;
}

export interface DashboardPropertyTypeVolume {
  propertyType: string;
  salesVolume: number;
  transactionCount: number;
}

export interface DashboardMarketPrice {
  market: string;
  medianPricePerSqFt: number;
  sampleSize: number;
}

export interface DashboardCapRateBin {
  label: string;
  count: number;
}

export interface DashboardLargestTransaction {
  slug: string;
  propertyName: string;
  market: string;
  propertyType: string;
  saleDate: string;
  salePrice: number;
  verificationStatus: VerificationStatus;
  isSample: boolean;
}

export interface DashboardMarketComparison {
  market: string;
  transactionCount: number;
  totalSalesVolume: number;
  medianSalePrice: number | null;
  medianPricePerSqFt: number | null;
  pricePerSqFtSampleSize: number;
  medianReportedCapRate: number | null;
  capRateSampleSize: number;
  averageBuildingSize: number | null;
}

export interface DashboardData {
  source: PublicDataSource;
  containsOnlySamples: boolean;
  filters: DashboardFilters;
  filterOptions: DashboardFilterOptions;
  metrics: DashboardMetrics;
  transactionCountOverTime: DashboardTimePoint[];
  salesVolumeByPropertyType: DashboardPropertyTypeVolume[];
  medianPricePerSqFtByMarket: DashboardMarketPrice[];
  capRateDistribution: DashboardCapRateBin[];
  largestTransactions: DashboardLargestTransaction[];
  marketComparison: DashboardMarketComparison[];
}

export type AdminRole = "admin" | "editor";

export interface AdminProfile {
  userId: string;
  role: AdminRole;
  displayName: string | null;
}

export interface AuditEntry {
  id: number;
  userId: string | null;
  tableName: string;
  recordId: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  snapshot: Record<string, unknown>;
  changedAt: string;
}

export interface AdminOverview {
  propertyCount: number;
  transactionCount: number;
  publishedArticleCount: number;
  draftArticleCount: number;
  sourceCount: number;
  missingSourceCount: number;
  incompleteTransactionCount: number;
  missingVerificationDateCount: number;
  recentEdits: AuditEntry[];
}
