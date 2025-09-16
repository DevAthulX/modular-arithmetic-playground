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
      <header className="header-gradient text-primary-foreground py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Interactive RSA Encryption Learner</h1>
              <p className="text-lg opacity-90">Class 12 Mathematics • Cryptography & Number Theory</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl p-4 space-y-6">
        
        {/* Progress Indicator */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              RSA Encryption Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {[
                { step: 'input', label: '1. Input Primes', icon: '🔢' },
                { step: 'keys', label: '2. Generate Keys', icon: '🔑' },
                { step: 'encrypt', label: '3. Encrypt Message', icon: '🔒' },
                { step: 'complete', label: '4. Decrypt & Verify', icon: '✅' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth
                    ${currentStep === item.step || (index < ['input', 'keys', 'encrypt', 'complete'].indexOf(currentStep)) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'}
                  `}>
                    <span>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Prime Input */}
        <Card className="card-gradient animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
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
          <Card className="card-gradient animate-bounce-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 public-key-color" />
                Step 2: Generated RSA Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg math-gradient">
                  <h4 className="font-semibold text-public-key mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Public Key (e, n)
                  </h4>
                  <div className="math-font space-y-1">
                    <p><span className="text-muted-foreground">e =</span> <span className="public-key-color font-bold">{keyPair.e.toString()}</span></p>
                    <p><span className="text-muted-foreground">n =</span> <span className="public-key-color font-bold">{keyPair.n.toString()}</span></p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg math-gradient">
                  <h4 className="font-semibold text-private-key mb-2 flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    Private Key (d, n)
                  </h4>
                  <div className="math-font space-y-1">
                    <p><span className="text-muted-foreground">d =</span> <span className="private-key-color font-bold">{keyPair.d.toString()}</span></p>
                    <p><span className="text-muted-foreground">n =</span> <span className="private-key-color font-bold">{keyPair.n.toString()}</span></p>
                  </div>
                </div>
              </div>

              {/* Mathematical Steps */}
              <Accordion type="single" collapsible>
                <AccordionItem value="math-steps">
                  <AccordionTrigger>Show Mathematical Steps</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm math-font">
                      {keyPair.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                          <span>{step}</span>
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
          <Card className="card-gradient animate-bounce-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Step 3: Message Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-2">Encrypted Message (Ciphertext)</h4>
                <div className="math-font text-sm break-all">
                  [{encryptionResult.ciphertext.join(', ')}]
                </div>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="encrypt-steps">
                  <AccordionTrigger>Show Encryption Steps</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm math-font">
                      {encryptionResult.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                          <span>{step}</span>
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
          <Card className="card-gradient animate-bounce-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Step 4: Message Decryption - Success!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h4 className="font-semibold text-success mb-2">Decrypted Message</h4>
                <div className="text-lg font-mono">
                  "{decryptionResult.decrypted}"
                </div>
              </div>

              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Success!</strong> The original message has been perfectly recovered using RSA decryption. 
                  This demonstrates the mathematical beauty of modular arithmetic and number theory.
                </AlertDescription>
              </Alert>

              <Accordion type="single" collapsible>
                <AccordionItem value="decrypt-steps">
                  <AccordionTrigger>Show Decryption Steps</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm math-font">
                      {decryptionResult.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">{index + 1}</Badge>
                          <span>{step}</span>
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