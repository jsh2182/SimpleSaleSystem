import ErrorBoundary from "../../components/ErrorBoundry";
import SearchTable from "../../components/SearchTable";
import MessageNotifier from "../../components/MessageNotifier";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  useLazyGetAllInvoiceDescsQuery,
  useDeleteMutation,
  useCreateMutation,
} from "../../store/invoiceDefaultDesc/invoiceDefaultDescApi";
import { apiModalResultType } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import InputField from "../../components/form/InputField";
import { FaCheck, FaCheckSquare } from "react-icons/fa";

const columns = [
  {
    type: "string",
    name: "description",
    order: 3,
    maxLength: 100,
    label: "شرح فاکتور",
  },
];
export default function InvoiceDefaultDescription() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const tableRef = useRef(null);
  const [newDesc, setNewDesc] = useState(null);
  const [deleteDesc, { isLoading: loadingDeleteDesc, error: errorDeleteDesc }] =
    useDeleteMutation();
  const [
    createDesc,
    {
      isLoading: loadingCreateDesc,
      error: errorCreateDesc,
      reset: resetCreateDesc,
    },
  ] = useCreateMutation();
  const closeModalError = () => {
    setMessage(null);
  };
  const deleteRow = async (row) => {
    if (loadingDeleteDesc) {
      return;
    }
    await deleteDesc(row.id).unwrap();
    setMessage({
      title: "حذف شرح فاکتور",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
  };
  const showDeleteConfirm = (row) => {
    setMessage({
      title: `حذف شرح فاکتور`,
      type: apiModalResultType.confirm,
      text: "آیا از حذف مطمئن هستید؟",
      onConfirm: () => deleteRow(row),
    });
  };
  const fetchData = (filters) => {
    tableRef.current.fetchData(filters);
  };
  const handleNewDesc = async () => {
    if (!newDesc || newDesc === "" || loadingCreateDesc) {
      return;
    }
    await createDesc({ description: newDesc }).unwrap();
    setMessage({
      title: "شرح جدید فاکتور",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
    resetCreateDesc();
    setNewDesc(null);
  };
  const handleNewDescKeyDown =(e)=>{
    if(e.key?.toLowerCase() === "enter")
    {
      handleNewDesc();
    }
  }
  const onError = useEffectEvent((error) => {
    setMessage({
      title: "حذف شرح فاکتور",
      type: apiModalResultType.error,
      text: error,
    });
  });
  useEffect(() => {
    if (errorDeleteDesc || errorCreateDesc) {
      onError(errorDeleteDesc || errorCreateDesc);
    }
  }, [errorDeleteDesc, errorCreateDesc]);
  useEffect(() => {
    fetchData({});
  }, []);
  return (
    <ErrorBoundary>
      <Modal show={true} size="3xl" onClose={() => navigate(-1)}>
        <Modal.Header>شرح پیش فرض فاکتور</Modal.Header>
        <Modal.Body>
          <main className="px-4 py-8">
            <MessageNotifier message={message} onClose={closeModalError} />
            <InputField
              type="text"
              defaultValue={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              label="شرح پیش فرض"
              buttonIcon={FaCheckSquare}
              onButtonClick={handleNewDesc}
              onKeyDown = {handleNewDescKeyDown}
            />
            <SearchTable
              ref={tableRef}
              columns={columns}
              dataSource={{
                type: "state",
                fetchHook: useLazyGetAllInvoiceDescsQuery,
              }}
              pagination={{ enabled: false }}
              actions={[
                {
                  label: "حذف",
                  icon: "🗑️",
                  onClick: showDeleteConfirm,
                },
              ]}
              isMobile={false}
              showPrintButton={false}
              showExcelButton={false}
            />
          </main>
        </Modal.Body>
      </Modal>
    </ErrorBoundary>
  );
}
