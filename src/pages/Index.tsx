import { ThemeProvider } from "@/contexts/ThemeContext";
import { RSADemo } from "@/components/RSADemo";
import "./App.css";

const Index = () => {
  return (
    <ThemeProvider>
      <RSADemo />
    </ThemeProvider>
  );
};

export default Index;
