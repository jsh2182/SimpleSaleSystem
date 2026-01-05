// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../store/user/userSlice";
// import Dashboard from "./dashboard/Dashboard";
import Row from "../components/layout/Row";
import Button from "../components/Button";
import { FaBoxOpen, FaFileAlt, FaFileInvoice } from "react-icons/fa";
import {
  FaBox,
  FaPeopleGroup,
  FaPersonCirclePlus,
  FaUserGear,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import SearchInvoices from "./invoice/SearchInvoices";
import { useSelector } from "react-redux";

export default function Home() {
  // const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const navigate = useNavigate();

  return (
    <>
      <Row mode="flex" className="justify-center gap-1 mt-2">
        {user.uName === "super" && (
          <>
            <Button
              color="gray"
              icon={FaBoxOpen}
              onClick={() => navigate("/products/new")}
            >
              محصول جدید
            </Button>
            <Button
              color="gray"
              icon={FaBox}
              onClick={() => navigate("/products/list")}
            >
              فهرست محصولات
            </Button>
          </>
        )}
        <Button
          color="gray"
          icon={FaPersonCirclePlus}
          onClick={() => navigate("/person/new")}
        >
          مشتری جدید
        </Button>
        <Button
          color="gray"
          icon={FaPeopleGroup}
          onClick={() => navigate("/person/search")}
        >
          فهرست مشتریان
        </Button>
        <Button
          color="gray"
          icon={FaFileInvoice}
          onClick={() => navigate("/invoice/new")}
        >
          فاکتور جدید
        </Button>

        {user.uName === "super" && (
          <>
            <Button
              color="gray"
              icon={FaFileAlt}
              onClick={() => navigate("/invoice/defaultDesc")}
            >
              شرح پیش فرض فاکتور
            </Button>
            <Button
              color="gray"
              icon={FaUserGear}
              onClick={() => navigate("/users/list")}
            >
              مدیریت کاربران
            </Button>
          </>
        )}
      </Row>
      <SearchInvoices />
    </>
  );
}
