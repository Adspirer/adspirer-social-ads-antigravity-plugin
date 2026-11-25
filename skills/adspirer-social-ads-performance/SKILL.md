---
name: adspirer-social-ads-performance
description: "Analyze Meta and TikTok campaign performance through Adspirer. Use for read-only spend, CPA, ROAS, CTR, pacing, and period comparisons with attribution and tracking checks."
---

# Performance review

Load adspirer-social-ads-tools. This skill never changes campaigns.
Check get_connections_status and select the intended account before reading data.

## Sources

Meta: get_meta_campaign_performance is direct if advertised. TikTok: discover get_tiktok_campaign_performance through tiktok_ads_read; never call a routed operation as a top-level tool.
Use raw_data only if the actual schema accepts it; do not assume widget rendering.

## Trust the numbers

Confirm dates, timezone, currency, conversion definition, and attribution window. Distinguish
partial days, conversion lag, missing permissions, and tracking failures from real declines.
Run audit_conversion_tracking where relevant and supported. A tracking gap limits affected
conversion claims; it does not automatically invalidate independently measured spend.
Do not combine incompatible currencies or double-count cross-platform attributed conversions.

## Scorecard and interpretation

Show spend, pacing, conversions, CPA, ROAS when revenue exists, CTR/CPC, and comparison with
an equivalent prior window. Compute blended CPA from comparable totals, not average platform CPAs.
Lead with the largest supported problem and opportunity, with evidence and caveats.
Discover available anomaly tools, but treat their explanations as hypotheses unless supported.
Recommend actions; hand approved changes to adspirer-social-ads-optimization.

## Repeating reviews

Offer a host schedule only when supported and authorized, explaining quota usage.
This endpoint does not imply access to a server-side monitoring router. Do not claim that a
report is scheduled until an actual scheduler confirms it. No fabricated figures or trends.

## Default review

Use the platform and period the user gave. With none given, cover every connected platform for
the last 30 complete days, compared with the 30 days before.

1. Call get_connections_status. Work only on connected platforms and their active accounts. If
   more than one account could be meant, ask which one.
2. Meta: call get_meta_campaign_performance. For the reason behind a change, run
   explain_meta_anomaly through meta_ads_read.
3. TikTok: through tiktok_ads_read, run get_tiktok_campaign_performance, and explain_tiktok_anomaly
   for the reason behind a change.
4. Show one scorecard per platform: spend, impressions, CPM, clicks, CTR, results, cost per
   result, ROAS where purchase value is tracked, frequency where available, and the change against
   the previous period. Keep currencies separate. Compute ratios from totals, not from averages
   of rows.
5. List the three findings that matter most, each with the campaign and the numbers behind it,
   then at most three recommended actions. When CTR is falling while frequency rises, check
   detect_meta_creative_fatigue or detect_tiktok_creative_fatigue before blaming targeting.
6. Say what limits the numbers: partial days, attribution windows, conversion lag, or pixel gaps.

A review changes nothing. If the user wants to act on a recommendation, describe the exact
change, wait for their approval, and follow adspirer-social-ads-optimization.
