import { useId } from "react";
import { reviewed } from "./content";
import type { Breakdown, Branch, Item, Matrix, Sequence, Visual } from "./types";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("en-US", { style: "percent" });

function Arrow() {
  return <svg className="cfv-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3v16m-6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" />
  </svg>;
}

function ItemCopy({ item }: { item: Item }) {
  return <><strong>{item.title}</strong><p>{item.text}</p></>;
}

function Outcomes({ items }: { items: Item[] }) {
  return <ul className="cfv-outcomes">
    {items.map(item => <li key={item.title}>
      {item.cue && <span className="cfv-cue">{item.cue}</span>}
      <ItemCopy item={item} />
    </li>)}
  </ul>;
}

function BranchDiagram({ data }: { data: Branch }) {
  return <div className="cfv-branch">
    <div className="cfv-question">{data.root}</div>
    <div className="cfv-connector"><Arrow /></div>
    <Outcomes items={data.branches} />
  </div>;
}

function SequenceDiagram({ data }: { data: Sequence }) {
  return <div>
    <ol className="cfv-timeline" role="list">
      {data.steps.map((item, index) => <li key={item.title}>
        <span className="cfv-marker" aria-hidden="true">{index + 1}</span>
        <div>{item.cue && <span className="cfv-cue">{item.cue}</span>}<ItemCopy item={item} /></div>
      </li>)}
    </ol>
    {data.outcomes && <div className="cfv-sequence-ends">
      <div className="cfv-outcome-label"><Arrow /><strong>{data.outcomeLabel}</strong></div>
      <Outcomes items={data.outcomes} />
    </div>}
  </div>;
}

function MatrixDiagram({ data, label }: { data: Matrix; label: string }) {
  return <table className={`cfv-matrix ${data.columns.length > 2 ? "cfv-matrix-wide" : ""}`} role="table" aria-label={label}>
    <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">What to compare</th>
      {data.columns.map(col => <th scope="col" role="columnheader" key={col}>{col}</th>)}
    </tr></thead>
    <tbody role="rowgroup">{data.rows.map(row => <tr role="row" key={row.title}>
      <th scope="row" role="rowheader">{row.title}</th>
      {row.cells.map((cell, index) => <td role="cell" key={data.columns[index]}>
        <span className="cfv-mobile-label" aria-hidden="true">{data.columns[index]}</span>{cell}
      </td>)}
    </tr>)}</tbody>
  </table>;
}

function BillDiagram({ data }: { data: Breakdown }) {
  const coinsurance = Math.round((data.allowed - data.deductible) * data.rate);
  const patient = data.deductible + coinsurance;
  const plan = data.allowed - patient;
  const adjustment = data.billed - data.allowed;
  return <div className="cfv-bill">
    <div className="cfv-bill-top"><span>Hospital charge</span><strong>{money.format(data.billed)}</strong></div>
    <div className="cfv-bill-rule" aria-hidden="true">
      <span style={{ flex: data.allowed }} /><span style={{ flex: adjustment }} />
    </div>
    <div className="cfv-bill-top"><span>Contract adjustment</span><strong>−{money.format(adjustment)}</strong></div>
    <div className="cfv-allowed">
      <div className="cfv-bill-top"><span>Allowed amount</span><strong>{money.format(data.allowed)}</strong></div>
      <div className="cfv-bill-rule cfv-bill-split" aria-hidden="true">
        <span style={{ flex: patient }} /><span style={{ flex: plan }} />
      </div>
      <dl className="cfv-legend">
        <div><dt>Your share</dt><dd><strong>{money.format(patient)}</strong> <span>{money.format(data.deductible)} remaining deductible + {money.format(coinsurance)} coinsurance ({percent.format(data.rate)} of {money.format(data.allowed - data.deductible)})</span></dd></div>
        <div><dt>Plan pays</dt><dd><strong>{money.format(plan)}</strong></dd></div>
      </dl>
    </div>
  </div>;
}

export function ArticleVisual({ visual, headingLevel = 2 }: { visual: Visual; headingLevel?: 2 | 3 }) {
  const titleId = useId();
  const Heading = headingLevel === 3 ? "h3" : "h2";
  const data = visual.diagram;
  return <figure className="cfv" aria-labelledby={titleId}>
    <figcaption>
      <p className="cfv-scope">{visual.scope}</p>
      <Heading id={titleId}>{visual.title}</Heading>
      <p className="cfv-lead">{visual.takeaway}</p>
    </figcaption>
    <div className="cfv-body">
      {data.kind === "matrix" && <MatrixDiagram data={data} label={visual.title} />}
      {data.kind === "sequence" && <SequenceDiagram data={data} />}
      {data.kind === "branch" && <BranchDiagram data={data} />}
      {data.kind === "breakdown" && <BillDiagram data={data} />}
    </div>
    <div className="cfv-check"><strong>What to check</strong><p>{visual.check}</p></div>
    <div className="cfv-evidence">
      <p>Sources verified {reviewed}</p>
      <ul role="list">{visual.sources.map(source => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul>
    </div>
    <p className="cfv-publisher">Community Acquired Finance</p>
  </figure>;
}
