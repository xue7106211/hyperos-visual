"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  LayoutGrid,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  TabletSmartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  cardsFor,
  countRows,
  data,
  orderedCategories,
  type CardModel,
  type Status,
} from "@/lib/model";

const ICONS: Record<string, LucideIcon> = {
  components: LayoutGrid,
  principles: Compass,
  experience: Palette,
  patterns: Workflow,
  input: MousePointer2,
  platform: MonitorSmartphone,
  devices: TabletSmartphone,
};

const FILTERS: { id: Status | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "已完成", label: "已完成" },
  { id: "进行中", label: "进行中" },
];

const pressable =
  "font-medium transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1e23]";

export function Panorama() {
  const categories = useMemo(() => orderedCategories(data.categories), []);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [current, setCurrent] = useState(categories[0]?.id ?? "");

  const sections = useMemo(
    () =>
      categories
        .map((category) => ({ category, cards: cardsFor(category, filter) }))
        .filter((section) => section.cards.length > 0),
    [categories, filter],
  );

  const totals = countRows(sections.flatMap((section) => section.cards));

  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-section]")];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.3] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  function openSection(id: string) {
    setCurrent(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-header flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#eceef2] bg-white py-3 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:h-16 md:flex-nowrap md:py-0">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/xiaomi-hyperos-logo.png"
            alt="Xiaomi HyperOS"
            width={1020}
            height={139}
            draggable={false}
            className="h-6 w-auto shrink-0 select-none"
          />
          <p className="hidden min-w-0 truncate text-[15px] font-medium tracking-tight text-[#1b1e23] md:block">
            {data.title}
          </p>
        </div>
        <div className="flex w-full rounded-xl border border-[#e7e9ee] bg-white p-1 md:ml-auto md:w-auto">
          {FILTERS.map((item) => {
            const on = filter === item.id;
            const count =
              item.id === "all" ? totals.total : item.id === "已完成" ? totals.done : totals.wip;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(item.id)}
                className={`h-11 flex-1 rounded-lg px-3 text-[13px] md:flex-none ${pressable} ${
                  on ? "bg-[#f3f4f6] text-[#1b1e23]" : "text-[#5c6570] hover:bg-[#f7f8fa]"
                }`}
              >
                {item.label}
                <span className="ml-1.5 inline-block min-w-[2ch] text-right tabular-nums text-[#8b939c]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[248px] shrink-0 overflow-auto border-r border-[#eceef2] px-3 py-4 md:block">
          <p className="px-3 pb-2 text-xs text-[#8b939c]">分类</p>
          <nav className="flex flex-col gap-1">
            {sections.map(({ category, cards }) => {
              const Icon = ICONS[category.id] ?? LayoutGrid;
              const on = current === category.id;
              const count = countRows(cards).total;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => openSection(category.id)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] ${pressable} ${
                    on ? "bg-[#f3f4f6] text-[#1b1e23]" : "text-[#3c4450] hover:bg-[#f7f8fa]"
                  }`}
                >
                  <Icon className="size-4 shrink-0 text-[#6d7682]" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1 truncate">{category.name}</span>
                  <span className="tabular-nums text-xs text-[#8b939c]">{count}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 py-8 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:pr-10 md:pl-10">
          <section className="border-b border-[#eceef2] pb-8">
            <p className="text-xs font-medium tracking-[0.14em] text-[#ef3124]">条目合计</p>
            <p className="mt-3 text-6xl font-semibold tracking-tight tabular-nums">{totals.total}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8b939c]">
              把「设计标准与指南、设计资源、工程组件、工具与插件」统一收口为 HyperOS 设计开发平台，服务产设研测从选标准到合格交付
            </p>
            <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-4">
              <Figure value={totals.total} label="条目" />
              <Operator sign="=" />
              <Figure value={totals.done} label="已完成" tone="done" />
              <Operator sign="+" />
              <Figure value={totals.wip} label="进行中" tone="wip" />
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-[#5c6570]">
              <Legend color="#2fbe6a" text="已完成" />
              <Legend color="#f0b429" text="进行中" />
            </div>
          </section>

          <div className="mt-4 flex gap-2 overflow-auto pb-2 md:hidden">
            {sections.map(({ category }) => (
              <button
                key={category.id}
                type="button"
                onClick={() => openSection(category.id)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-[13px] ${pressable} ${
                  current === category.id
                    ? "bg-[#f3f4f6] text-[#1b1e23]"
                    : "text-[#5c6570] hover:bg-[#f7f8fa]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {sections.map(({ category, cards }) => {
            const counts = countRows(cards);
            return (
              <section
                key={category.id}
                id={category.id}
                data-section
                className="scroll-mt-32 border-b border-[#f0f1f4] py-10 md:scroll-mt-20"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-balance text-xl font-semibold tracking-tight">{category.name}</h2>
                    <p className="mt-1 text-sm text-[#8b939c]">{category.summary}</p>
                  </div>
                  <p className="shrink-0 tabular-nums leading-none">
                    <span className="text-4xl font-semibold tracking-tight">{counts.total}</span>
                    <span className="ml-1 text-sm text-[#8b939c]">条</span>
                  </p>
                </div>
                <CardGrid cards={cards} />
              </section>
            );
          })}

          {sections.length === 0 ? (
            <div className="max-w-md py-16">
              <h2 className="text-balance text-xl font-semibold tracking-tight">这个状态下还没有条目</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#8b939c]">
                当前筛选没有匹配的分类。可以改看全部条目。
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`mt-6 h-11 rounded-lg bg-[#f3f4f6] px-4 text-[13px] text-[#1b1e23] ${pressable}`}
              >
                查看全部
              </button>
            </div>
          ) : null}

          <p className="max-w-2xl py-8 text-xs leading-6 text-[#8b939c]">
            页面文字来自《HyperOS 设计与开发平台全景图》里的一张总表。飞书子页、组件规格、示意图、链接、负责人和时间不在这份数据里。「㝵航」「Empty Stat」按原文显示。原文里的「已有」显示为「已完成」。子分类标了「进行中」、条目本身没写状态的，显示为「进行中」。
          </p>
        </main>
      </div>
    </div>
  );
}

function Figure({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone?: "done" | "wip";
}) {
  const color = tone === "done" ? "text-[#178a45]" : tone === "wip" ? "text-[#9a6230]" : "text-[#1b1e23]";
  return (
    <div>
      <p className={`text-[28px] font-semibold leading-none tracking-tight tabular-nums ${color}`}>{value}</p>
      <p className="mt-2 text-xs text-[#8b939c]">{label}</p>
    </div>
  );
}

function Operator({ sign }: { sign: string }) {
  return <span className="pb-5 text-2xl font-medium text-[#c5cad1]">{sign}</span>;
}

function Legend({ color, text }: { color: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="pointer-events-none size-2 rounded-full" aria-hidden="true" style={{ background: color }} />
      {text}
    </span>
  );
}

function isLeafCard(card: CardModel) {
  return card.rows.length === 1 && card.rows[0].name === card.name;
}

function CardGrid({ cards }: { cards: CardModel[] }) {
  const leaves = cards.filter(isLeafCard);
  const listed = cards.filter((card) => !isLeafCard(card));

  if (leaves.length < 3) {
    return (
      <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <MetricCard key={card.key} card={card} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {listed.length ? (
        <div className={`grid items-stretch gap-4 ${listed.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {listed.map((card) => (
            <MetricCard key={card.key} card={card} />
          ))}
        </div>
      ) : null}
      <div className="grid items-stretch gap-4 xl:grid-cols-3">
        {leaves.map((card) => (
          <MetricCard key={card.key} card={card} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ card }: { card: CardModel }) {
  const done = card.rows.filter((row) => row.status === "已完成").length;
  const wip = card.rows.length - done;
  const total = card.rows.length;
  const single = total === 1 && card.rows[0].name === card.name;
  const tone = done === total ? "#178a45" : wip === total ? "#9a6230" : "#1b1e23";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#e6e8ec] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-balance text-[15px] font-semibold leading-snug">{card.name}</h3>
          {card.summary ? <p className="mt-1 text-xs leading-5 text-[#8b939c]">{card.summary}</p> : null}
        </div>
        <p className="shrink-0 text-xs tabular-nums text-[#8b939c]">{total} 条</p>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[32px] font-semibold leading-none tracking-tight tabular-nums" style={{ color: tone }}>
            {total}
          </p>
          <p className="mt-2 text-xs text-[#8b939c]">{done === total ? "已完成" : wip === total ? "进行中" : "条目"}</p>
        </div>
        <p className="pb-1 text-xs tabular-nums text-[#8b939c]">
          <span className="text-[#178a45]">已完成 {done}</span>
          <span className="mx-1.5 text-[#d5d8de]">·</span>
          <span className="text-[#9a6230]">进行中 {wip}</span>
        </p>
      </div>

      <div
        className="pointer-events-none mt-3 flex h-1.5 overflow-hidden rounded-full bg-[#eceff3]"
        aria-hidden="true"
      >
        <span className="h-full bg-[#2fbe6a]" style={{ width: `${(done / total) * 100}%` }} />
        <span className="h-full bg-[#f0b429]" style={{ width: `${(wip / total) * 100}%` }} />
      </div>

      {single ? (
        <div className="mt-4">
          <DetailBits row={card.rows[0]} includeEn />
          <div className="mt-3">
            <StatusPill status={card.rows[0].status} />
          </div>
        </div>
      ) : (
        <ul className="mt-4 border-t border-[#f2f3f5]">
          {card.rows.map((row) => (
            <li
              key={row.key}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-[#f2f3f5] py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-5">
                  {row.name}
                  {row.en ? <span className="ml-2 font-normal text-[#8b939c]">{row.en}</span> : null}
                </p>
                <DetailBits row={row} />
              </div>
              <StatusPill status={row.status} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function DetailBits({
  row,
  includeEn = false,
}: {
  row: { en?: string; points?: string[]; pairedName?: string; note?: string };
  includeEn?: boolean;
}) {
  const bits = [
    includeEn ? row.en : null,
    row.points?.length ? row.points.join(" · ") : null,
    row.pairedName ? `配对 ${row.pairedName}` : null,
    row.note,
  ].filter(Boolean);
  if (!bits.length) return null;
  return <p className="mt-1 text-xs leading-5 text-[#8b939c]">{bits.join("  ·  ")}</p>;
}

function StatusPill({ status }: { status: Status }) {
  const done = status === "已完成";
  return (
    <span
      className={`inline-flex h-[22px] items-center rounded-full px-2 text-xs font-medium ${
        done ? "bg-[#e7f6ee] text-[#178a45]" : "bg-[#f8f1e4] text-[#9a6230]"
      }`}
    >
      {status}
    </span>
  );
}
