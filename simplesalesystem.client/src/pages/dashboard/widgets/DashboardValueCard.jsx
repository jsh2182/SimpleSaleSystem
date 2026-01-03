export default function DashboardValueCard({ title, value, valueType }) {

  return (
    <div className="bg-white shadow rounded-xl p-4 text-right">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xl font-bold mt-2">
        {valueType === cardValueType.currency ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
export   const cardValueType = { currency: "currency" };

