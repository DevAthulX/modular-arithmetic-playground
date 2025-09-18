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
      <header className="header-gradient text-primary-foreground py-12 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Key className="w-16 h-16 key-rotate pulse-glow" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/30 blur-xl animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-3 hover:scale-105 transition-all duration-300">
                  Interactive RSA Encryption Learner
                </h1>
                <p className="text-xl opacity-90">Class 12 Mathematics • Cryptography & Number Theory</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        {/* Enhanced animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-float floating-element"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-accent/15 rounded-full blur-2xl animate-float floating-element"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-float floating-element"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-6 space-y-8">
        
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
            <Alert className="glass-card border-math-formula/30 bg-gradient-to-r from-math-formula/5 to-primary/5 hover:from-math-formula/10 hover:to-primary/10 transition-ultra animate-fade-in hover-float">
              <BookOpen className="w-5 h-5 text-math-formula animate-glow-pulse" />
              <AlertDescription className="space-y-3">
                <div className="math-3d p-4 rounded-xl bg-math-formula/5 border border-math-formula/20 animate-morph-in">
                  <p className="text-base leading-relaxed">
                    <span className="font-bold text-math-formula text-lg animate-math-highlight">Prime Numbers:</span> 
                    <span className="ml-2 animate-slide-up">Natural numbers greater than 1 that have no positive divisors other than 1 and themselves.</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 animate-stagger-in">
                  <span className="text-muted-foreground font-semibold">Examples:</span>
                  {[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47].map((prime, index) => (
                    <span 
                      key={prime}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-math-formula/20 text-math-formula font-bold border border-math-formula/30 hover:bg-math-formula/30 hover:scale-110 transition-ultra cursor-default animate-bounce-in hover-float"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {prime}
                    </span>
                  ))}
                  <span className="text-math-formula/70 font-semibold animate-pulse">...</span>
                </div>
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
                <div className="math-font text-lg break-all bg-primary/10 p-4 rounded-lg border-2 border-primary/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer-once"></div>
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

        {/* Enhanced Educational Information */}
        <Card className="card-gradient glass-card hover-float transform-3d animate-morph-in">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="w-7 h-7 animate-glow-pulse" />
              RSA Cryptography - Educational Overview
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Discover the mathematical beauty behind modern encryption
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="what-is-rsa" className="border border-primary/20 rounded-xl glass-card">
                <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-ultra rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-primary animate-glow-pulse" />
                    <span className="font-bold text-lg">What is RSA Encryption?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="math-3d p-6 rounded-xl animate-fade-in">
                    <p className="text-base leading-relaxed">
                      RSA is a public-key cryptosystem widely used for secure data transmission. It was first described in 1977 
                      by Ron Rivest, Adi Shamir, and Leonard Adleman. The security of RSA relies on the mathematical difficulty 
                      of factoring the product of two large prime numbers - a problem that becomes exponentially harder as the 
                      numbers grow larger.
                    </p>
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-semibold">
                        💡 Fun Fact: Breaking a 2048-bit RSA key would take billions of years with current technology!
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="math-concepts" className="border border-math-formula/20 rounded-xl glass-card">
                <AccordionTrigger className="px-6 py-4 hover:bg-math-formula/5 transition-ultra rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-math-formula animate-glow-pulse" />
                    <span className="font-bold text-lg">Mathematical Concepts (Class 12 Relevance)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4 stagger-animation">
                    <div className="math-3d p-5 rounded-xl animate-slide-up">
                      <h4 className="font-bold text-math-formula mb-2 flex items-center gap-2">
                        <span className="text-lg">🔢</span> Number Theory
                      </h4>
                      <p className="text-sm">Prime numbers, greatest common divisor (GCD), modular arithmetic</p>
                    </div>
                    <div className="math-3d p-5 rounded-xl animate-slide-up">
                      <h4 className="font-bold text-math-formula mb-2 flex items-center gap-2">
                        <span className="text-lg">📐</span> Algebra
                      </h4>
                      <p className="text-sm">Modular exponentiation, Euler's totient function φ(n)</p>
                    </div>
                    <div className="math-3d p-5 rounded-xl animate-slide-up">
                      <h4 className="font-bold text-math-formula mb-2 flex items-center gap-2">
                        <span className="text-lg">🔄</span> Extended Euclidean Algorithm
                      </h4>
                      <p className="text-sm">Finding modular multiplicative inverse</p>
                    </div>
                    <div className="math-3d p-5 rounded-xl animate-slide-up">
                      <h4 className="font-bold text-math-formula mb-2 flex items-center gap-2">
                        <span className="text-lg">⚡</span> Binary Exponentiation
                      </h4>
                      <p className="text-sm">Efficient computation of large exponentials</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security" className="border border-success/20 rounded-xl glass-card">
                <AccordionTrigger className="px-6 py-4 hover:bg-success/5 transition-ultra rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success animate-glow-pulse" />
                    <span className="font-bold text-lg">Why is RSA Secure?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="math-3d p-6 rounded-xl animate-fade-in">
                    <p className="text-base leading-relaxed mb-4">
                      RSA security is based on the computational difficulty of factoring large integers. While it's easy to 
                      multiply two large primes (p × q = n), it's extremely difficult to factor n back into p and q when 
                      these numbers are hundreds of digits long.
                    </p>
                    <div className="bg-success/10 p-4 rounded-lg border border-success/20 animate-glow-pulse">
                      <p className="text-success font-semibold text-center">
                        🛡️ This asymmetry makes RSA cryptographically secure! 🛡️
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="real-world" className="border border-accent/20 rounded-xl glass-card">
                <AccordionTrigger className="px-6 py-4 hover:bg-accent/5 transition-ultra rounded-xl">
                  <div className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-accent animate-glow-pulse" />
                    <span className="font-bold text-lg">Real-World Applications</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-animation">
                    <div className="math-3d p-4 rounded-lg animate-morph-in">
                      <h5 className="font-semibold text-accent mb-2">🌐 HTTPS/SSL</h5>
                      <p className="text-sm">Secures web browsing and online transactions</p>
                    </div>
                    <div className="math-3d p-4 rounded-lg animate-morph-in">
                      <h5 className="font-semibold text-accent mb-2">📧 Email Encryption</h5>
                      <p className="text-sm">PGP and S/MIME email security</p>
                    </div>
                    <div className="math-3d p-4 rounded-lg animate-morph-in">
                      <h5 className="font-semibold text-accent mb-2">🔐 Digital Signatures</h5>
                      <p className="text-sm">Authentication and non-repudiation</p>
                    </div>
                    <div className="math-3d p-4 rounded-lg animate-morph-in">
                      <h5 className="font-semibold text-accent mb-2">💳 Banking Systems</h5>
                      <p className="text-sm">ATM transactions and online banking</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>

      {/* Beautiful Footer */}
      <footer className="bg-gradient-to-r from-muted via-muted/80 to-muted mt-16 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <div className="text-center space-y-6">
            <div className="animate-fade-in">
              <p className="text-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
                Made with <span className="text-red-500 animate-pulse text-2xl">❤️</span> by Athul
              </p>
            </div>
            
            <div className="flex justify-center items-center gap-8 animate-bounce-in">
              {/* GitHub */}
              <a 
                href="https://github.com/DevAthulX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-4 bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-ultra hover:scale-110 hover:-translate-y-2"
              >
                <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center group-hover:rotate-12 transition-ultra">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-ultra">DevAthulX</span>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/athul-m-sivan-849029364" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-ultra hover:scale-110 hover:-translate-y-2"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-ultra">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="font-semibold text-blue-500 group-hover:text-blue-400 transition-ultra">LinkedIn</span>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/ig.flux_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 rounded-xl transition-ultra hover:scale-110 hover:-translate-y-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center group-hover:rotate-12 transition-ultra">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-ultra">Instagram</span>
              </a>
            </div>

            <div className="pt-6 border-t border-muted-foreground/20">
              <p className="text-sm text-muted-foreground animate-fade-in">
                Educational RSA Cryptography Demo
              </p>
            </div>
          </div>
        </div>
        
        {/* Floating background elements */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-float floating-element"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-accent/5 rounded-full blur-lg animate-float floating-element"></div>
      </footer>
    </div>
  );
}