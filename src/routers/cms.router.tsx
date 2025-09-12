import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/common/Loadable";
import {
  Dashboard,
  Product,
  ProductNew,
  ProductUpdate,
  MasterData,
  AccountAdmin,
  AccountUser,
  Voucher,
  Payment,
  Segment,
  Orders,
  Chat,
  News,
  Schedules,
} from "../config/routeConfig";

const DashboardPage = Loadable(lazy(() => import("../pages/dashboard/index")));
const ProductPage = Loadable(lazy(() => import("../pages/products/index")));
const NewProductPage = Loadable(lazy(() => import("../pages/products/Create")));
const UpdateProductPage = Loadable(
  lazy(() => import("../pages/products/Update"))
);
const MasterDataPage = Loadable(
  lazy(() => import("../pages/master-data/index"))
);
const AdminPage = Loadable(lazy(() => import("../pages/users/admin")));
const CustomerPage = Loadable(lazy(() => import("../pages/users/customer")));
const VoucherPage = Loadable(lazy(() => import("../pages/vouchers")));
const PaymentPage = Loadable(lazy(() => import("../pages/payments")));
const SegmentPage = Loadable(lazy(() => import("../pages/segment")));
const OrdersPage = Loadable(lazy(() => import("../pages/orders")));
const ChatsPage = Loadable(lazy(() => import("../pages/chat")));
const NewsPage = Loadable(lazy(() => import("../pages/news")));
const ScheduleEventPage = Loadable(lazy(() => import("../pages/schedule")));

const CMSRoutes: RouteObject[] = [
  {
    path: Dashboard,
    element: <DashboardPage />,
  },
  {
    path: Product,
    element: <ProductPage />,
  },
  {
    path: ProductNew,
    element: <NewProductPage />,
  },
  {
    path: ProductUpdate,
    element: <UpdateProductPage />,
  },
  {
    path: MasterData,
    element: <MasterDataPage />,
  },
  {
    path: AccountAdmin,
    element: <AdminPage />,
  },
  {
    path: AccountUser,
    element: <CustomerPage />,
  },
  {
    path: Voucher,
    element: <VoucherPage />,
  },
  {
    path: Payment,
    element: <PaymentPage />,
  },
  {
    path: Segment,
    element: <SegmentPage />,
  },
  {
    path: Orders,
    element: <OrdersPage />,
  },
  {
    path: Chat,
    element: <ChatsPage />,
  },
  {
    path: News,
    element: <NewsPage />,
  },
  {
    path: Schedules,
    element: <ScheduleEventPage />,
  },
];

export default CMSRoutes;
