import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useLazyFetchUserListQuery,
  useUpdateMeMutation,
  useUpdateUserMutation,
} from "../../store/user/userAPI";
import { apiModalResultType } from "../../utils/apiHelper";
import SubmitForm from "../../components/form/SubmitForm";
import MessageNotifier from "../../components/MessageNotifier";
import ErrorBoundary from "../../components/ErrorBoundry";
import Modal from "../../components/Modal";
import SearchTable from "../../components/SearchTable";
import { FaArrowLeft, FaCheck, FaPlusSquare } from "react-icons/fa";

const columns = [
  {
    type: "string",
    name: "userFullName",
    order: 1,
    maxLength: 20,
    label: "نام کامل کاربر",
  },
  {
    type: "string",
    name: "userName",
    order: 2,
    maxLength: 20,
    label: "نام کاربری",
  },
  { type: "boolean", name: "isActive", order: 3, label: "فعال" },
];

export default function UserList() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const tableRef = useRef(null);
  const extraButtons = [
    {
      text: "انصراف",
      onClick: () => {
        setSelectedUser(null);
      },
      color: "danger",
      icon: <FaArrowLeft />,
    },
  ];
  const fields = [
    { name: "ID", title: "", type: "hidden" },
    {
      name: "UserFullName",
      title: "نام کامل کاربر",
      type: "text",
      len: "md:3",
      readOnly: Number(selectedUser?.id) > 0,
      required: "نام کامل کاربر الزامی است",
    },
    {
      name: "UserName",
      title: "نام کاربری",
      type: "text",
      len: "md:3",
      readOnly: Number(selectedUser?.id) > 0,
      required: "نام کاربری الزامی است",
      pattern: /^[A-Za-z0-9\s.,!?-]*$/,
      patternMessage: "تنها حروف انگلیسی مجاز است.",
    },
    {
      name: "IsActive",
      title: "وضعیت فعالیت",
      type: "select",
      len: "md:3",
      displayName: "title",
      valueName: "value",
      options: [
        { value: true, title: "فعال است" },
        { value: false, title: "غیرفعال است" },
      ],
    },
  ];
  const [deleteUser, { isLoading: loadingDeleteUser, error: errorDeleteUser }] =
    useDeleteUserMutation();
  const [
    createUser,
    { isFetching: loadingCreateUser, error: errorCreateUser },
  ] = useCreateUserMutation();
  const [updateUser, { isLoading: loadingUpdateUser, error: errorUpdateUser }] =
    useUpdateUserMutation();
  const closeModalError = () => {
    setMessage(null);
  };
  const deleteRow = async (row) => {
    if (loadingDeleteUser) {
      return;
    }
    await deleteUser(row.id).unwrap();
    setMessage({
      title: "حذف کاربر",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
  };
  const showDeleteConfirm = (row) => {
    setMessage({
      title: `حذف ${row.userName}`,
      type: apiModalResultType.confirm,
      text: "آیا از حذف مطمئن هستید؟",
      onConfirm: () => deleteRow(row),
    });
  };
  const fetchData = (filters) => {
    if (tableRef.current) tableRef.current.fetchData(filters);
  };
  const showUser = (row) => {
    setSelectedUser({ ...row });
  };
  const handlePlusclick = () => {
    setSelectedUser({ id: 0, IsActive: true });
  };
  const handleSubmitUser = async (data) => {
    if (loadingCreateUser || loadingUpdateUser) {
      return;
    }
    if (!(Number(selectedUser.id) > 0)) {
      await createUser(data).unwrap();
      setMessage({
        title: "کاربر جدید",
        type: apiModalResultType.info,
        text: "عملیات با موفقیت انجام شد.",
      });
      setSelectedUser(null);
    } else {
      await updateUser(data).unwrap();
      setMessage({
        title: "ویرایش اطلاعات کاربر",
        type: apiModalResultType.info,
        text: "عملیات با موفقیت انجام شد.",
      });
      setSelectedUser(null);
    }
  };
  const onError = useEffectEvent((error) => {
    setMessage({
      title: "اطلاعات کاربر",
      type: apiModalResultType.error,
      text: error,
    });
  });

  useEffect(() => {
    const error = errorCreateUser || errorDeleteUser || errorUpdateUser;
    if (error) {
      onError(error);
    }
  }, [errorDeleteUser, errorCreateUser, errorUpdateUser]);
  useEffect(() => {
    fetchData({});
  }, []);
  return (
    <ErrorBoundary>
      <Modal
        show={true}
        size="4xl"
        onClose={() => navigate(-1)}
        rootClose={false}
      >
        <Modal.Header>فهرست کاربران</Modal.Header>
        <Modal.Body>
          <main className="px-4 py-8">
            <MessageNotifier message={message} onClose={closeModalError} />
            {selectedUser && (
              <SubmitForm
                defaultValues={selectedUser}
                fields={fields}
                extraButtons={extraButtons}
                formTitle="اطلاعات کاربر"
                isPartial={true}
                submitIcon={FaCheck}
                onSubmit={handleSubmitUser}
              />
            )}
            {/* {!selectedUser && (
              <FaPlusSquare
                size={30}
                color="#3d77b3"
                onClick={handlePlusclick}
                className="hover:brightness-75"
              />
            )} */}
            <SearchTable
              ref={tableRef}
              columns={columns}
              showPrintButton={false}
              showExcelButton={false}
              dataSource={{
                type: "state",
                fetchHook: useLazyFetchUserListQuery,
                reducerName: "user",
                filterObjectName: "searchUsersFilters",
              }}
              //filters={filters}
              exportApiUrl="/api/User/GetALL"
              pagination={{ enabled: false }}
              newRowButton={
                selectedUser ? undefined : { onClick: handlePlusclick }
              }
              actions={[
                {
                  label: "ویرایش",
                  icon: "✏️",
                  onClick: showUser,
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
