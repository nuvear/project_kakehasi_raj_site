---
locale: en
title: Enterprise AI Reference Guide
summary: Practical questions and exercises for AI strategy, evidence, governance and accountable investment decisions.
translation_status: published
last_editorial_review: "2026-09-07"
---

# Enterprise AI Transformation — The Reference Guide

A learning companion to GATE — Governed AI Transformation for Enterprises™.

Use this guide to prepare a portfolio discussion, challenge an assumption or design a better pilot. GATE is the command center for reviewing projects and their evidence. This guide explains the management questions behind that work; the application manual explains how to operate GATE.

The exercises are fictional. Any figures supplied in an exercise are assumptions to test, not measured outcomes, industry benchmarks or promised returns. This guide supports learning and professional discussion; it is not a certification checklist or a legal opinion.

# Part I: The Strategic Foundation

Start with a decision the business needs to make. Describe the problem, affected people, current process and measurable outcome before selecting a model or vendor.

Ask whether the task needs AI. A simpler rule, process change, search tool or conventional application may solve it more reliably. Record the alternatives, including continuing with the current process.

**Bring to the review:** a named sponsor, a problem statement, a baseline and a proposed success measure.

# Part II: Six Questions for Enterprise Readiness

1. **Strategy:** Which business objective does this project support, and what would justify stopping it?
2. **Data:** What sources can be used, by whom, for which purposes and for how long?
3. **Technology:** How will the solution be evaluated, integrated, monitored and recovered?
4. **Operating model:** Who owns the service, its decisions and the response when something fails?
5. **Governance:** What approvals, rights, controls and independent reviews are needed?
6. **Value:** How will the enterprise distinguish an observed benefit from an assumption?

Use these questions to organize evidence. Completing a checklist alone does not establish readiness.

# Part III: Maturity as Evidence

A maturity discussion can distinguish exploration, controlled pilots, repeatable delivery, operational adoption and continuous improvement. Progress depends on demonstrated capability, not the number of tools purchased or projects labeled AI.

For each capability, record the evidence, owner, gap and next review date. A strong technical evaluation cannot compensate for missing data rights or an unowned production service.

# Part IV: A Roadmap with Decision Gates

Sequence work around evidence that must be available before the next commitment:

1. Define the problem and establish a baseline.
2. Confirm data access, responsibilities and evaluation criteria.
3. Run a bounded pilot with an explicit stop condition.
4. Evaluate results, operational demands and unresolved risks.
5. Authorize, defer or stop the next stage; record the reasoning.

Set dates around the work required. A generic three-year roadmap is not evidence that a particular project can scale.

# Part V: A Portfolio Review Scenario

Imagine a retailer running 20 AI pilots across customer support, inventory and merchandising. Its leadership team cannot explain which projects have demonstrated value.

Classify each initiative as **advance**, **investigate**, **pause** or **stop**, using purpose, evidence quality, feasible integration and unresolved risk. Do not set a quota for how many projects must survive.

Compare a promising experiment with a production service separately: their cost commitments, uncertainty and required evidence differ. Record what new information would change each recommendation.

# Part VI: Agent Architecture and Human Authority

An agentic workflow may retrieve information, propose a plan and call tools. Separate the authority to recommend from the authority to change a record, make a payment or contact a person.

Use scoped credentials, explicit approval points and deterministic checks for constrained facts such as an allowed amount or valid account. Check the quality and freshness of the underlying systems too; deterministic code can still execute the wrong rule or use stale data.

A second model can help review an output, but it is not independent assurance by itself. Test shared failure modes, tool misuse, missing permissions and the ability to stop a run.

# Part VII: Governance and Escalation

Define who may approve a project, accept a residual risk and stop an unsafe workflow. Separate project ownership from independent challenge where the organization requires it.

Specify escalation triggers for safety concerns, suspected privacy incidents, discriminatory outcomes, unexpected spending and unsupported recommendations. Preserve relevant incident evidence under the organization's approved response and retention procedures.

For regulatory and standards work, begin with the authoritative publications and qualified reviewers:

- [ISO/IEC 42001:2023 — AI management systems](https://www.iso.org/standard/42001)
- [European Commission — AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [IMDA — updated Model AI Governance Framework for Agentic AI](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/updated-model-ai-governance-framework-for-agentic-ai)

Establish which obligations apply to the organization's role, use case, jurisdictions and dates. Obtain appropriate rights before using licensed source material. These links are starting points, not a complete compliance determination.

# Part VIII: Model Choice and Routing

Evaluate model options on representative tasks using quality, latency, cost, data handling and operating requirements. Compare the current available models and contractual terms when making a purchasing decision.

Some tasks can use a smaller model; some require stronger reasoning; others should query an authoritative API directly. Measure performance for the actual workflow instead of assuming that a particular model family will be sufficient.

**Bring to the review:** the comparison set, test cases, observed failure rate, cost per completed task and fallback behavior.

# Part IX: Retrieval and Agentic RAG

Retrieval-augmented generation brings selected source material into an answer. The resulting answer still needs evaluation: retrieved text can be incomplete, obsolete, conflicting or irrelevant.

Require source ownership, access controls, version history, approval status and a clear response when evidence is missing. Test whether citations actually support the conclusion. A source link alone does not establish correctness.

In an agentic RAG workflow, bound the follow-up research, tool permissions and execution cost. Record the sources reviewed and unresolved questions so a person can assess the result.

# Part X: Customer Outcomes and Responsible Design

Customer engagement should respect the person's purpose and choices. Avoid treating vulnerability, sensitive inferences or distress as opportunities to increase sales.

Review the interaction from the customer's perspective: what is being inferred, what choice is offered, what can be corrected and when can a person take over? Measure harmful or misleading outcomes alongside conversion and satisfaction.

# Part XI: Fairness and Affected People

Imagine a pricing experiment that produces different offers across customer groups. Investigate data quality, objectives, proxy variables, affected groups and the circumstances in which the disparity occurs.

Choose appropriate evaluation measures with domain and legal reviewers. A single percentage threshold or an adjusted ROI formula cannot establish fairness or legal compliance.

Pause the affected use when warranted, preserve evidence, investigate the cause and require a documented decision before restarting.

# Part XII: Shadow Evaluation

In shadow evaluation, people continue the current workflow while AI produces outputs for comparison without acting on customers. Use approved data, restricted access and a defined retention period; a shadow deployment still has data and security responsibilities.

Compare correctness, task completion, harmful outputs, escalation behavior and time spent reviewing or correcting results. Include difficult and infrequent cases, not only typical requests.

# Part XIII: Decision Rights

A disagreement between Growth and Legal should have a defined resolution path. Document each concern, the evidence needed, decision authority and the conditions for pausing or proceeding.

Commercial pressure does not remove legal or safety obligations. Give independent reviewers enough authority and access to challenge the proposal. The accountable decision maker should record the rationale and any unresolved risk.

# Part XIV: AI Economics

Build a business case from measured baselines and explicit assumptions. Include integration, data preparation, licensing, inference, human review, evaluation, security, support and recovery costs.

Separate three kinds of benefit:

- **Cash savings:** expenditure that can actually be reduced.
- **Capacity released:** time available for other work, with a plan for its use.
- **Incremental contribution:** attributable additional revenue after the costs needed to deliver it.

Treat risk reduction separately and explain its uncertainty. Do not count the same saved hours as both reduced labor cost and additional productive capacity. Use ranges and sensitivity analysis; compare outcomes with an appropriate baseline or control.

# Part XV: Industry Context

The same model may need very different controls in different settings. Consider:

- **Financial services:** customer impact, permissions, explainability, oversight and escalation.
- **Healthcare:** intended use, qualified clinical review, patient safety and data protection.
- **Manufacturing:** physical safety, sensor quality, maintenance and operational fallback.
- **Public services:** accessibility, due process, affected rights and contestability.

Techniques such as federated learning can reduce some data movement, but do not by themselves establish privacy, security or permission to use the data. Obtain specialist review for the actual design and jurisdiction.

# Part XVI: Execution and Adoption

Involve the people who do the work in defining success and reviewing failures. Test whether the solution improves the whole process, including exceptions and corrections.

Train users on appropriate reliance, escalation and the limits of the system. Increase autonomy only when the evidence and permissions justify it; some use cases should retain human approval permanently.

# Part XVII: Leadership Practice

Good AI leadership combines a clear purpose with the willingness to revise a decision. Make uncertainty visible. Recognize the people who identify a failure early as well as those who deliver an improvement.

Create operating routines that survive changes in models and vendors: evidence reviews, accountable decisions, incident learning and a periodic check that the project still serves its original purpose.

# Part XVIII: Five Executive Perspectives

- **CEO:** Is this the right strategic commitment, given the alternatives?
- **CFO:** Which benefits are measured, which remain assumptions and what is the full cost?
- **CIO:** Who owns the data, integration, access and continuing service?
- **CTO:** Do the evaluations and operating controls justify the next stage?
- **Legal:** Which duties and affected rights apply, and what specialist review remains?

Use the disagreement between these perspectives to identify missing evidence. Agreement without adequate evidence is not a stronger decision.

# Part XIX: A 12-Week Practice Path

Use fictional or approved training material. Each week should produce something a colleague can review.

1. **Purpose:** define a project, its users and its current baseline.
2. **Portfolio:** compare three initiatives and record a priority decision.
3. **Data:** map source ownership, access and retention.
4. **Evidence:** identify approved sources, missing information and conflicting claims.
5. **Models:** design a comparison with success and failure criteria.
6. **Agents:** map tool authority, approval points and stopping conditions.
7. **Governance:** record duties, review owners and unresolved questions.
8. **Fairness:** investigate an outcome from the perspective of affected people.
9. **Operations:** rehearse an incident and recovery decision.
10. **Economics:** challenge benefit assumptions and test a downside case.
11. **Leadership:** conduct a CEO, CFO, CIO, CTO and Legal portfolio meeting.
12. **Decision:** produce an evidence-backed recommendation and a follow-up plan.

The [GATE executive simulation](https://gate-enterprise.praba.chatgpt.site/simulation) provides a separate practice environment. It currently requires GATE access. The [AI Leadership Diary](/diary) supports personal reflection with a separate account.

# Part XX: Failure Patterns to Watch

Watch for unclear ownership, inaccessible evidence, weak evaluation, hidden operating costs and a lack of response when the system fails. Fragmented pilots often also conceal duplicated work and incompatible assumptions.

Ask what would falsify the project's business case. If the team cannot describe an unfavorable result or a stop condition, refine the pilot before expanding it.

# Part XXI: The Portfolio Review Checklist

1. State the decision and its accountable owner.
2. Separate verified evidence from assumptions and missing information.
3. Compare alternatives, including pausing or stopping.
4. Explain benefits, total costs, affected people and residual risks.
5. Record the decision, rationale, conditions and next review date.

[Explore GATE](/en/apps/ai-transformation-command-center) for the current command center and pilot details. [Read the GATE user manual](https://gate-enterprise.praba.chatgpt.site/guide) for application instructions; access is currently restricted.
