// import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import axios from "axios";

const COLORS = ["#facc15", "#60a5fa", "#4ade80"];

export default function PieRequestsStatus() {
  // const [data, setData] = useState([
  //   { value: 10, label: "منتظر پذیرش" },
  //   { value: 50, label: "پذیرش شده" },
  //   { value: 35, label: "اعزام شد" },
  // ]);
  //const [accessDenied, setAccessDenied] = useState(false);

  //   useEffect(() => {
  //     axios
  //       .get("/api/dashboard/request-status")
  //       .then((res) => setData(res.data))
  //       .catch((err) => {
  //         if (
  //           err.response?.status === 403 ||
  //           err.response?.data === "Access Denied"
  //         ) {
  //           setAccessDenied(true);
  //         }
  //       });
  //   }, []);

  // if (data.length === 0) return null;

  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <div className="mb-4 text-gray-700 font-semibold">
        درخواست‌ها به تفکیک وضعیت
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={{}}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {[].map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
