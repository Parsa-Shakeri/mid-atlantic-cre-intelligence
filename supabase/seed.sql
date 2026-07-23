-- Nine fictional properties and ten fictional transactions.
-- These rows are for development only and must never be presented as real-world claims.

insert into public.properties
  (id, slug, property_name, street_address, city, state, zip_code, county, property_type, building_sq_ft, lot_acres, year_built, year_renovated, number_of_floors, parking_spaces, major_tenants, description, lease_structure, is_sample)
values
  ('10000000-0000-4000-8000-000000000001', 'harbor-point-offices-sample', 'Harbor Point Offices — Fictional Sample', '100 Sample Harbor Way', 'Baltimore', 'MD', '21201', 'Baltimore City', 'Office', 121000, 2.1, 1998, 2019, 8, 240, array['Sample Legal Group','Placeholder Advisory LLC'], 'Fictional office property created solely to demonstrate the research database.', 'Sample multi-tenant leases', true),
  ('10000000-0000-4000-8000-000000000002', 'potomac-trade-center-sample', 'Potomac Trade Center — Fictional Sample', '200 Placeholder Commerce Drive', 'Landover', 'MD', '20785', 'Prince George''s County', 'Industrial', 245000, 14.8, 2006, null, 1, 156, array['Example Logistics Co.'], 'Fictional industrial record for interface testing only.', 'Sample triple-net lease', true),
  ('10000000-0000-4000-8000-000000000003', 'wilson-boulevard-shops-sample', 'Wilson Boulevard Shops — Fictional Sample', '300 Demonstration Boulevard', 'Arlington', 'VA', '22201', 'Arlington County', 'Retail', 38750, 1.4, 1987, 2016, 2, 82, array['Sample Market','Example Coffee'], 'Fictional neighborhood retail center used only as labeled placeholder content.', 'Sample multi-tenant net leases', true),
  ('10000000-0000-4000-8000-000000000004', 'north-capitol-flats-sample', 'North Capitol Flats — Fictional Sample', '400 Research Place NW', 'Washington', 'DC', '20001', 'District of Columbia', 'Multifamily', 164000, 1.2, 2012, null, 10, 96, '{}', 'Fictional multifamily property. All details are placeholders.', 'Sample residential leases', true),
  ('10000000-0000-4000-8000-000000000005', 'i95-distribution-annex-sample', 'I-95 Distribution Annex — Fictional Sample', '500 Example Distribution Lane', 'Jessup', 'MD', '20794', 'Howard County', 'Industrial', 178500, 10.5, 2001, 2021, 1, 118, array['Placeholder Supply Inc.'], 'Fictional warehouse record for search and filtering tests.', 'Sample single-tenant net lease', true),
  ('10000000-0000-4000-8000-000000000006', 'old-town-medical-pavilion-sample', 'Old Town Medical Pavilion — Fictional Sample', '600 Prototype Health Street', 'Alexandria', 'VA', '22314', 'City of Alexandria', 'Medical Office', 62400, 2.3, 1994, 2018, 4, 190, array['Example Health Partners'], 'Fictional medical office example.', 'Sample modified-gross leases', true),
  ('10000000-0000-4000-8000-000000000007', 'bethesda-mixed-use-court-sample', 'Bethesda Mixed-Use Court — Fictional Sample', '700 Sample Wisconsin Court', 'Bethesda', 'MD', '20814', 'Montgomery County', 'Mixed-Use', 210000, 1.8, 2009, null, 12, 280, array['Demo Grocer','Placeholder Fitness'], 'Fictional mixed-use property for quality assurance.', 'Sample residential and retail leases', true),
  ('10000000-0000-4000-8000-000000000008', 'frederick-storage-park-sample', 'Frederick Storage Park — Fictional Sample', '800 Testing Pike', 'Frederick', 'MD', '21701', 'Frederick County', 'Self-Storage', 84500, 4.6, 2003, 2020, 3, 22, '{}', 'Fictional self-storage property.', 'Sample month-to-month agreements', true),
  ('10000000-0000-4000-8000-000000000009', 'navy-yard-hotel-sample', 'Navy Yard Hotel — Fictional Sample', '900 Illustration Avenue SE', 'Washington', 'DC', '20003', 'District of Columbia', 'Hotel', 132000, 0.9, 2015, null, 11, 54, array['Example Hospitality Brand'], 'Fictional hotel property.', 'Sample hotel management agreement', true);

insert into public.transactions
  (id, property_id, sale_date, sale_price, buyer, seller, reported_cap_rate, reported_noi, transaction_type, notes, verification_status, date_verified, is_sample)
values
  ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','2025-11-14',18400000,'Sample Harbor Buyer LLC','Example Office Seller LP',0.061,1122400,'Asset Sale','Fictional sample transaction.','Estimated','2025-11-21',true),
  ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','2025-10-02',32750000,'Placeholder Industrial Fund','Sample Logistics Owner LLC',null,null,'Asset Sale','Fictional sample transaction.','Incomplete',null,true),
  ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','2025-08-21',12100000,'Example Retail Partners','Placeholder Shops LLC',0.058,701800,'Asset Sale','Fictional sample transaction.','Estimated','2025-08-29',true),
  ('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000004','2025-06-30',41600000,'Sample Residential Fund','Example Multifamily LP',null,null,'Entity Sale','Fictional sample transaction.','Incomplete',null,true),
  ('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000005','2025-04-18',22900000,'Demo Distribution REIT','Sample Warehouse Owner',0.055,1259500,'Asset Sale','Fictional sample transaction.','Estimated','2025-04-25',true),
  ('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000006','2024-12-10',15600000,'Placeholder Medical Investors','Example Health Properties',null,null,'Asset Sale','Fictional sample transaction.','Incomplete',null,true),
  ('20000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000007','2024-09-05',58500000,'Sample Mixed-Use Capital','Demo Urban Owner LP',0.052,3042000,'Asset Sale','Fictional sample transaction.','Estimated','2024-09-13',true),
  ('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000008','2024-05-22',9800000,'Example Storage Holdings','Placeholder Storage LLC',null,null,'Asset Sale','Fictional sample transaction.','Incomplete',null,true),
  ('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000009','2024-02-16',44300000,'Sample Hospitality Group','Example Hotel Capital',null,null,'Asset Sale','Fictional sample transaction.','Incomplete',null,true),
  ('20000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000001','2018-03-09',14300000,'Example Office Seller LP','Sample Prior Owner',null,null,'Asset Sale','Fictional earlier transaction demonstrating transaction history.','Incomplete',null,true);

insert into public.sources (transaction_id, property_id, source_name, source_url, accessed_date, source_type, notes, is_sample)
select t.id, t.property_id, 'Fictional Development Source', 'https://example.com/fictional-sample', '2026-01-15', 'Sample record', 'Placeholder citation; not evidence of a real transaction.', true
from public.transactions t
where t.is_sample = true;

insert into public.articles
  (id, slug, title, thesis, summary, executive_summary, body, category, publication_date, status, featured, reading_time, author, limitations, exhibit, is_sample)
values
  (
    '40000000-0000-4000-8000-000000000001', 'reading-local-industrial-demand',
    'Reading Local Industrial Demand Beyond the Headline Number',
    'A durable industrial-demand view separates leasing activity from tenant quality, physical fit, and the depth of competing supply.',
    'A sample research note on interpreting absorption, vacancy, tenant demand, and transaction evidence.',
    array['Net absorption is an outcome, not a complete explanation of demand.','Building specifications can create several markets inside one geography.','Leasing evidence should be compared with supply, rollover risk, and transaction liquidity.'],
    $$## Start with the question behind the metric

Vacancy and absorption are useful only after the analyst defines the property set, time period, and tenant segment. A broad average can conceal very different conditions by building quality.

## Separate activity from durability

A signed lease shows activity. Durable demand requires questions about tenant expansion, physical fit, and comparable availability.

## Connect leasing and capital markets

Transaction evidence is a cross-check, not a substitute for operating data. A thin sales market may reflect financing more than tenant demand.$$, 
    'Property Sector Analysis', '2026-01-12', 'published', true, 7, 'Student Research Desk',
    array['This sample report contains no real market observations.','Industrial definitions vary by source and submarket.','Private lease terms are often unavailable.'],
    '{"title":"Illustrative demand scorecard","description":"A hypothetical framework for organizing evidence.","columns":["Signal","Hypothetical reading","Research implication"],"rows":[["Modern-space vacancy","Low","Check construction pipeline"],["Older flex vacancy","Elevated","Segment by building quality"],["Leasing velocity","Stable","Compare renewals with expansions"]],"note":"Hypothetical example only; no row is an actual market statistic."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000002', 'what-public-records-can-tell-us',
    'What Public Records Can—and Cannot—Tell Us About a Sale',
    'Reliable transaction research depends as much on documenting uncertainty as finding a recorded price.',
    'A sample methodology explainer covering deeds, reporting lags, entity names, source conflicts, and corroboration.',
    array['A deed can establish a transfer without explaining the full economics.','Entity names do not prove ultimate ownership by themselves.','Material fields should retain source dates and verification status.'],
    $$## What the record establishes

Public records can provide a parcel reference, legal parties, filing date, and stated consideration. Each field should retain its source and access date.

## What may remain outside the record

Portfolio allocations, assumed debt, partnership interests, concessions, and post-closing adjustments may not appear in one filing.

## A defensible workflow

Begin with the original filing, compare credible secondary accounts, and document conflicts. Missing material fields remain unavailable.$$, 
    'Educational Explainers', '2025-12-08', 'published', true, 6, 'Student Research Desk',
    array['Recording practices differ by jurisdiction.','A filing may lag the economic closing date.','This article is educational and not legal guidance.'],
    '{"title":"Source reconciliation worksheet","description":"A hypothetical audit trail showing how conflicts remain visible.","columns":["Field","Source A","Source B","Published value"],"rows":[["Transfer date","Date 1","Date 1","Date 1"],["Consideration","$X","$X","$X"],["Buyer identity","Entity name","Parent reported","Parent unverified"]],"note":"Hypothetical labels only; no parties, dates, or prices refer to an actual filing."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000003', 'comparing-price-per-square-foot',
    'Comparing Price per Square Foot Across Property Types',
    'Price per square foot becomes misleading when physical, income, and transaction contexts are ignored.',
    'A sample deal-analysis framework for making more disciplined pricing comparisons.',
    array['The denominator must be defined consistently.','Property age, land, occupancy, and capital needs can overwhelm the metric.','Price per square foot is a starting point, not a valuation conclusion.'],
    $$## Confirm the denominator

Published square footage may refer to gross building area, rentable area, or another measurement. Record the definition before calculating.

## Normalize the context

Equal prices per square foot can imply different economics when one asset is stabilized and another requires lease-up or renovation.

## Use a comparison range

A useful comp set explains inclusion decisions and shows the spread. Outliers remain visible with notes instead of being silently removed.$$, 
    'Deal Breakdowns', '2025-11-17', 'published', true, 8, 'Student Research Desk',
    array['The exhibit omits taxes, debt, and transaction costs.','Building-area definitions may differ.','No sample value should support an investment decision.'],
    '{"title":"Hypothetical comparison grid","description":"Three fictional examples demonstrate why context accompanies the metric.","columns":["Example","Price / sq. ft.","Occupancy context","Capital context"],"rows":[["Sample A","$150","Stabilized","Limited work"],["Sample B","$150","Lease-up","Improvements required"],["Sample C","$190","Stabilized","Recent renovation"]],"note":"All figures are invented for educational illustration."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000004', 'financing-sensitivity-without-false-precision',
    'Financing Sensitivity Without False Precision',
    'A transparent financing scenario should show its assumptions and ranges instead of implying certainty.',
    'A sample framework for testing how hypothetical debt costs and coverage requirements affect transaction capacity.',
    array['Sensitivity analysis is more useful than a single forecast.','Coverage, amortization, leverage, and fees should form a coherent scenario.','The output describes model behavior, not lender terms.'],
    $$## Define the decision variable

A financing model should begin with the question it needs to answer: proceeds, debt service, coverage, or equity requirement.

## Build a small scenario set

A base, lower-cost, and higher-cost case can reveal which assumptions matter most. Every input needs a source or hypothetical label.

## Keep financing separate from value

Debt capacity can influence what a buyer can pay, but it does not by itself establish property value.$$, 
    'Interest Rates and Financing', '2025-10-06', 'published', false, 7, 'Student Research Desk',
    array['Financing structures vary by lender and borrower.','The example excludes fees and reserves.','No scenario is a current loan quote.'],
    '{"title":"Illustrative debt-cost sensitivity","description":"A hypothetical directional example with no current rate claim.","columns":["Scenario","Debt-cost assumption","Direction of proceeds"],"rows":[["Lower-cost case","Base less 0.50%","Higher"],["Base case","Hypothetical base","Reference"],["Higher-cost case","Base plus 0.50%","Lower"]],"note":"Conceptual model only; not lending advice."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000005', 'scenario-mapping-local-development',
    'A Scenario Map for Local Development Research',
    'Development research improves when entitlement, construction, leasing, and financing risks are tracked separately.',
    'A sample workflow for describing a hypothetical project without turning uncertain milestones into promised outcomes.',
    array['An announced project is not the same as a financed project.','Milestones should carry dates, sources, and confidence labels.','Scenario maps show dependencies without inventing a forecast.'],
    $$## Track status, not promotion

Development announcements describe an intended program. Research distinguishes proposals, approvals, financing, construction, and delivery.

## Identify the dependencies

A project may depend on permits, infrastructure, preleasing, or capital. Mapping dependencies explains what could change without assigning unsupported probabilities.

## Revisit the record

A dated status log is more credible than a rewritten narrative. When plans change, the prior state remains documented.$$, 
    'Local Development', '2025-09-15', 'published', false, 6, 'Student Research Desk',
    array['Milestones can change after publication.','Private budgets may be unavailable.','The timeline is not associated with a real site.'],
    '{"title":"Hypothetical milestone register","description":"A sample structure for tracking project evidence.","columns":["Milestone","Evidence state","Research treatment"],"rows":[["Concept announced","Observed","Record source and date"],["Entitlement","Pending","Do not assume approval"],["Construction start","Unconfirmed","Leave forecast unavailable"]],"note":"Every status is fictional."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000006', 'tenant-concentration-worksheet',
    'A Tenant-Concentration Worksheet for Retail Research',
    'Tenant lists become more useful when lease exposure, use category, and replacement difficulty are analyzed together.',
    'A sample retail worksheet that avoids treating every occupied square foot as equivalent demand.',
    array['Concentration is both a credit and merchandising question.','Lease expiration and replacement cost can matter more than tenant count.','Public lists rarely provide complete lease data.'],
    $$## Look beyond occupancy

A center can be highly occupied while relying on one tenant for traffic, rent, or both. Research should identify what a tenant list does not reveal.

## Group the exposures

Tenant use, unit size, lease timing, and co-tenancy relationships create different forms of exposure.

## Document replacement assumptions

Do not assume a vacated unit can be released at the same rent or without capital. Replacement difficulty is a scenario input.$$, 
    'Retail and Tenant Analysis', '2025-08-11', 'published', false, 6, 'Student Research Desk',
    array['Public sources rarely disclose lease economics.','Tenant credit can change.','The exhibit uses invented tenant labels.'],
    '{"title":"Illustrative tenant worksheet","description":"Fictional labels show a non-financial concentration screen.","columns":["Tenant","Use","Relative size","Replacement note"],"rows":[["Sample Market","Grocery","Large","Specialized layout"],["Example Coffee","Food and beverage","Small","Broader user pool"],["Demo Services","Service","Medium","Build-out dependent"]],"note":"Fictional labels only; no named tenant is a real company claim."}'::jsonb, true
  ),
  (
    '40000000-0000-4000-8000-000000000007', 'building-a-repeatable-quarterly-market-brief',
    'Building a Repeatable Quarterly Market Brief',
    'A useful market report keeps definitions stable, exposes sample sizes, and separates observed change from interpretation.',
    'A sample reporting template for producing consistent local research as the database grows.',
    array['Stable definitions make comparisons auditable.','Every chart should show record and missing-data counts.','Commentary should not extend beyond the sample.'],
    $$## Freeze the definitions first

A quarterly brief needs written rules for geography, property type, transaction date, and inclusion thresholds.

## Show the denominator

Totals, medians, and distributions become easier to evaluate when the reader can see sample size and missing-field count.

## Separate observation and interpretation

First state what changed in the recorded sample, then offer possible explanations with supporting evidence and alternatives.$$, 
    'Market Reports', '2025-07-07', 'published', false, 7, 'Student Research Desk',
    array['A selective database cannot represent the full market.','Reporting lags can shift period results.','The exhibit is a process checklist.'],
    '{"title":"Quarterly publication checklist","description":"A reusable quality-control sequence.","columns":["Step","Required disclosure","Completion test"],"rows":[["Define","Geography and rules","Comparable to prior period"],["Measure","Sample and missing counts","Shown beside every exhibit"],["Interpret","Evidence and alternatives","Limits stated explicitly"]],"note":"Process illustration only; no market performance is asserted."}'::jsonb, true
  );

insert into public.article_properties (article_id, property_id)
values
  ('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002'),
  ('40000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000005'),
  ('40000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000006'),
  ('40000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000004'),
  ('40000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000007'),
  ('40000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000003'),
  ('40000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000001');

insert into public.sources (article_id, source_name, source_url, publication_date, accessed_date, source_type, notes, is_sample)
select id, 'Fictional Editorial Demonstration', 'https://example.com/fictional-research-source', publication_date, '2026-02-01', 'Sample source', 'Placeholder citation used only to demonstrate the article source interface.', true
from public.articles
where is_sample = true;
