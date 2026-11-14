import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '../components/ui/Section';
import { inputCls, labelCls, primaryBtnCls } from '../components/ui/form';

/**
 * /login — mobile number + OTP sign-in. Without the original SMS backend the OTP step is
 * simulated locally (any 6-digit code), and the session is kept in localStorage.
 */
export default function LoginPage() {
  const nav = useNavigate();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { document.title = 'Login | Desert Forest'; }, []);
  useEffect(() => {
    if (!seconds) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const digits = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const sendOtp = e => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(digits)) return setError('Enter a valid 10-digit mobile number.');
    setError(''); setStep('otp'); setSeconds(30);
  };
  const verify = e => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code.');
    localStorage.setItem('ksb.user', JSON.stringify({ phone: digits }));
    nav('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-cream flex items-start justify-center pt-16 md:pt-24 p-4">
      <Reveal className="w-full max-w-sm panel rounded-2xl shadow-soft p-6 md:p-8 border border-pastel-sand/50">
        <Link className="flex justify-center mb-4" aria-label="Desert Forest — Home" to="/">
          <img alt="Desert Forest" fetchpriority="high" width="180" height="72" decoding="async" className="h-16 md:h-20 w-auto" src="/desert-forest-logo.svg" />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-cocoa mb-6 text-center">Welcome to Desert Forest</h1>
        {step === 'phone' ? (
          <form className="space-y-4" onSubmit={sendOtp}>
            <div>
              <label className={labelCls} htmlFor="phone">Mobile number</label>
              <input className={`${inputCls} mt-1`} id="phone" placeholder="9876543210" maxLength={12} type="tel" inputMode="numeric" autoComplete="tel-national" autoFocus value={phone} onChange={e => setPhone(e.target.value)} />
              {error && <p className="mt-1.5 font-sans text-xs text-red-600" role="alert">{error}</p>}
            </div>
            <button className={primaryBtnCls} type="submit">Send OTP</button>
          </form>
        ) : (
          <form className="space-y-4 animate-in fade-in duration-200" onSubmit={verify}>
            <p className="text-center font-sans text-sm text-cocoa-light">Enter the 6-digit code sent to <strong className="text-cocoa">+91 {digits}</strong></p>
            <div>
              <label className={labelCls} htmlFor="otp">One-time password</label>
              <input className={`${inputCls} mt-1 text-center tracking-[0.5em]`} id="otp" placeholder="••••••" maxLength={6} inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
              {error && <p className="mt-1.5 font-sans text-xs text-red-600" role="alert">{error}</p>}
            </div>
            <button className={primaryBtnCls} type="submit">Verify &amp; continue</button>
            <div className="flex items-center justify-between font-sans text-xs text-cocoa-light">
              <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="inline-flex items-center gap-1 hover:text-accent"><ArrowLeft className="h-3.5 w-3.5" />Change number</button>
              <button type="button" disabled={seconds > 0} onClick={() => setSeconds(30)} className="hover:text-accent disabled:opacity-60">{seconds ? `Resend in ${seconds}s` : 'Resend OTP'}</button>
            </div>
          </form>
        )}
      </Reveal>
    </div>
  );
}
