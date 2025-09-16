import { ThemeProvider } from "@/contexts/ThemeContext";
import { RSADemo } from "@/components/RSADemo";

const Index = () => {
  console.log("Index component rendering");
  
  return (
    <ThemeProvider>
      <RSADemo />
    </ThemeProvider>
  );
};

export default Index;
