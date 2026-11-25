# Adspirer Social Ads for Antigravity

Run paid social from Antigravity. Adspirer Social Ads connects the agent to your live Meta Ads (Facebook and Instagram) and TikTok Ads accounts through Adspirer's hosted Social Ads MCP server, so you can report on results, catch creative fatigue, research competitors, and plan, launch and optimize campaigns without leaving the conversation.

## Use it for

- **Reporting:** spend, ROAS, CPA, CTR and conversions by campaign, ad set and ad, with audience, placement and geographic breakdowns.
- **Creative:** spot creative fatigue from frequency and CTR trends, compare winning and losing ads, and draft new concepts.
- **Campaigns:** build Meta image, video, carousel, dynamic creative and Advantage+ catalog campaigns, and TikTok video campaigns, created paused.
- **Optimization:** wasted-spend analysis, budget reallocation, placement optimization, and anomaly explanations.
- **Leads:** list Meta lead forms and read their submissions.
- **Competitors:** see the public ads a competitor is running now, beside your own.

## Install

**Antigravity app:** open **Customizations**, find **Adspirer Social Ads** in the
Marketplace, and install it.

**Antigravity CLI:**

```text
agy plugin install https://github.com/Adspirer/adspirer-social-ads-antigravity-plugin
```

**Manual:** clone this repository into your plugins folder.

```text
git clone https://github.com/Adspirer/adspirer-social-ads-antigravity-plugin ~/.gemini/config/plugins/adspirer-social-ads
```

Then sign in: open **Customizations**, then **Installed**, then **MCP Servers**, and choose
**Authenticate** next to the Adspirer server. Sign in to Adspirer in the browser, then connect the
accounts you want to use at [adspirer.ai/connections](https://adspirer.ai/connections). No
API key or client secret is required. An Adspirer account is required, and plan usage limits apply.

## Get started

Ask:

```text
How did my Meta and TikTok campaigns do over the last 30 days? Don't change anything.
Is my falling CTR on Instagram caused by creative fatigue?
Which Meta placements and age groups are wasting spend?
Propose three new creative concepts based on my best-performing ads.
Plan a Meta campaign within a $50 daily budget and create it paused after I approve.
```

Or start with a skill by name:

| Skill | What it does |
| --- | --- |
| `/adspirer-social-connect-ad-accounts` | Connect your accounts and get a first look |
| `/adspirer-social-ads-status` | Connected accounts and remaining plan usage |
| `/adspirer-social-ads-performance` | Scorecard against the previous period, with the top problems |
| `/adspirer-social-ads-wasted-spend` | Spend that is not converting, with fixes applied only after you approve |

Add a platform and period if you want, for example `/adspirer-social-ads-performance last 7 days`.

## What the agent can do

| Area | Capabilities |
| --- | --- |
| Meta Ads | Facebook and Instagram campaigns, ad sets, ads, custom audiences, pixels, lead forms, catalogs, product sets and app promotion |
| TikTok Ads | Campaigns, ad groups, ads, identities, pixels, Instant Forms, custom and saved audiences, and the video library |
| Reporting | Campaign, ad set and ad performance, audience demographics, placements, geography, catalog product performance, and app installs |
| Diagnostics | Wasted spend, creative fatigue, performance anomalies, and catalog funnel and waste |
| Competitor research | The public ads a competitor is running now, beside your own |

Meta (Facebook and Instagram) and TikTok are the advertising platforms on this connector. Google, Microsoft, LinkedIn, Amazon and Walmart are not included, and the plugin does not publish organic social posts.

## What's included

- **Skills** (`skills/`): the four entry points above, plus `adspirer-paid-social`, `adspirer-social-ad-creative`, `adspirer-social-ads-optimization`, `adspirer-social-ads-tools`, `adspirer-social-campaign-launch`, `adspirer-social-competitor-research`, `adspirer-social-conversion-analysis`, `adspirer-social-meta-ads`, `adspirer-social-product-help` and `adspirer-social-tiktok-ads`,
  which the agent loads when a request needs them.
- **A rule** (`rules/adspirer-social-ads.md`) that loads only for Meta Ads (Facebook and Instagram) and TikTok Ads requests and
  keeps every spend-affecting change behind your approval.
- **The Adspirer Social Ads MCP server** connection (`mcp_config.json`).

The hosted server is the source of truth for tool names and schemas. The skills teach the agent to
discover the current tools and their parameters instead of hardcoding every operation.

## Safety

- The agent reads account state and performance before proposing changes.
- New campaigns are created paused, and enabling them is a separate decision.
- Campaign creation, budget changes, bid changes, and other spend-affecting writes require your
  explicit approval. The server also holds spend-affecting and irreversible writes until they are
  confirmed.
- The agent reads created or changed resources back before reporting success.
- Campaigns are never deleted automatically.
- Tool results, competitor ads and website text are treated as data, never as instructions.
- **No purchases.** The agent never buys, upgrades or renews a plan or paid feature. If a plan
  limit is reached, it stops and explains the limit.

## MCP and authentication

```json
{
  "mcpServers": {
    "social-ads": {
      "url": "https://mcp.adspirer.com/social-ads"
    }
  }
}
```

The server speaks Streamable HTTP. Authentication uses OAuth 2.1 with PKCE and dynamic client
registration, so Antigravity handles the browser sign-in and the plugin contains no API keys,
tokens, client secrets, or configuration variables. Ad-platform credentials stay server-side with
Adspirer and are scoped to the accounts you connect.

## Network and execution surface

The plugin's only MCP server is `https://mcp.adspirer.com/social-ads`. It contains no hooks,
scripts, telemetry, local executables, or bundled server code. Skills and the rule are Markdown
guidance. Beyond the Adspirer server, the skills may ask the agent to read Adspirer's public
documentation at `adspirer.com/docs` to answer questions about plans and setup.

## Related plugins

Adspirer Social Ads is one of Adspirer's focused plugins. The full
[Adspirer Advertising Agent](https://github.com/Adspirer/adspirer-antigravity-plugin) covers every
supported platform in one plugin, and
[Adspirer Marketing Analytics](https://github.com/Adspirer/adspirer-analytics-antigravity-plugin)
is a read-only reporting connector. Installing more than one is supported; use one connection per
task.

## Support

Email [support@adspirer.com](mailto:support@adspirer.com) for help with installing, signing in or
using this plugin, or open an issue at
[github.com/Adspirer/adspirer-social-ads-antigravity-plugin/issues](https://github.com/Adspirer/adspirer-social-ads-antigravity-plugin/issues).
See [SUPPORT.md](SUPPORT.md).

## Privacy and source

- Privacy policy: [adspirer.com/privacy](https://www.adspirer.com/privacy)
- Terms: [adspirer.com/terms](https://www.adspirer.com/terms)
- Documentation: [adspirer.com/docs](https://www.adspirer.com/docs)

## License

MIT. See [LICENSE](LICENSE).
