import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layouts from "../layouts/Layout";
import NotFound from "../pages/not-found/NotFound";
import { RouterLinks } from "../const/RouterLinks";
import Doanhthu from "../pages/baocao/Doanhthu";
import Mathang from "../pages/baocao/MatHang";
import Khohang from "../pages/baocao/KhoHang";
import TaiChinh from "../pages/baocao/TaiChinh";
import DanhSachSanPham from "../pages/mathang/DanhSachSanPham/DanhSachSanPham";
import DanhMuc from "../pages/mathang/danhmuc/DanhMucHang";
import Combo from "../pages/mathang/combo/Combo";
import DatBan from "../pages/datban/DatBan";
import DanhSachKhachHang from "../pages/khachhang/danhsachkhachhang";
import DanhSachNhaCC from "../pages/khachhang/danhsachnhacc";
import TonKho from "../pages/kho/TonKho";
import NhapKho from "../pages/kho/nhapkho/NhapKho";
import KiemKe from "../pages/kho/KiemKe";
import KhuyenMai from "../pages/khuyenmai/KhuyenMai";
import Employee from "../pages/employee";
import HoaDon from "../pages/hoadon/DanhSachHoaDon";
import QuanLyDatBan from "../pages/ban/QuanLyBan";
import WorkShift from "../pages/workshift/workshift";
import ThanhToanHoaDon from "../pages/hoadon/ThanhToanHoaDon";
export const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Layouts />,
    errorElement: <NotFound />,
    children: [
      {
        path: RouterLinks.BAO_CAO_DOANH_THU,
        element: <Doanhthu />,
      },
      {
        path: RouterLinks.BAO_CAO_MAT_HANG,
        element: <Mathang />,
      },
      {
        path: RouterLinks.BAO_CAO_KHO_HANG,
        element: <Khohang />,
      },
      {
        path: RouterLinks.BAO_CAO_TAI_CHINH,
        element: <TaiChinh />,
      },
      {
        path: RouterLinks.BAO_CAO_NHAN_VIEN,
        element: <Employee />,
      },
      // {
      //   path: RouterLinks.MAT_HANG,
      //   element: <DanhSachHang />,
      // },

      {
        path: RouterLinks.DS_MAT_HANG,
        element: <DanhSachSanPham />,
      },
      {
        path: RouterLinks.DANH_MUC,
        element: <DanhMuc />,
      },
      {
        path: RouterLinks.COMBO,
        element: <Combo />,
      },
      {
        path: RouterLinks.BAN,
        element: <QuanLyDatBan />,
      },
      {
        path: RouterLinks.CA_LAM,
        element: <WorkShift />,
      },
      {
        path: RouterLinks.KHO_HANG,
        element: <TonKho />,
      },
      {
        path: RouterLinks.NHAP_KHO,
        element: <NhapKho />,
      },
      {
        path: RouterLinks.KIEM_KE,
        element: <KiemKe />,
      },
      {
        path: RouterLinks.HOA_DON,
        element: <HoaDon />,
      },
      {
        path: RouterLinks.THANH_TOAN_HOA_DON,
        element: <ThanhToanHoaDon />,
      },
      {
        path: RouterLinks.DANH_SACH_KHACH_HANG,
        element: <DanhSachKhachHang />,
      },
      {
        path: RouterLinks.DANH_SACH_NHA_CC,
        element: <DanhSachNhaCC />,
      },
    ],
  },
]);
