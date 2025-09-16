import { ThemeProvider } from "@/contexts/ThemeContext";
import { RSADemo } from "@/components/RSADemo";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = () => {
  console.log("Index component rendering");
  
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <RSADemo />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default Index;
