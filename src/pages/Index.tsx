import { ThemeProvider } from "@/contexts/ThemeContext";
import { RSADemo } from "@/components/RSADemo";

const Index = () => {
  return (
    <ThemeProvider>
      <RSADemo />
    </ThemeProvider>
  );
};

export default Index;
