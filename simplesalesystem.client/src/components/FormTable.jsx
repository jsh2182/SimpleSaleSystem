import React, { useState } from "react";

function renderInput(col, value, onChange) {
  switch (col.type) {
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="cursor-pointer"
        />
      );
    case "currency":
    case "string":
    default:
      return (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded p-2 w-full"
        />
      );
  }
}

const FormTable = ({
  columns = [],
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "ذخیره",
  cancelLabel = "لغو",
  onDelete,
  showDelete = false,
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (name, val) => {
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      {columns.map((col) => (
        <div key={col.name} className="flex flex-col">
          <label className="mb-1 font-semibold">{col.label}</label>
          {renderInput(col, formData[col.name], (val) =>
            handleChange(col.name, val)
          )}
        </div>
      ))}

      <div className="flex gap-3 justify-end">
        {showDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(formData)}
            className="px-4 py-2 border rounded border-red-600 text-red-600 hover:bg-red-100"
          >
            حذف
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded border-gray-400 hover:bg-gray-100"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default FormTable;
