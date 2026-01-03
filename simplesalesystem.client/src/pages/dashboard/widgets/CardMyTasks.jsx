// import { useEffect, useState } from "react";
import DashboardValueCard from "./DashboardValueCard";
// import axios from "axios";

export default function CardMyTasks() {
  // const [data, setData] = useState({ count: 50 });

  // useEffect(() => {
  //   const controller = new AbortController();

  //   callApiSimple(
  //     "get",
  //     "/api/dashboard/MyTasksCount",
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

  // if (!data) return null;

  return (
    <DashboardValueCard title="ارجاع‌های من" value={`${[].count} کار فعال`} />
  );
}
