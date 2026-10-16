---
name: buildr-research
description: "Research a product, technical, or tool decision using current primary sources and explicit tradeoffs. Use for a consequential choice or uncertain external fact, not routine coding."
license: MIT
---

# Research a decision

Define the decision, constraints, and what evidence would change the choice.
Read relevant PROJECT.md decisions before repeating old research.

- Compare a small credible set of alternatives, including the existing approach
  or no added tool when relevant. Do not pad the list with unsuitable options.
- For library or service guidance, use Context7 if available. Resolve the ID first,
  choose the relevant version and reputable source, and query one concept at a
  time. Otherwise fetch official documentation and disclose that fallback.
- For product research, distinguish observed user behavior from inferred demand.
  Use primary product pages, repositories, papers, or direct user evidence.
- Check dates, versions, access restrictions, maintenance, operating costs,
  portability, and installation burden when they affect this decision. Prices
  and claims of availability need current sources.
- Record what each source actually establishes. Separate evidence, inference,
  recommendation, and remaining uncertainty. Conflicting evidence stays visible.
- Use a bounded local prototype only when it can settle the uncertainty. Do not
  create permanent runtime assertions or trigger paid services without scope.

Keep material research in a dated file under docs/research/ or the project's
existing research directory. Include the question, sources with links and checked
date, alternatives, choice, reasons, and what could reverse the choice.
Put only an accepted current decision and its reason in PROJECT.md.

Finish with a recommendation tied to the constraints and the next concrete
action.
