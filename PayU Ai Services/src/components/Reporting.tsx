import { useMemo, useState } from "react";
import type { ReportSchedule, ReportTimeRange } from "../types";
import {
  aggregateReport,
  downloadCsv,
  generateReportData,
  reportToCsv,
} from "../data/reportData";
import styles from "./Reporting.module.css";

const RANGE_OPTIONS: { id: ReportTimeRange; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

function scheduleKey(merchantId: string) {
  return `payu-report-schedule-${merchantId}`;
}

function loadSchedule(merchantId: string): ReportSchedule {
  try {
    const raw = localStorage.getItem(scheduleKey(merchantId));
    if (raw) return JSON.parse(raw);
  } catch {
    /* defaults */
  }
  return { emails: [], autoTrigger: false, frequency: "weekly" };
}

interface ReportingProps {
  merchantId: string;
  merchantName: string;
}

function BarChart({
  data,
  dataKey,
  color,
  label,
  suffix = "",
}: {
  data: ReturnType<typeof generateReportData>;
  dataKey: "orders" | "autopaySuccessRate" | "kycApprovalRate" | "txnSuccessRate";
  color: string;
  label: string;
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d[dataKey]), 1);
  const display = data.length > 14 ? data.filter((_, i) => i % Math.ceil(data.length / 14) === 0) : data;

  return (
    <div className={styles.chart}>
      <h4>{label}</h4>
      <div className={styles.bars}>
        {display.map((d) => (
          <div key={d.date} className={styles.barCol}>
            <div
              className={styles.bar}
              style={{ height: `${(d[dataKey] / max) * 100}%`, background: color }}
              title={`${d.date}: ${d[dataKey]}${suffix}`}
            />
            <span className={styles.barLabel}>{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reporting({ merchantId, merchantName }: ReportingProps) {
  const [range, setRange] = useState<ReportTimeRange>("30d");
  const [schedule, setSchedule] = useState<ReportSchedule>(() => loadSchedule(merchantId));
  const [emailInput, setEmailInput] = useState(schedule.emails.join(", "));
  const [saved, setSaved] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const data = useMemo(() => generateReportData(range), [range]);
  const summary = useMemo(() => aggregateReport(data), [data]);

  const saveSchedule = (next: ReportSchedule) => {
    setSchedule(next);
    localStorage.setItem(scheduleKey(merchantId), JSON.stringify(next));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = () => {
    const csv = reportToCsv(data, merchantName);
    downloadCsv(csv, `payu-report-${merchantName.replace(/\s+/g, "-")}-${range}.csv`);
  };

  const handleSaveEmails = () => {
    const emails = emailInput
      .split(/[,;\s]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    saveSchedule({ ...schedule, emails });
  };

  const handleSendNow = () => {
    const emails = schedule.emails.length ? schedule.emails : emailInput.split(/[,;\s]+/).filter((e) => e.includes("@"));
    if (!emails.length) return;
    handleDownload();
    setLastSent(`Report queued to ${emails.join(", ")} at ${new Date().toLocaleString()}`);
  };

  return (
    <div className={styles.reporting}>
      <div className={styles.toolbar}>
        <div className={styles.rangeFilter}>
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={range === r.id ? styles.rangeActive : styles.rangeBtn}
              onClick={() => setRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
          Download CSV
        </button>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <span>Total Orders</span>
          <strong>{summary.totalOrders.toLocaleString()}</strong>
        </div>
        <div className={styles.kpi}>
          <span>Autopay Success Rate</span>
          <strong>{summary.autopaySuccessRate}%</strong>
        </div>
        <div className={styles.kpi}>
          <span>KYC Approval Rate</span>
          <strong>{summary.kycApprovalRate}%</strong>
        </div>
        <div className={styles.kpi}>
          <span>Transaction Success Rate</span>
          <strong>{summary.txnSuccessRate}%</strong>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <BarChart data={data} dataKey="orders" color="#10847e" label="Orders" />
        <BarChart data={data} dataKey="autopaySuccessRate" color="#5B4FCF" label="Autopay Success Rate" suffix="%" />
        <BarChart data={data} dataKey="kycApprovalRate" color="#E8871E" label="KYC Approval Success Rate" suffix="%" />
        <BarChart data={data} dataKey="txnSuccessRate" color="#D82C51" label="Transaction Success Rate" suffix="%" />
      </div>

      <section className={styles.emailSection}>
        <h3>Email Report Delivery</h3>
        <p>Enter email IDs to receive scheduled reports. Download is triggered immediately when you send now.</p>
        <label className={styles.emailField}>
          <span>Report recipients</span>
          <input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="finance@merchant.com, ops@merchant.com"
          />
        </label>
        <div className={styles.emailActions}>
          <button type="button" className={styles.secondaryBtn} onClick={handleSaveEmails}>
            Save email list
          </button>
          <button type="button" className={styles.primaryBtn} onClick={handleSendNow}>
            Send report now
          </button>
        </div>
        {saved && <p className={styles.success}>Email list saved.</p>}
        {lastSent && <p className={styles.success}>{lastSent}</p>}

        <div className={styles.autoTrigger}>
          <label className={styles.autoRow}>
            <input
              type="checkbox"
              checked={schedule.autoTrigger}
              onChange={(e) => saveSchedule({ ...schedule, autoTrigger: e.target.checked })}
            />
            <span>Enable auto-trigger on email</span>
          </label>
          <div className={styles.freqRow}>
            <span>Frequency</span>
            <select
              value={schedule.frequency}
              onChange={(e) =>
                saveSchedule({ ...schedule, frequency: e.target.value as ReportSchedule["frequency"] })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          {schedule.autoTrigger && schedule.emails.length > 0 && (
            <p className={styles.autoNote}>
              Reports will auto-send {schedule.frequency} to: {schedule.emails.join(", ")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
