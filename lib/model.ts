import raw from "@/data/panorama.json";

export type Status = "已完成" | "进行中";

export type Item = {
  name: string;
  en?: string;
  status?: string;
  summary?: string;
  note?: string;
  points?: string[];
  paired?: { name: string; points?: string[] };
};

export type Group = {
  name: string;
  en?: string;
  summary?: string;
  status?: string;
  items?: Item[];
};

export type Category = {
  id: string;
  index: number;
  name: string;
  en?: string;
  summary: string;
  groups: Group[];
};

export type Panorama = {
  title: string;
  categories: Category[];
};

export type Row = {
  key: string;
  name: string;
  en?: string;
  summary?: string;
  note?: string;
  points?: string[];
  pairedName?: string;
  status: Status;
};

export type CardModel = {
  key: string;
  name: string;
  en?: string;
  summary?: string;
  rows: Row[];
};

export const data = raw as Panorama;

export function orderedCategories(categories: Category[]) {
  return [...categories].sort((a, b) => {
    if (a.id === "components") return -1;
    if (b.id === "components") return 1;
    return a.index - b.index;
  });
}

function labelOf(status: string | undefined, inherited?: string): Status {
  if (status === "进行中" || (!status && inherited === "进行中")) return "进行中";
  return "已完成";
}

function rowFrom(item: Item, key: string, inherited?: string): Row {
  return {
    key,
    name: item.name,
    en: item.en,
    summary: item.summary,
    note: item.note,
    points: item.points,
    pairedName: item.paired?.name,
    status: labelOf(item.status, inherited),
  };
}

export function cardsFor(category: Category, filter: Status | "all"): CardModel[] {
  const cards: CardModel[] = [];
  category.groups.forEach((group, index) => {
    const section = Array.isArray(group.items) && group.items.length > 0;
    if (section) {
      const rows = group.items!
        .map((item, itemIndex) =>
          rowFrom(item, `${category.id}-${index}-${itemIndex}`, group.status),
        )
        .filter((row) => filter === "all" || row.status === filter);
      if (rows.length) {
        cards.push({
          key: `${category.id}-${index}`,
          name: group.name,
          en: group.en,
          summary: group.summary,
          rows,
        });
      }
      return;
    }
    const row = rowFrom(group, `${category.id}-${index}`);
    if (filter === "all" || row.status === filter) {
      cards.push({
        key: row.key,
        name: group.name,
        en: group.en,
        summary: group.summary,
        rows: [row],
      });
    }
  });
  return cards;
}

export function countRows(cards: CardModel[]) {
  const rows = cards.flatMap((card) => card.rows);
  return {
    total: rows.length,
    done: rows.filter((row) => row.status === "已完成").length,
    wip: rows.filter((row) => row.status === "进行中").length,
  };
}
