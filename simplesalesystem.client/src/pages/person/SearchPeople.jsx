import { FaSearch } from "react-icons/fa";
import ErrorBoundary from "../../components/ErrorBoundry";
import SubmitForm from "../../components/form/SubmitForm";
import SearchTable from "../../components/SearchTable";
import MessageNotifier from "../../components/MessageNotifier";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  useDeleteMutation,
  useLazyGetAllQuery,
} from "../../store/person/personApi";
import { apiModalResultType } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

const columns = [
  //   {
  //     type: "string",
  //     name: "barCode",
  //     order: 1,
  //     maxLength: 20,
  //     label: "بار کد مشتری",
  //   },
  //   {
  //     type: "number",
  //     name: "personCode",
  //     order: 2,
  //     maxLength: 20,
  //     label: " کد مشتری",
  //   },
  {
    type: "string",
    name: "personName",
    order: 3,
    maxLength: 20,
    label: "نام مشتری",
  },
  {
    type: "string",
    name: "callerName",
    order: 3,
    maxLength: 20,
    label: "نام تماس گیرنده",
  },
  {
    type: "string",
    name: "mobile",
    order: 3,
    maxLength: 20,
    label: "شماره همراه",
  },
  {
    type: "string",
    name: "phone",
    order: 3,
    maxLength: 20,
    label: "شماره تلفن",
  },
  //   {
  //     type: "string",
  //     name: "personModel",
  //     order: 4,
  //     maxLength: 20,
  //     label: "مدل مشتری",
  //   },
];
export default function SearchPeople() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const tableRef = useRef(null);
  const [
    deletePerson,
    { isLoading: loadingDeletePerson, error: errorDeletePerson },
  ] = useDeleteMutation();
  const searchFields = [
    // {
    //   name: "barCode",
    //   type: "text",
    //   title: "بارکد مشتری",
    //   len: "md:2",
    // },
    // {
    //   name: "personCode",
    //   type: "number",
    //   title: "کد مشتری",
    //   len: "md:6",
    // },
    {
      name: "personName",
      type: "text",
      title: "نام مشتری",
      len: "md:6",
    },
    // {
    //   name: "personModel",
    //   type: "text",
    //   title: "مدل مشتری",
    //   len: "md:2",
    // },
  ];
  const closeModalError = () => {
    setMessage(null);
  };
  const deleteRow = async (row) => {
    if (loadingDeletePerson) {
      return;
    }
    await deletePerson(row.id).unwrap();
    setMessage({
      title: "حذف مشتری",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
  };
  const showDeleteConfirm = (row) => {
    setMessage({
      title: `حذف ${row.personName}`,
      type: apiModalResultType.confirm,
      text: "آیا از حذف مطمئن هستید؟",
      onConfirm: () => deleteRow(row),
    });
  };
  const fetchData = (filters) => {
    tableRef.current.fetchData(filters);
  };
  const gotoPerson = (row) => {
    navigate(`/person/${row.id}`);
  };
  const onError = useEffectEvent((error) => {
    setMessage({
      title: "حذف مشتری",
      type: apiModalResultType.error,
      text: error,
    });
  });
  useEffect(() => {
    if (errorDeletePerson) {
      onError(errorDeletePerson);
    }
  }, [errorDeletePerson]);
  useEffect(() => {
    fetchData({});
  }, []);
  return (
    <ErrorBoundary>
      <Modal show={true} size="4xl" onClose={() => navigate(-1)}>
        <Modal.Header>جستجوی مشتریان</Modal.Header>
        <Modal.Body>
          <main className="px-4 py-8">
            <MessageNotifier message={message} onClose={closeModalError} />
            {/* <SubmitForm
              onSubmit={fetchData}
              fields={searchFields}
              formTitle="جستجوی مشتریات"
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
                reducerName: "person",
                filterObjectName: "searchPersonsFilters",
              }}
              //filters={filters}
              exportApiUrl="/api/Person/GetALL"
              pagination={{ enabled: false }}
              actions={[
                {
                  label: "ویرایش",
                  icon: "✏️",
                  onClick: gotoPerson,
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
