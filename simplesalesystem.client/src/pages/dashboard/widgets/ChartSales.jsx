import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "شنبه", sales: 12000000 },
  { day: "یکشنبه", sales: 14500000 },
  { day: "دوشنبه", sales: 9600000 },
  { day: "سه‌شنبه", sales: 12300000 },
  { day: "چهارشنبه", sales: 18000000 },
  { day: "پنجشنبه", sales: 15000000 },
  { day: "جمعه", sales: 20000000 },
];

export default function ChartSales() {
  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <div className="mb-4 text-gray-700 font-semibold">نمودار فروش هفتگی</div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#6366f1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from "recharts";
// import axios from "axios";

// export default function ChartWeeklySales() {
//   const [data, setData] = useState([]);
//   const [accessDenied, setAccessDenied] = useState(false);

//   useEffect(() => {
//     axios.get("/api/dashboard/weekly-sales")
//       .then((res) => setData(res.data))
//       .catch((err) => {
//         if (err.response?.status === 403 || err.response?.data === "Access Denied") {
//           setAccessDenied(true);
//         }
//       });
//   }, []);

//   if (accessDenied || data.length === 0) return null;

//   return (
//     <div className="bg-white p-4 shadow rounded-xl">
//       <div className="mb-4 text-gray-700 font-semibold">نمودار فروش هفتگی</div>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="day" />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
