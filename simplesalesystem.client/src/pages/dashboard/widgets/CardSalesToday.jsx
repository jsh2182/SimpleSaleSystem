import { useEffect, useState } from "react";
import DashboardCard, { cardValueType } from "./DashboardValueCard";

export default function CardSalesToday() {
  const [data, setData] = useState({ amount: 2500000 });

  // useEffect(() => {
  //   const controller = new AbortController();

  //   callApiSimple(
  //     "get",
  //     "/api/dashboard/tickets-summary",
  //     null,
  //     (res) => setData(res.data),
  //     (err) => {
  //       if (err === "Access Denied") setData(null);
  //       else console.error("خطا در دریافت اطلاعات تیکت‌ها:", err);
  //     },
  //     controller.signal
  //   );

  //   return () => controller.abort();
  // }, []);

  if (!data) return null;

  return (
    <DashboardCard
      title="فروش امروز"
      value={`${data.amount} ریال`}
      valueType={cardValueType.currency}
    />
  );
}
