import type { ReportDataPoint, ReportTimeRange } from "../types";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateReportData(range: ReportTimeRange): ReportDataPoint[] {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const data: ReportDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const seed = d.getTime();
    data.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      orders: Math.floor(80 + seededRandom(seed) * 120),
      autopaySuccessRate: Math.round(72 + seededRandom(seed + 1) * 22),
      kycApprovalRate: Math.round(65 + seededRandom(seed + 2) * 28),
      txnSuccessRate: Math.round(78 + seededRandom(seed + 3) * 18),
    });
  }
  return data;
}

export function aggregateReport(data: ReportDataPoint[]) {
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avg = (key: keyof Omit<ReportDataPoint, "date">) =>
    Math.round(data.reduce((s, d) => s + d[key], 0) / data.length);
  return {
    totalOrders,
    autopaySuccessRate: avg("autopaySuccessRate"),
    kycApprovalRate: avg("kycApprovalRate"),
    txnSuccessRate: avg("txnSuccessRate"),
  };
}

export function reportToCsv(data: ReportDataPoint[], merchantName: string): string {
  const header = "Date,Orders,Autopay Success Rate (%),KYC Approval Rate (%),Transaction Success Rate (%)";
  const rows = data.map(
    (d) =>
      `${d.date},${d.orders},${d.autopaySuccessRate},${d.kycApprovalRate},${d.txnSuccessRate}`,
  );
  return [`Merchant,${merchantName}`, header, ...rows].join("\n");
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
