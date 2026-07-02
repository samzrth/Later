import { AuthProvider, useAuth } from "./context/AuthContext";
import { MerchantProvider } from "./context/MerchantContext";
import LoginPage from "./components/LoginPage";
import IntegrationPortal from "./components/IntegrationPortal";
import MerchantPortal from "./components/MerchantPortal";

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;
  if (user.role === "integration") return <IntegrationPortal />;
  return <MerchantPortal />;
}

export default function App() {
  return (
    <AuthProvider>
      <MerchantProvider>
        <AppRoutes />
      </MerchantProvider>
    </AuthProvider>
  );
}
