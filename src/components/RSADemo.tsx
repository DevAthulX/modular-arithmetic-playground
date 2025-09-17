/**
 * Main RSA Encryption Learning Demo Component
 * Interactive educational tool for Class 12 Mathematics project
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Key, 
  Lock, 
  Unlock, 
  Calculator, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { 
  generateRSAKeys, 
  rsaEncrypt, 
  rsaDecrypt, 
  isPrime, 
  validateMessage,
  type RSAKeyPair 
} from '@/lib/rsa-utils';
import { useToast } from '@/hooks/use-toast';

interface EncryptionResult {
  ciphertext: bigint[];
  steps: string[];
}

interface DecryptionResult {
  decrypted: string;
  steps: string[];
}

export function RSADemo() {
  console.log("RSADemo component rendering");
  
  const [p, setP] = useState('');
  const [q, setQ] = useState('');
  const [message, setMessage] = useState('');
  const [keyPair, setKeyPair] = useState<RSAKeyPair | null>(null);
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'input' | 'keys' | 'encrypt' | 'decrypt' | 'complete'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const resetDemo = () => {
    setP('');
    setQ('');
    setMessage('');
    setKeyPair(null);
    setEncryptionResult(null);
    setDecryptionResult(null);
    setCurrentStep('input');
  };

  const validatePrimes = () => {
    const pBigInt = BigInt(p || '0');
    const qBigInt = BigInt(q || '0');
    
    if (!isPrime(pBigInt)) {
      toast({
        title: "Invalid Prime",
        description: `${p} is not a prime number. Try 11, 13, 17, 19, 23, etc.`,
        variant: "destructive"
      });
      return false;
    }
    
    if (!isPrime(qBigInt)) {
      toast({
        title: "Invalid Prime",
        description: `${q} is not a prime number. Try 11, 13, 17, 19, 23, etc.`,
        variant: "destructive"
      });
      return false;
    }
    
    if (pBigInt === qBigInt) {
      toast({
        title: "Identical Primes",
        description: "p and q must be different prime numbers for security.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const generateKeys = async () => {
    if (!validatePrimes()) return;
    
    setIsGenerating(true);
    
    // Simulate processing time for educational effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pBigInt = BigInt(p);
    const qBigInt = BigInt(q);
    const keys = generateRSAKeys(pBigInt, qBigInt);
    
    if (keys) {
      setKeyPair(keys);
      setCurrentStep('keys');
      toast({
        title: "Keys Generated Successfully!",
        description: "RSA public and private keys are ready.",
        variant: "default"
      });
    } else {
      toast({
        title: "Key Generation Failed",
        description: "Unable to generate RSA keys with these primes.",
        variant: "destructive"
      });
    }
    
    setIsGenerating(false);
  };

  const encryptMessage = () => {
    if (!keyPair || !message) return;
    
    if (!validateMessage(message, keyPair.n)) {
      toast({
        title: "Message Too Large",
        description: `Message contains characters with ASCII values ≥ n (${keyPair.n}). Use smaller primes or shorter message.`,
        variant: "destructive"
      });
      return;
    }
    
    const result = rsaEncrypt(message, keyPair.e, keyPair.n);
    setEncryptionResult(result);
    setCurrentStep('encrypt');
    
    toast({
      title: "Message Encrypted!",
      description: "Your message has been successfully encrypted.",
      variant: "default"
    });
  };

  const decryptMessage = () => {
    if (!keyPair || !encryptionResult) return;
    
    const result = rsaDecrypt(encryptionResult.ciphertext, keyPair.d, keyPair.n);
    setDecryptionResult(result);
    setCurrentStep('complete');
    
    toast({
      title: "Message Decrypted!",
      description: "The original message has been recovered.",
      variant: "default"
    });
  };

  const suggestPrimes = () => {
    const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const p1 = primes[Math.floor(Math.random() * primes.length)];
    let p2 = primes[Math.floor(Math.random() * primes.length)];
    while (p2 === p1) {
      p2 = primes[Math.floor(Math.random() * primes.length)];
    }
    setP(p1.toString());
    setQ(p2.toString());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="header-gradient text-primary-foreground py-8 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Key className="w-12 h-12 key-rotate pulse-glow" />
                <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/20 blur-lg animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 hover:scale-105 transition-all duration-300">
                  Interactive RSA Encryption Learner
                </h1>
                <p className="text-lg opacity-90">Class 12 Mathematics • Cryptography & Number Theory</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-4 space-y-6">
        
        {/* Progress Indicator */}
        <Card className="glass-card hover-float transform-3d card-entrance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 animate-glow-pulse" />
              RSA Encryption Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center stagger-animation">
              {[
                { step: 'input', label: '1. Input Primes', icon: '🔢' },
                { step: 'keys', label: '2. Generate Keys', icon: '🔑' },
                { step: 'encrypt', label: '3. Encrypt Message', icon: '🔒' },
                { step: 'complete', label: '4. Decrypt & Verify', icon: '✅' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center animate-fade-in">
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-ultra transform hover:scale-105
                    ${currentStep === item.step || (index < ['input', 'keys', 'encrypt', 'complete'].indexOf(currentStep)) 
                      ? 'bg-primary text-primary-foreground shadow-lg animate-glow-pulse' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'}
                  `}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-5 h-5 mx-3 text-muted-foreground animate-float" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Prime Input */}
        <Card className="glass-card hover-float transform-3d animate-morph-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Step 1: Enter Prime Numbers
            </CardTitle>
            <CardDescription>
              Choose two distinct prime numbers (p and q) to generate your RSA keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prime-p">Prime p</Label>
                <Input
                  id="prime-p"
                  type="number"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  placeholder="Enter first prime (e.g., 11)"
                  className={!p || isPrime(BigInt(p || '0')) ? '' : 'border-destructive'}
                />
                {p && !isPrime(BigInt(p || '0')) && (
                  <p className="text-sm text-destructive mt-1">Not a prime number</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="prime-q">Prime q</Label>
                <Input
                  id="prime-q"
                  type="number"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Enter second prime (e.g., 13)"
                  className={!q || isPrime(BigInt(q || '0')) ? '' : 'border-destructive'}
                />
                {q && !isPrime(BigInt(q || '0')) && (
                  <p className="text-sm text-destructive mt-1">Not a prime number</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={generateKeys} 
                disabled={!p || !q || isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Generate RSA Keys
              </Button>
              
              <Button variant="outline" onClick={suggestPrimes}>
                Suggest Random Primes
              </Button>
            </div>

            {/* Prime Number Helper */}
            <Alert>
              <BookOpen className="w-4 h-4" />
              <AlertDescription>
                <strong>Prime Numbers:</strong> Natural numbers greater than 1 that have no positive divisors other than 1 and themselves. 
                Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Step 2: Generated Keys */}
        {keyPair && (
          <Card className="glass-card hover-float transform-3d animate-bounce-in success-bounce">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 public-key-color" />
                Step 2: Generated RSA Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-animation">
                <div className="math-3d p-6 rounded-xl hover-lift animate-slide-up">
                  <h4 className="font-bold text-public-key mb-3 flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 animate-glow-pulse" />
                    Public Key (e, n)
                  </h4>
                  <div className="math-font space-y-3 text-lg">
                    <p className="flex items-center gap-3">
                      <span className="text-muted-foreground font-semibold">e =</span> 
                      <span className="public-key-color font-bold bg-public-key/10 px-3 py-1 rounded-lg animate-math-highlight">
                        {keyPair.e.toString()}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-muted-foreground font-semibold">n =</span> 
                      <span className="public-key-color font-bold bg-public-key/10 px-3 py-1 rounded-lg animate-math-highlight">
                        {keyPair.n.toString()}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="math-3d p-6 rounded-xl hover-lift animate-slide-up">
                  <h4 className="font-bold text-private-key mb-3 flex items-center gap-2 text-lg">
                    <Unlock className="w-5 h-5 animate-glow-pulse" />
                    Private Key (d, n)
                  </h4>
                  <div className="math-font space-y-3 text-lg">
                    <p className="flex items-center gap-3">
                      <span className="text-muted-foreground font-semibold">d =</span> 
                      <span className="private-key-color font-bold bg-private-key/10 px-3 py-1 rounded-lg animate-math-highlight">
                        {keyPair.d.toString()}
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-muted-foreground font-semibold">n =</span> 
                      <span className="private-key-color font-bold bg-private-key/10 px-3 py-1 rounded-lg animate-math-highlight">
                        {keyPair.n.toString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mathematical Steps */}
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="math-steps" className="border border-math-formula/20 rounded-xl">
                  <AccordionTrigger className="px-6 py-4 hover:bg-math-formula/5 transition-ultra rounded-xl">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-math-formula" />
                      <span className="font-semibold">Show Mathematical Steps</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 math-font">
                      {keyPair.steps.map((step, index) => (
                        <div key={index} className="math-step flex items-start gap-4 p-4 rounded-xl bg-math-formula/5 border border-math-formula/10 hover:border-math-formula/20 transition-ultra">
                          <Badge variant="outline" className="shrink-0 bg-math-formula text-background font-bold text-sm px-3 py-1">
                            {index + 1}
                          </Badge>
                          <span className="text-base leading-relaxed text-math-formula font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Message Input */}
              <Separator />
              <div>
                <Label htmlFor="message">Message to Encrypt</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your secret message"
                  maxLength={10}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Keep it short for demonstration (max 10 characters)
                </p>
              </div>

              <Button 
                onClick={encryptMessage} 
                disabled={!message}
                className="flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Encrypt Message
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Encryption */}
        {encryptionResult && (
          <Card className="glass-card hover-float transform-3d animate-bounce-in success-bounce">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Step 3: Message Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="math-3d p-6 rounded-xl animate-morph-in">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-lg">
                  <Lock className="w-5 h-5 text-primary animate-glow-pulse" />
                  Encrypted Message (Ciphertext)
                </h4>
                <div className="math-font text-lg break-all bg-primary/10 p-4 rounded-lg border-2 border-primary/20 animate-shimmer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"></div>
                  <span className="relative z-10 font-bold text-primary">
                    [{encryptionResult.ciphertext.join(', ')}]
                  </span>
                </div>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="encrypt-steps" className="border border-primary/20 rounded-xl">
                  <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-ultra rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      <span className="font-semibold">Show Encryption Steps</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 math-font">
                      {encryptionResult.steps.map((step, index) => (
                        <div key={index} className="math-step flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-ultra">
                          <Badge variant="outline" className="shrink-0 bg-primary text-primary-foreground font-bold text-sm px-3 py-1">
                            {index + 1}
                          </Badge>
                          <span className="text-base leading-relaxed font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button 
                onClick={decryptMessage}
                className="flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Decrypt Message
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Decryption */}
        {decryptionResult && (
          <Card className="glass-card hover-float transform-3d animate-bounce-in success-bounce pulse-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success animate-pulse" />
                Step 4: Message Decryption - Success!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="math-3d p-8 rounded-xl bg-success/10 border-2 border-success/30 animate-morph-in">
                <h4 className="font-bold text-success mb-4 flex items-center gap-2 text-xl">
                  <CheckCircle className="w-6 h-6 animate-glow-pulse" />
                  Decrypted Message
                </h4>
                <div className="text-2xl font-mono bg-success/20 p-6 rounded-xl border border-success/30 text-center animate-math-highlight">
                  <span className="text-success font-bold">"{decryptionResult.decrypted}"</span>
                </div>
              </div>

              <Alert className="border-success/30 bg-success/5 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-success animate-glow-pulse" />
                <AlertDescription className="text-base">
                  <strong className="text-success">Perfect Success!</strong> The original message has been flawlessly recovered using RSA decryption. 
                  This demonstrates the elegant mathematical foundation of modular arithmetic and number theory in cryptography.
                </AlertDescription>
              </Alert>

              <Accordion type="single" collapsible>
                <AccordionItem value="decrypt-steps" className="border border-success/20 rounded-xl">
                  <AccordionTrigger className="px-6 py-4 hover:bg-success/5 transition-ultra rounded-xl">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-success" />
                      <span className="font-semibold">Show Decryption Steps</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 math-font">
                      {decryptionResult.steps.map((step, index) => (
                        <div key={index} className="math-step flex items-start gap-4 p-4 rounded-xl bg-success/5 border border-success/10 hover:border-success/20 transition-ultra">
                          <Badge variant="outline" className="shrink-0 bg-success text-background font-bold text-sm px-3 py-1">
                            {index + 1}
                          </Badge>
                          <span className="text-base leading-relaxed text-success font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button 
                onClick={resetDemo}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start New Demo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Educational Information */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              RSA Cryptography - Educational Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple">
              <AccordionItem value="what-is-rsa">
                <AccordionTrigger>What is RSA Encryption?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    RSA is a public-key cryptosystem widely used for secure data transmission. It was first described in 1977 
                    by Ron Rivest, Adi Shamir, and Leonard Adleman. The security of RSA relies on the mathematical difficulty 
                    of factoring the product of two large prime numbers.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="math-concepts">
                <AccordionTrigger>Mathematical Concepts (Class 12 Relevance)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p><strong>Number Theory:</strong> Prime numbers, greatest common divisor (GCD), modular arithmetic</p>
                    <p><strong>Algebra:</strong> Modular exponentiation, Euler's totient function φ(n)</p>
                    <p><strong>Extended Euclidean Algorithm:</strong> Finding modular multiplicative inverse</p>
                    <p><strong>Binary Exponentiation:</strong> Efficient computation of large exponentials</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger>Why is RSA Secure?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    RSA security is based on the computational difficulty of factoring large integers. While it's easy to 
                    multiply two large primes (p × q = n), it's extremely difficult to factor n back into p and q when 
                    these numbers are hundreds of digits long. This asymmetry makes RSA cryptographically secure.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-12 py-8">
        <div className="container mx-auto max-w-4xl px-4 text-center text-muted-foreground">
          <div className="space-y-2">
            <p className="font-semibold">Class 12 Mathematics Project - RSA Cryptography</p>
            <p className="text-sm">
              Educational demonstration using React.js and native JavaScript BigInt
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span>⚠️ For learning purposes only - not for production use</span>
              <span>•</span>
              <span>Modern web technologies: React, TypeScript, Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}