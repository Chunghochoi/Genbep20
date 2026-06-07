import { useState, useCallback, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Copy, Check, RefreshCw, ShieldCheck, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet as EthersWallet } from "ethers";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const generatePassword = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const all = uppercase + lowercase + numbers + symbols;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 4; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

const generatePair = () => {
  const wallet = EthersWallet.createRandom();
  return {
    password: generatePassword(),
    address: wallet.address,
  };
};

type CopiedField = "password" | "address" | null;

function Home() {
  const [pair, setPair] = useState({ password: "", address: "" });
  const [copied, setCopied] = useState<CopiedField>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setPair(generatePair());
  }, []);

  const handleGenerate = useCallback(() => {
    setPair(generatePair());
    setKey((prev) => prev + 1);
    setCopied(null);
  }, []);

  const handleCopy = useCallback((field: "password" | "address", value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background p-4 sm:p-8 font-sans selection:bg-primary/30">
      <div className="relative w-full max-w-lg mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/0 rounded-[2rem] blur-xl opacity-50 pointer-events-none" />

        <div className="relative flex flex-col bg-card border border-border shadow-2xl rounded-[2rem] p-8 sm:p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Secure Pass</h1>
              <p className="text-sm text-muted-foreground font-medium">Mật khẩu 8 ký tự + Địa chỉ BNB BEP20</p>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={key}
              initial={{ y: 12, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -12, opacity: 0, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex flex-col gap-4 mb-8"
            >
              {/* Password field */}
              <div className="group relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Mật khẩu</span>
                </div>
                <div className="flex items-center justify-between bg-secondary border border-border/50 rounded-2xl px-6 py-4 shadow-inner">
                  <span
                    className="font-mono text-2xl sm:text-3xl tracking-wider text-foreground font-bold"
                    data-testid="text-password"
                  >
                    {pair.password || "........"}
                  </span>
                  <button
                    onClick={() => handleCopy("password", pair.password)}
                    data-testid="button-copy-password"
                    className="ml-4 flex items-center justify-center w-9 h-9 rounded-xl bg-background/60 hover:bg-primary/10 border border-border/40 transition-all duration-200 active:scale-95 flex-shrink-0"
                    title="Sao chép mật khẩu"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied === "password" ? (
                        <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                          <Check className="w-4 h-4 text-primary" />
                        </motion.div>
                      ) : (
                        <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* BNB Address field */}
              <div className="group relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Địa chỉ BNB BEP20</span>
                </div>
                <div className="flex items-center justify-between bg-secondary border border-border/50 rounded-2xl px-6 py-4 shadow-inner">
                  <span
                    className="font-mono text-xs sm:text-sm text-foreground font-medium break-all leading-relaxed"
                    data-testid="text-address"
                  >
                    {pair.address || "0x..."}
                  </span>
                  <button
                    onClick={() => handleCopy("address", pair.address)}
                    data-testid="button-copy-address"
                    className="ml-4 flex items-center justify-center w-9 h-9 rounded-xl bg-background/60 hover:bg-primary/10 border border-border/40 transition-all duration-200 active:scale-95 flex-shrink-0"
                    title="Sao chép địa chỉ"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied === "address" ? (
                        <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                          <Check className="w-4 h-4 text-primary" />
                        </motion.div>
                      ) : (
                        <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mb-6 px-1">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground/60 px-2">Mật khẩu và địa chỉ luôn đi cùng nhau</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <button
            onClick={handleGenerate}
            data-testid="button-generate"
            className="w-full flex items-center justify-center gap-2 h-14 bg-primary text-primary-foreground font-semibold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            <RefreshCw className="w-5 h-5" />
            Tạo cặp mới
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
