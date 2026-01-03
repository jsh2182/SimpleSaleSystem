import { FaSearch } from "react-icons/fa";
import ErrorBoundary from "../../components/ErrorBoundry";
import SubmitForm from "../../components/form/SubmitForm";
import SearchTable from "../../components/SearchTable";
import MessageNotifier from "../../components/MessageNotifier";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  useDeleteMutation,
  useLazyGetAllQuery,
} from "../../store/product/productApi";
import { apiModalResultType } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

const columns = [
  //   {
  //     type: "string",
  //     name: "barCode",
  //     order: 1,
  //     maxLength: 20,
  //     label: "بار کد محصول",
  //   },
//   {
//     type: "number",
//     name: "productCode",
//     order: 2,
//     maxLength: 20,
//     label: " کد محصول",
//   },
  {
    type: "string",
    name: "productName",
    order: 3,
    maxLength: 20,
    label: "نام محصول",
  },
  //   {
  //     type: "string",
  //     name: "productModel",
  //     order: 4,
  //     maxLength: 20,
  //     label: "مدل محصول",
  //   },
];
export default function SearchProducts() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const tableRef = useRef(null);
  const [
    deleteProduct,
    { isLoading: loadingDeleteProduct, error: errorDeleteProduct },
  ] = useDeleteMutation();
//   const searchFields = [
//     // {
//     //   name: "barCode",
//     //   type: "text",
//     //   title: "بارکد محصول",
//     //   len: "md:2",
//     // },
//     // {
//     //   name: "productCode",
//     //   type: "number",
//     //   title: "کد محصول",
//     //   len: "md:6",
//     // },
//     {
//       name: "productName",
//       type: "text",
//       title: "نام محصول",
//       len: "md:6",
//     },
//     // {
//     //   name: "productModel",
//     //   type: "text",
//     //   title: "مدل محصول",
//     //   len: "md:2",
//     // },
//   ];
  const closeModalError = () => {
    setMessage(null);
  };
  const deleteRow = async (row) => {
    if (loadingDeleteProduct) {
      return;
    }
    await deleteProduct(row.id).unwrap();
    setMessage({
      title: "حذف محصول",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
  };
  const showDeleteConfirm = (row) => {
    setMessage({
      title: `حذف ${row.productName}`,
      type: apiModalResultType.confirm,
      text: "آیا از حذف مطمئن هستید؟",
      onConfirm: () => deleteRow(row),
    });
  };
  const fetchData = (filters) => {
    tableRef.current.fetchData(filters);
  };
  const gotoProduct = (row) => {
    navigate(`/products/${row.id}`);
  };
  const onError = useEffectEvent((error) => {
    setMessage({
      title: "حذف محصول",
      type: apiModalResultType.error,
      text: error,
    });
  });
  useEffect(() => {
    if (errorDeleteProduct) {
      onError(errorDeleteProduct);
    }
  }, [errorDeleteProduct]);
  useEffect(()=>{
    fetchData({});
  },[])
  return (
    <ErrorBoundary>
      <Modal show={true} size="2xl" onClose={()=>navigate(-1)}>
        <Modal.Header >جستجوی محصولات</Modal.Header>
        <Modal.Body>
          <main className="px-4 py-8">
            <MessageNotifier message={message} onClose={closeModalError} />
            {/* <SubmitForm
              onSubmit={fetchData}
              fields={searchFields}
              formTitle="جستجوی محصولات"
              submitIcon={FaSearch}
              submitText="جستجو"
              isPartial={true}
            /> */}
            <SearchTable
              ref={tableRef}
              columns={columns}
              dataSource={{
                type: "state",
                fetchHook: useLazyGetAllQuery,
                reducerName: "product",
                filterObjectName: "searchProductsFilters",
              }}
              //filters={filters}
              exportApiUrl="/api/Product/GetALL"
              pagination={{ enabled: false }}
              actions={[
                {
                  label: "ویرایش",
                  icon: "✏️",
                  onClick: gotoProduct,
                },
                {
                  label: "حذف",
                  icon: "🗑️",
                  onClick: showDeleteConfirm,
                },
              ]}
              isMobile={false}
            />
          </main>
        </Modal.Body>
      </Modal>
    </ErrorBoundary>
  );
}
