import { RESULT_TITLE, STATUS_TITLE, type Order } from "@/lib/store";

const CLS: Record<string, string> = { Оригинал: "original", Реплика: "replica", "Нужны доп. фото": "need", "Невозможно определить": "unknown" };

export function Verdict({ value, large }: { value: string; large?: boolean }) {
  return <span className={`verdict verdict--${CLS[value] ?? "wait"} ${large ? "verdict--lg" : ""}`}>{value}</span>;
}

export function OrderBadge({ order, large }: { order: Order; large?: boolean }) {
  return <Verdict large={large} value={order.status === "done" && order.result ? RESULT_TITLE[order.result] : STATUS_TITLE[order.status]} />;
}
