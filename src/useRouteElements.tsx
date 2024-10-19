import React, { memo, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import { AppContext } from './contexts/app.context'
import path from './constants/path'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Profile from './pages/User/pages/Profile/Profile'
import UserLayout from './pages/User/layouts/UserLayout.tsx'
import HistoryPurchase from './pages/User/pages/HistoryPurchase/HistoryPurchase.tsx'
import ChangePassword from './pages/User/pages/ChangePassword/ChangePassword.tsx'
import Shop from './pages/Shop/Shop.tsx'
import ShopLayout from './pages/ShopDashBoard/layouts/UserLayout.tsx/ShopLayout.tsx'
import ManagerBook from './pages/ShopDashBoard/pages/ManagerBook/ManagerBook.tsx'
import Order from './pages/Order/Order.tsx'
import ManagerOrder from './pages/ShopDashBoard/pages/ManagerOrder/ManagerOrder.tsx'
/**
 * Để tối ưu re-render thì nên ưu tiên dùng <Outlet /> thay cho {children}
 * Lưu ý là <Outlet /> nên đặt ngay trong component `element` thì mới có tác dụng tối ưu
 * Chứ không phải đặt bên trong children của component `element`
 */

//  ✅ Tối ưu re-render
// export default memo(function RegisterLayout({ children }: Props) {
//   return (
//     <div>
//       <RegisterHeader />
//       {children}
//       <Outlet />
//       <Footer />
//     </div>
//   )
// })

//  ❌ Không tối ưu được vì <Outlet /> đặt vào vị trí children
// Khi <Outlet /> thay đổi tức là children thay đổi
// Dẫn đến component `RegisterLayout` bị re-render dù cho có dùng React.memo như trên
// <RegisterLayout>
//   <Outlet />
// </RegisterLayout>

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // not auth -> need login
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // authed
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    // {
    //   path: '',
    //   element: <MainLayout />,
    //   children: [
    //     {
    //       path: path.productDetail,
    //       element: <ProductDetail />
    //     },
    //     {
    //       path: '',
    //       index: true,
    //       element: <ProductList />
    //     }
    //   ]
    // },

    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: path.shop,
      element: (
        <MainLayout>
          <Shop />
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        // {
        //   path: path.order,
        //   element: (
        //     <MainLayout>
        //       <Order />
        //     </MainLayout>
        //   )
        // },
        {
          // path: path.dashboard,
          path: '/manager/',
          element: (
            <MainLayout>
              <ShopLayout />
            </MainLayout>
          ),
          children: [
            {
              path: 'list',
              element: <ManagerBook />
            },
            {
              path: 'order',
              element: <ManagerOrder />
            }
          ]
        },

        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                // <Suspense>
                <Profile />
                // </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                // <Suspense>
                <ChangePassword />
                // </Suspense>
              )
            }
            // {
            //   path: path.historyPurchase,
            //   element: (
            //     // <Suspense>
            //     <HistoryPurchase />
            //     // {/* </Suspense> */}
            //   )
            // }
          ]
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    }
  ])

  return routeElements
}
