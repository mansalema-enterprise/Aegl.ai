import { useParams, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";

const Login = () => {
  const { dashboard } = useParams<{ dashboard: string }>();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redirect based on dashboard type
    switch (dashboard) {
      case "business":
        navigate("/business-dashboard");
        break;
      case "accountant":
        navigate("/accountant-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex justify-center mb-8">
          <img
            src="/uploads/logo2.jpg"
            alt="AEGL - Auditive Engine Generative Ledger"
            className="h-28 w-auto mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-teal-400 mb-2">
          AEGL
        </h1>
        <p className="text-slate-400 text-lg">
          Auditive Engine Generative Ledger
        </p>
      </div>

      {/* Pass callback into AuthForm so it can notify Login page on success */}
      <AuthForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;
