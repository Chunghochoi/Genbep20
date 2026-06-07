import { useState, useCallback, useEffect } from 'react'
  import { Wallet as EthersWallet } from 'ethers'
  import { motion, AnimatePresence } from 'framer-motion'
  import { Copy, Check, RefreshCw, ShieldCheck, Wallet } from 'lucide-react'

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='
    const all = uppercase + lowercase + numbers + symbols

    let password = ''
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    for (let i = 0; i < 4; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('')
  }

  const generatePair = () => {
    const wallet = EthersWallet.createRandom()
    return { password: generatePassword(), address: wallet.address }
  }

  type CopiedField = 'password' | 'address' | null

  export default function App() {
    const [pair, setPair] = useState({ password: '', address: '' })
    const [copied, setCopied] = useState<CopiedField>(null)
    const [animKey, setAnimKey] = useState(0)

    useEffect(() => { setPair(generatePair()) }, [])

    const handleGenerate = useCallback(() => {
      setPair(generatePair())
      setAnimKey(k => k + 1)
      setCopied(null)
    }, [])

    const handleCopy = useCallback((field: 'password' | 'address', value: string) => {
      if (!value) return
      navigator.clipboard.writeText(value).then(() => {
        setCopied(field)
        setTimeout(() => setCopied(null), 2000)
      })
    }, [])

    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'hsl(222 47% 11%)',
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', inset: '-2px',
            background: 'linear-gradient(135deg, hsl(184 100% 40% / 0.25), transparent)',
            borderRadius: '2rem', filter: 'blur(20px)', pointerEvents: 'none'
          }} />

          <div style={{
            position: 'relative',
            background: 'hsl(222 47% 13%)',
            border: '1px solid hsl(217 32% 22%)',
            borderRadius: '2rem',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'hsl(184 100% 40% / 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'hsl(184 100% 40%)'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'hsl(210 40% 98%)' }}>Secure Pass</div>
                <div style={{ fontSize: '0.8rem', color: 'hsl(215 20% 65%)', fontWeight: 500 }}>Mật khẩu 8 ký tự + Địa chỉ BNB BEP20</div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={animKey}
                initial={{ y: 12, opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -12, opacity: 0, filter: 'blur(6px)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}
              >
                {/* Password */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <ShieldCheck size={14} color="hsl(215 20% 55%)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'hsl(215 20% 55%)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mật khẩu</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'hsl(217 32% 15%)', border: '1px solid hsl(217 32% 22%)',
                    borderRadius: '1rem', padding: '1rem 1.25rem'
                  }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.75rem', fontWeight: 700, color: 'hsl(210 40% 98%)', letterSpacing: '0.1em' }} data-testid="text-password">
                      {pair.password || '........'}
                    </span>
                    <CopyBtn active={copied === 'password'} onClick={() => handleCopy('password', pair.password)} />
                  </div>
                </div>

                {/* BNB Address */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <Wallet size={14} color="hsl(215 20% 55%)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'hsl(215 20% 55%)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Địa chỉ BNB BEP20</span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                    background: 'hsl(217 32% 15%)', border: '1px solid hsl(217 32% 22%)',
                    borderRadius: '1rem', padding: '1rem 1.25rem'
                  }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', color: 'hsl(210 40% 90%)', wordBreak: 'break-all', lineHeight: 1.6 }} data-testid="text-address">
                      {pair.address || '0x...'}
                    </span>
                    <CopyBtn active={copied === 'address'} onClick={() => handleCopy('address', pair.address)} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'hsl(217 32% 22%)' }} />
              <span style={{ fontSize: '0.7rem', color: 'hsl(215 20% 45%)', whiteSpace: 'nowrap' }}>Mật khẩu và địa chỉ luôn đi cùng nhau</span>
              <div style={{ flex: 1, height: '1px', background: 'hsl(217 32% 22%)' }} />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              data-testid="button-generate"
              style={{
                width: '100%', height: '3.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'hsl(184 100% 40%)', color: 'hsl(222 47% 11%)',
                border: 'none', borderRadius: '0.875rem', cursor: 'pointer',
                fontWeight: 700, fontSize: '0.95rem', fontFamily: 'inherit',
                boxShadow: '0 0 20px hsl(184 100% 40% / 0.2)',
                transition: 'filter 0.15s, transform 0.1s'
              }}
              onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseOut={e => (e.currentTarget.style.filter = 'brightness(1)')}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <RefreshCw size={18} />
              Tạo cặp mới
            </button>
          </div>
        </div>
      </div>
    )
  }

  function CopyBtn({ active, onClick }: { active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        style={{
          flexShrink: 0, width: '2.25rem', height: '2.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'hsl(222 47% 11% / 0.6)', border: '1px solid hsl(217 32% 25%)',
          borderRadius: '0.625rem', cursor: 'pointer', transition: 'background 0.15s, transform 0.1s',
          color: active ? 'hsl(184 100% 40%)' : 'hsl(215 20% 55%)'
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'hsl(184 100% 40% / 0.1)')}
        onMouseOut={e => (e.currentTarget.style.background = 'hsl(222 47% 11% / 0.6)')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Check size={15} />
            </motion.div>
          ) : (
            <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Copy size={15} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    )
  }
  