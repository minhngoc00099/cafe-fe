import React from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux';
import './App.css';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { router } from './routes';
import { RouterLinks } from './const/RouterLinks';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Combo from './pages/mathang/combo/Combo';
import DanhMucHang from './pages/mathang/danhmuc/DanhMucHang';
import DanhSachSanPham from './pages/mathang/DanhSachSanPham/DanhSachSanPham';
import KhuyenMai from './pages/khuyenmai/KhuyenMai';
import DanhSachKhachHang from './pages/khachhang/danhsachkhachhang';
import DanhSachNhaCC from './pages/khachhang/danhsachnhacc';
import TonKho from './pages/kho/TonKho';
import NhapKho from './pages/kho/nhapkho/NhapKho';
import KiemKe from './pages/kho/KiemKe';
import HoaDon from './pages/hoadon/DanhSachHoaDon';
import ThanhToanHoaDon from './pages/hoadon/ThanhToanHoaDon';
import Layout from './layouts/Layout';
import Employee from './pages/employee';
import OrderPage from './pages/order-page';
import ChefPage from './pages/chef-page';
import QuanLyDatBan from './pages/ban/QuanLyBan';
import Workshift from './pages/workshift/workshift';
import { AppContext, socket } from './context/appContext';
import OverViewPage from './pages/home/overview-page';
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
           <AppContext.Provider value={{socket}} >
           <div className='MainApp'>

              <div className='ContentApp'>
                <Routes>
                  <Route path={RouterLinks.LOGIN} element={<Login />} />
                  <Route path={RouterLinks.REGISTER} element={<Register />} />
                  <Route path={RouterLinks.HOME_PAGE} element={<Layout />}>      
                  <Route path={RouterLinks.TONG_QUAN} element={<Suspense fallback={null}><OverViewPage /></Suspense>} /> 
                    <Route path={RouterLinks.COMBO} element={<Suspense fallback={null}><Combo /></Suspense>} />
                    <Route path={RouterLinks.DANH_MUC} element={<Suspense fallback={null}><DanhMucHang /></Suspense>} />
                    <Route path={RouterLinks.BAN} element={<Suspense fallback={null}><QuanLyDatBan /></Suspense>} />
                    <Route path={RouterLinks.DS_MAT_HANG} element={<Suspense fallback={null}><DanhSachSanPham /></Suspense>} />
                    <Route path={RouterLinks.KHUYEN_MAI} element={<Suspense fallback={null}><KhuyenMai /></Suspense>} />
                    <Route path={RouterLinks.KHO_HANG} element={<Suspense fallback={null}><TonKho /></Suspense>} />
                    <Route path={RouterLinks.CA_LAM} element={<Suspense fallback={null}><Workshift /></Suspense>} />
                    <Route path={RouterLinks.KIEM_KE} element={<Suspense fallback={null}><KiemKe /></Suspense>} />
                    <Route path={RouterLinks.NHAP_KHO} element={<Suspense fallback={null}><NhapKho /></Suspense>} />
                    <Route path={RouterLinks.HOA_DON} element={<Suspense fallback={null}><HoaDon /></Suspense>} />
                    <Route path={RouterLinks.DANH_SACH_KHACH_HANG} element={<Suspense fallback={null}><DanhSachKhachHang /></Suspense>} />
                    <Route path={RouterLinks.DANH_SACH_NHA_CC} element={<Suspense fallback={null}><DanhSachNhaCC/></Suspense>} />
                    <Route path={RouterLinks.THANH_TOAN_HOA_DON} element={<Suspense fallback={null}><ThanhToanHoaDon /></Suspense>} />
                 
                    <Route path={RouterLinks.BAO_CAO_NHAN_VIEN} element={<Suspense fallback={null}><Employee /></Suspense>} />

                  </Route>
                  <Route path={RouterLinks.ORDER_PAGE} element={<Suspense fallback={null}><OrderPage /></Suspense>}  />
                  <Route path={RouterLinks.CHEF_PAGE} element={<Suspense fallback={null}><ChefPage /></Suspense>}  />


                </Routes>

              </div>
              </div>
           </AppContext.Provider>
        </PersistGate>
      </BrowserRouter>

    </Provider>
  );
}

export default App;
