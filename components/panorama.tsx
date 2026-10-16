"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  LayoutGrid,
  ListChecks,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  Puzzle,
  Shapes,
  SlidersHorizontal,
  TabletSmartphone,
  Type,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  cardsFor,
  countRows,
  data,
  orderedCategories,
  type CardModel,
  type Category,
  type Status,
} from "@/lib/model";

const ROW_ICONS: Record<string, LucideIcon> = {
  "Figma UI Kit": LayoutGrid,
  "Figma 设计变量": Palette,
  "字体 MiSans 库": Type,
  "字体图标 Symbol 库": Shapes,
  "Figma 插件": Puzzle,
  "Design Token 管理平台": SlidersHorizontal,
  "规范检查插件": ListChecks,
  "字体图标平台": Type,
};

const LEAF_ROWS = new Set(["kits", "plugins"]);

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

const PILLARS: { name: string; summary: string; categoryIds: string[] }[] = [
  {
    name: "设计标准与指南",
    summary: "判断怎么做的原则与规范",
    categoryIds: ["principles", "experience", "patterns", "input", "components", "devices"],
  },
  {
    name: "设计资源",
    summary: "可直接取用的设计文件",
    categoryIds: ["kits"],
  },
  {
    name: "工具与插件",
    summary: "设计工具与系统能力",
    categoryIds: ["plugins", "platform"],
  },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b1e23]";

const selectable = `font-medium ${focusRing}`;

const pressable = `font-medium transition-[scale] duration-150 ease-out active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100 ${focusRing}`;

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

  function openSection(id: string, event: { detail: number }) {
    setCurrent(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fromKeyboard = event.detail === 0;
    document.getElementById(id)?.scrollIntoView({
      behavior: reduce || fromKeyboard ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-header flex flex-wrap items-center gap-x-6 gap-y-3 border-b-[length:var(--border-hairline)] border-[#eceef2] bg-white py-3 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:h-16 md:flex-nowrap md:py-0">
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
        <div className="flex w-full rounded-xl bg-white p-1 shadow-raised md:ml-auto md:w-auto">
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
                className={`h-11 flex-1 rounded-lg px-3 text-[13px] md:flex-none ${selectable} ${
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

      <section className="bg-[var(--summary-surface)]">
        <div className="py-10 pr-[max(1.5rem,env(safe-area-inset-right))] pl-[max(1.5rem,env(safe-area-inset-left))] md:px-10 md:py-12">
          <p className="text-xs font-medium tracking-[0.14em] text-[#ef3124]">条目合计</p>
          <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="text-6xl font-semibold leading-none tracking-tight tabular-nums">{totals.total}</p>
            <p className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-xl font-semibold leading-none tracking-tight tabular-nums">
              <span className="font-medium text-[#c5cad1]">=</span>
              <span className="text-[#178a45]">{totals.done}</span>
              <span className="text-sm font-medium text-[#178a45]">已完成</span>
              <span className="font-medium text-[#c5cad1]">+</span>
              <span className="text-[#9a6230]">{totals.wip}</span>
              <span className="text-sm font-medium text-[#9a6230]">进行中</span>
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#8b939c]">
            把「设计标准与指南、设计资源、工具与插件」统一收口为 HyperOS 设计开发平台，服务产设研测从选标准到合格交付
          </p>
          <Overview sections={sections} current={current} onOpen={openSection} />
        </div>
      </section>

      <main className="pt-16 pr-[max(1.5rem,env(safe-area-inset-right))] pb-8 pl-[max(1.5rem,env(safe-area-inset-left))] md:px-10">
          {sections.map(({ category, cards }) => {
            const counts = countRows(cards);
            return (
              <section
                key={category.id}
                id={category.id}
                data-section
                className="scroll-mt-32 border-b-[length:var(--border-hairline)] border-[#f0f1f4] py-10 first:pt-0 md:scroll-mt-20"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-balance text-xl font-semibold tracking-tight">
                      {category.name}
                      {category.en ? (
                        <span className="ml-2 text-base font-normal text-[#8b939c]">{category.en}</span>
                      ) : null}
                    </h2>
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
  );
}

function Overview({
  sections,
  current,
  onOpen,
}: {
  sections: { category: Category; cards: CardModel[] }[];
  current: string;
  onOpen: (id: string, event: { detail: number }) => void;
}) {
  const byId = new Map(sections.map((section) => [section.category.id, section]));

  return (
    <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
      {PILLARS.map((pillar) => {
        const items = pillar.categoryIds.flatMap((id) => {
          const section = byId.get(id);
          return section ? [section] : [];
        });
        const total = items.reduce((sum, item) => sum + countRows(item.cards).total, 0);
        return (
          <section key={pillar.name} className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-raised" aria-label={pillar.name}>
            <div className="flex items-start justify-between gap-4 px-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight">{pillar.name}</h2>
                <p className="mt-1 text-xs leading-5 text-[#8b939c]">{pillar.summary}</p>
              </div>
              <p className="shrink-0 text-[32px] font-semibold leading-none tracking-tight tabular-nums">{total}</p>
            </div>
            {items.length ? (
              <div className="mt-5 flex flex-1 flex-col gap-1">
                {items.flatMap(({ category, cards }) => {
                  const entries = LEAF_ROWS.has(category.id)
                    ? cards.map((card) => ({
                        key: card.key,
                        id: category.id,
                        name: card.name,
                        en: card.en,
                        summary: card.summary,
                        counts: countRows([card]),
                        icon: ROW_ICONS[card.name] ?? LayoutGrid,
                      }))
                    : [
                          {
                            key: category.id,
                            id: category.id,
                            name: category.name,
                            en: category.en,
                            summary: category.summary,
                            counts: countRows(cards),
                            icon: ICONS[category.id] ?? LayoutGrid,
                          },
                        ];
                  return entries.map((entry) => {
                    const Icon = entry.icon;
                    const on = current === entry.id && !LEAF_ROWS.has(category.id);
                    return (
                      <button
                        key={entry.key}
                        type="button"
                        aria-current={on ? "true" : undefined}
                        onClick={(event) => onOpen(entry.id, event)}
                        className={`grid min-h-11 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 rounded-xl px-2 py-2.5 text-left ${selectable} ${
                          on ? "bg-[#f3f4f6]" : "hover:bg-[#f7f8fa]"
                        }`}
                      >
                        <Icon className="mt-0.5 size-4 text-[#6d7682]" strokeWidth={1.75} />
                        <span className="min-w-0">
                          <span className="block text-[13px] leading-5 text-[#1b1e23]">
                            {entry.name}
                            {entry.en && entry.en !== entry.name ? (
                              <span className="ml-2 font-normal text-[#8b939c]">{entry.en}</span>
                            ) : null}
                          </span>
                          {entry.summary ? (
                            <span className="mt-0.5 block text-xs leading-5 text-[#8b939c]">{entry.summary}</span>
                          ) : null}
                        </span>
                        <span className="pt-0.5 text-end text-xs leading-5 whitespace-nowrap tabular-nums">
                          <span className="block text-[#178a45]">已完成 {entry.counts.done}</span>
                          <span className="block text-[#9a6230]">进行中 {entry.counts.wip}</span>
                        </span>
                      </button>
                    );
                  });
                })}
              </div>
            ) : (
              <p className="mt-3 px-2 text-xs leading-5 text-[#8b939c]">当前筛选下没有目录</p>
            )}
          </section>
        );
      })}
    </div>
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
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-raised">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-balance text-[15px] font-semibold leading-snug">
            {card.name}
            {card.en && card.en !== card.name ? (
              <span className="ml-2 text-[13px] font-normal text-[#8b939c]">{card.en}</span>
            ) : null}
          </h3>
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
          <DetailBits row={card.rows[0]} />
          <div className="mt-3">
            <StatusPill status={card.rows[0].status} />
          </div>
        </div>
      ) : (
        <ul className="mt-4 border-t-[length:var(--border-hairline)] border-[#f2f3f5]">
          {card.rows.map((row) => (
            <li
              key={row.key}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b-[length:var(--border-hairline)] border-[#f2f3f5] py-2.5 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-5">
                  {row.name}
                  {row.en && row.en !== row.name ? (
                    <span className="ml-2 font-normal text-[#8b939c]">{row.en}</span>
                  ) : null}
                </p>
                {row.summary ? <p className="mt-1 text-xs leading-5 text-[#8b939c]">{row.summary}</p> : null}
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
}: {
  row: { points?: string[]; pairedName?: string; note?: string };
}) {
  const bits = [
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
