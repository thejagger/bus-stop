import LoginPage from "@/app/login/page.tsx";
import {Routes, Route} from "react-router-dom";
import ProtectedRoute from "@/components/protected-route.tsx";
import DashboardPage from "@/app/dashboard/page.tsx";
import PublicRoute from "@/components/public-route.tsx";
import Layout from "@/components/layout.tsx";
import ErrorPage404 from "@/app/error/page.tsx";
import {navigationConfig, type NavItem} from "./config/navigation";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import SetupPage from "@/app/setup/[code]/page.tsx";
import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AppError} from "@/lib/app-error.ts";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner.tsx";

const globalErrorHandler = (error: unknown) => {
  let displayMessage = "A server error occurred. Please try again.";

  // 1. Check if it is the standardized AppError
  if (error instanceof AppError) {
    displayMessage = error.displayMessage;
    console.error(`[AppError] Operation failed: ${error.context.operation}`, error.originalError);
  } else {
    // Catch network or generic JS errors
    console.error("Uncaught runtime error:", error);
  }

  // 2. Display the Toaster
  toast.error(displayMessage, {
    duration: 5000,
    dismissible: true,
  });
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: globalErrorHandler, // 👈 CATCH ALL QUERY ERRORS
  }),
  defaultOptions: {
    mutations: {
      onError: globalErrorHandler, // 👈 CATCH ALL MUTATION ERRORS
    }
  }
});

function generateRoutes(config: NavItem[]) {
  return config.map((item) => (
      <Route key={item.path} path={item.path}>
        {item.component && <Route index element={<item.component/>}/>}
        {item.componentDetail && <Route path={":id"} element={<item.componentDetail/>}/>}
        {item.items && generateRoutes(item.items)}
      </Route>
  ));
}

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage/>
              </PublicRoute>}/>
            <Route path="/setup/:code" element={<SetupPage/>}/>

            {/* Protected routes */}
            <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout items={navigationConfig}/>
                  </ProtectedRoute>
                }
            >
              {/* Default redirect */}
              <Route index element={<DashboardPage/>}/>

              {generateRoutes(navigationConfig)}
              <Route path="*" element={<ErrorPage404/>}/>
            </Route>
          </Routes>
          <Toaster position={"top-center"}/>
        </ThemeProvider>
      </QueryClientProvider>
  );
}

export default App
