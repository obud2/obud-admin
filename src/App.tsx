import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import weekday from 'dayjs/plugin/weekday';
import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import { Toaster } from 'react-hot-toast';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

/* Mobile Menu Page */
const MenuPage = lazy(() => import('./pages/mobile/MenuPage'));

/* Dashboard */
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));

/* Main */
const MainSettingPage = lazy(() => import('./pages/settings/MainSettingPage'));
const HomeBannerSettingPage = lazy(() => import('./pages/settings/HomeBannerSettingPage'));
const HomeSectionSettingPage = lazy(() => import('./pages/settings/HomeSectionSettingPage'));
const HomeCategorySettingPage = lazy(() => import('./pages/settings/HomeCategorySettingPage'));

/* Account */
const LoginPage = lazy(() => import('./pages/auth/login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/register/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/forgot-password/ForgotPasswordPage'));

/* Error */
const Error404Page = lazy(() => import('./pages/errors/404/Error404Page'));
const Error500Page = lazy(() => import('./pages/errors/500/Error500Page'));

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/* Order */
const OrderListPage = lazy(() => import('./pages/order/OrderListPage'));
const OrderStatusPage = lazy(() => import('./pages/order/OrderStatusPage'));
const OrderStatusCalendarPage = lazy(() => import('./pages/order/OrderStatusCalendarPage'));

/* Product */
const PlaceListPage = lazy(() => import('./pages/place/PlaceListPage'));
const ProgramListPage = lazy(() => import('./pages/place/ProgramListPage'));
const ProgramDetailPage = lazy(() => import('./pages/place/ProgramDetailPage'));
const ProgramSchedulePage = lazy(() => import('./pages/place/ProgramSchedulePage'));
const ProgramPassPage = lazy(() => import('./pages/place/ProgramPassPage'));

/* Coupon */
const CouponListPage = lazy(() => import('./pages/coupon/CouponListPage'));

/* Payment */
const PaymentListPage = lazy(() => import('./pages/payment/PaymentListPage'));

/* Pass */
const PassListPage = lazy(() => import('./pages/pass/PassListPage'));
const PassManagePage = lazy(() => import('./pages/pass/PassManagePage'));

/* Specail */
const SpecialListPage = lazy(() => import('./pages/special/SpecialListPage'));

/* About */
const AboutClassPage = lazy(() => import('./pages/about/AboutClassPage'));
const AboutSupportPage = lazy(() => import('./pages/about/AboutSupportPage'));
const AboutRegisterPage = lazy(() => import('./pages/about/AboutRegisterPage'));

/* User */
const UserListPage = lazy(() => import('./pages/user/UserListPage'));

/* Setting */
const SettingInfoPage = lazy(() => import('./pages/settings/SettingInfoPage'));
const SettingPolicyPage = lazy(() => import('./pages/settings/SettingPolicyPage'));
const SettingCodePage = lazy(() => import('./pages/settings/SettingCodePage'));
const SettingAuthorityPage = lazy(() => import('./pages/settings/SettingAuthorityPage'));

/* AllTalk */
const TemplateListPage = lazy(() => import('./pages/alltalk/TemplateList'));
const TemplatePage = lazy(() => import('./pages/alltalk/Template'));
const AlimTalkPage = lazy(() => import('./pages/alltalk/AlimTalk'));
const SendResultPage = lazy(() => import('./pages/alltalk/SendResult'));
const GroupInfoPage = lazy(() => import('./pages/alltalk/GroupInfo'));

const App = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="lazy-loading-bg">
            <span className="lazy-loading" />
          </div>
        }
      >
        <Toaster />
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/mobile/menu" element={<MenuPage />} />

            {/* Main */}
            <Route path="/pages/main-setting" element={<MainSettingPage />} />
            <Route path="/pages/home-banner-setting" element={<HomeBannerSettingPage />} />
            <Route path="/pages/home-section-setting" element={<HomeSectionSettingPage />} />
            <Route path="/pages/home-category-setting" element={<HomeCategorySettingPage />} />

            {/* Account */}
            <Route path="/pages/auth/login" element={<LoginPage />} />
            <Route path="/pages/auth/register" element={<RegisterPage />} />
            <Route path="/pages/auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* Order */}
            <Route path="/pages/order-list" element={<OrderListPage />} />
            <Route path="/pages/order-status" element={<OrderStatusPage />} />
            <Route path="/pages/order-status/:id" element={<OrderStatusCalendarPage />} />

            {/* Product */}
            <Route path="/pages/places" element={<PlaceListPage />} />
            <Route path="/pages/places/:placeId" element={<ProgramListPage />} />
            <Route path="/pages/places/:placeId/programs/:programId" element={<ProgramDetailPage />} />
            <Route path="/pages/places/:placeId/programs/:programId/schedules" element={<ProgramSchedulePage />} />
            <Route path="/pages/places/:placeId/programs/:programId/passes" element={<ProgramPassPage />} />

            {/* Payment */}
            <Route path="/pages/payment-list" element={<PaymentListPage />} />

            {/* Coupon */}
            <Route path="/pages/coupon-list" element={<CouponListPage />} />

            {/* Pass */}
            <Route path="/pages/pass-list" element={<PassListPage />} />
            <Route path="/pages/pass-member" element={<PassManagePage />} />

            {/* Special */}
            <Route path="/pages/special" element={<SpecialListPage />} />

            {/* About */}
            <Route path="/pages/about-class" element={<AboutClassPage />} />
            <Route path="/pages/about-support" element={<AboutSupportPage />} />
            <Route path="/pages/about-register" element={<AboutRegisterPage />} />

            {/* User */}
            <Route path="/pages/user/list" element={<UserListPage />} />

            {/* Settings */}
            <Route path="/pages/info" element={<SettingInfoPage />} />
            <Route path="/pages/policy" element={<SettingPolicyPage />} />
            <Route path="/pages/code" element={<SettingCodePage />} />
            <Route path="/pages/auth" element={<SettingAuthorityPage />} />

            {/* Error Page */}
            <Route path="*" element={<Error404Page />} />
            <Route path="/pages/errors/error-404" element={<Error404Page />} />
            <Route path="/pages/errors/error-500" element={<Error500Page />} />

            {/*  AllTalk */}
            <Route path="/pages/template" element={<TemplateListPage />} />
            <Route path="/pages/template/detail" element={<TemplatePage />} />
            <Route path="/pages/alimTalk" element={<AlimTalkPage />} />
            <Route path="/pages/send" element={<SendResultPage />} />
            <Route path="/pages/groupInfo" element={<GroupInfoPage />} />
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
};

export default App;
