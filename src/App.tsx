import { HomePage } from "./pages/HomePage";
import "./App.css";
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <div className="p-4">
      <ToastProvider>
      <HomePage />
      </ToastProvider>
    </div>
  );
}

export default App;
