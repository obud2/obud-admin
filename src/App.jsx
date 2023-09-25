import React, { Suspense, lazy } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './layout/Layout';

/* Mobile Menu Page */
const MenuPage = lazy(() => import('./pages/mobile/MenuPage'));

/* Dashboard */
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));

/* Main */
const MainSettingPage = lazy(() => import('./pages/settings/MainSettingPage'));
const AboutSettingPage = lazy(() => import('./pages/settings/AboutSettingPage'));

/* Account */
const LoginPage = lazy(() => import('./pages/auth/login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/register/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/forgot-password/ForgotPasswordPage'));

/* Error */
const Error404Page = lazy(() => import('./pages/errors/404/Error404Page'));
const Error500Page = lazy(() => import('./pages/errors/500/Error500Page'));

/* API */
const SwaggerPage = lazy(() => import('./pages/swagger/SwaggerPage'));

// --------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/* Order */
const OrderListPage = lazy(() => import('./pages/order/OrderListPage'));
const OrderCancelPage = lazy(() => import('./pages/order/OrderCancelPage'));
const OrderRefusalPage = lazy(() => import('./pages/order/OrderRefusalPage'));
const OrderStatusPage = lazy(() => import('./pages/order/OrderStatusPage'));

const OrderStatusCalendarPage = lazy(() => import('./pages/order/OrderStatusCalendarPage'));

/* Product */
const ProductListPage = lazy(() => import('./pages/product/ProductListPage'));
const ProductStudioPage = lazy(() => import('./pages/product/ProductStudioPage'));
const ProductLessonPage = lazy(() => import('./pages/product/ProductLessonPage'));

/* Specail */
const SpecialListPage = lazy(() => import('./pages/special/SpecialListPage'));

/* About */
const AboutClassPage = lazy(() => import('./pages/about/AboutClassPage'));
const AboutSupportPage = lazy(() => import('./pages/about/AboutSupportPage'));

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
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<DashboardPage />} exact />
            <Route path="/mobile/menu" element={<MenuPage />} exact />

            {/* Main */}
            <Route path="/pages/main-setting" element={<MainSettingPage />} exact />
            <Route path="/pages/about-setting" element={<AboutSettingPage />} exact />

            {/* Account */}
            <Route path="/pages/auth/login" element={<LoginPage />} exact />
            <Route path="/pages/auth/register" element={<RegisterPage />} exact />
            <Route path="/pages/auth/forgot-password" element={<ForgotPasswordPage />} exact />

            {/* Order */}
            <Route path="/pages/order-list" element={<OrderListPage />} exact />
            <Route path="/pages/order-cancel" element={<OrderCancelPage />} exact />
            <Route path="/pages/order-refusal" element={<OrderRefusalPage />} exact />
            <Route path="/pages/order-status" element={<OrderStatusPage />} exact />
            <Route path="/pages/order-status/:id" element={<OrderStatusCalendarPage />} exact />

            {/* Product */}
            <Route path="/pages/product" element={<ProductListPage />} exact />
            <Route path="/pages/product/studio/:id" element={<ProductStudioPage />} exact />
            <Route path="/pages/product/studio/:id/:studioId" element={<ProductLessonPage />} exact />

            {/* Special */}
            <Route path="/pages/special" element={<SpecialListPage />} exact />

            {/* About */}
            <Route path="/pages/about-class" element={<AboutClassPage />} exact />
            <Route path="/pages/about-support" element={<AboutSupportPage />} exact />

            {/* User */}
            <Route path="/pages/user/list" element={<UserListPage />} exact />

            {/* Settings */}
            <Route path="/pages/info" element={<SettingInfoPage />} exact />
            <Route path="/pages/policy" element={<SettingPolicyPage />} exact />
            <Route path="/pages/code" element={<SettingCodePage />} exact />
            <Route path="/pages/auth" element={<SettingAuthorityPage />} exact />

            {/* Error Page */}
            <Route path="*" element={<Error404Page />} exact />
            <Route path="/pages/errors/error-404" element={<Error404Page />} exact />
            <Route path="/pages/errors/error-500" element={<Error500Page />} exact />

            <Route path="/pages/swagger" element={<SwaggerPage />} exact />

            {/*  AllTalk */}
            <Route path="/pages/template" element={<TemplateListPage />} exact />
            <Route path="/pages/template/detail" element={<TemplatePage />} exact />
            <Route path="/pages/alimTalk" element={<AlimTalkPage />} exact />
            <Route path="/pages/send" element={<SendResultPage />} exact />
            <Route path="/pages/groupInfo" element={<GroupInfoPage />} exact />

          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
};

export default App;
