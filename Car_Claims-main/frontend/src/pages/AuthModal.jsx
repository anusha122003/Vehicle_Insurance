import { useState, useEffect, useRef } from 'react';
import { translations } from '../utils/translations.js';
import { 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  CheckCircle, 
  Car, 
  Shield, 
  Wrench, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

function AuthModal({ isOpen, onClose, initialMode = 'signin', onAuthSuccess, currentLanguage }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'signup'
  const [signupStep, setSignupStep] = useState(1); // 1, 2, 3 or 'success'

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['English']?.[key] || key;
  };

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login Role selection
  const [loginRole, setLoginRole] = useState('customer'); // 'customer', 'admin', 'technician'

  const handleRoleSwitch = (selectedRole) => {
    setLoginRole(selectedRole);
    if (selectedRole === 'customer') {
      setEmail('customer@autoshield.ai');
      setPassword('password123');
    } else if (selectedRole === 'admin') {
      setEmail('admin@autoshield.ai');
      setPassword('password123');
    } else if (selectedRole === 'technician') {
      setEmail('tech@autoshield.ai');
      setPassword('password123');
    }
  };

  // Sign up input states
  const [role, setRole] = useState(''); // 'customer', 'admin', 'technician'
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Verification states
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Error/loading states
  const [errors, setErrors] = useState({});
  const [isShakeActive, setIsShakeActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize modal state on initial trigger
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSignupStep(1);
      resetForm();
      // Default initial role select to customer and prefill values
      handleRoleSwitch('customer');
    }
  }, [isOpen, initialMode]);

  // Countdown timer for email verification resend button
  useEffect(() => {
    let timer;
    if (mode === 'signup' && signupStep === 3 && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [mode, signupStep, countdown]);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole('');
    setFullName('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setVerificationCode(['', '', '', '', '', '']);
    setErrors({});
    setIsShakeActive(false);
    setIsLoading(false);
    setCountdown(60);
    setCanResend(false);
  };

  const triggerShake = () => {
    setIsShakeActive(true);
    setTimeout(() => setIsShakeActive(false), 250);
  };

  // Password strength analyzer
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', colorClass: '' };
    let score = 0;
    
    // length criteria
    if (pass.length >= 8) score++;
    
    // uppercase & lowercase
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
    
    // number criteria
    if (/\d/.test(pass)) score++;
    
    // special character
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, text: '✗ Password is too weak', colorClass: 'weak' };
      case 2:
        return { score: 2, text: '⚠ Password is fair. Consider adding more complexity.', colorClass: 'fair' };
      case 3:
        return { score: 3, text: '✓ Password is good.', colorClass: 'good' };
      case 4:
        return { score: 4, text: '✓✓ Password is strong.', colorClass: 'strong' };
      default:
        return { score: 0, text: '', colorClass: '' };
    }
  };

  const strength = getPasswordStrength(password);

  // Sign In submission handler
  const handleSignIn = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email format.';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Mock Login Network Call
    setTimeout(() => {
      setIsLoading(false);
      
      // Determine simulated role based on the selected loginRole tab, with fallback checks for email keywords
      let userRole = loginRole;
      const cleanEmail = email.toLowerCase();
      if (cleanEmail.includes('admin') || cleanEmail.includes('manager')) {
        userRole = 'admin';
      } else if (cleanEmail.includes('customer') || cleanEmail.includes('client') || cleanEmail.includes('john') || cleanEmail.includes('user')) {
        userRole = 'customer';
      } else if (cleanEmail.includes('tech') || cleanEmail.includes('field') || cleanEmail.includes('agent') || cleanEmail.includes('technician')) {
        userRole = 'technician';
      }
      
      const simulatedUser = {
        email: email,
        fullName: email.split('@')[0].toUpperCase(),
        role: userRole
      };
      
      onAuthSuccess(simulatedUser);
      onClose();
    }, 1500);
  };

  // Sign Up step workflows
  const handleSignupStep1 = () => {
    if (!role) {
      triggerShake();
      setErrors({ role: 'Please choose an account type to continue.' });
      return;
    }
    setErrors({});
    setSignupStep(2);
  };

  const handleSignupStep2 = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName || fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name is required and must be at least 3 letters.';
    }

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (email.toLowerCase() === 'taken@email.com') {
      newErrors.email = 'This email is already registered. Try signing in or use a different email.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (strength.score < 2) {
      newErrors.password = 'Password does not meet minimal complexity.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service & Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Mock unique email check or network creation
    setTimeout(() => {
      setIsLoading(false);
      setCountdown(60);
      setCanResend(false);
      setSignupStep(3);
    }, 1200);
  };

  // Step 3 6-Digit input changes
  const handleCodeChange = (index, val) => {
    if (isNaN(val)) return;
    const newCode = [...verificationCode];
    newCode[index] = val.slice(-1); // Only accept 1 digit
    setVerificationCode(newCode);

    // Auto focus next box
    if (val !== '' && index < 5) {
      codeRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace to focus previous box
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      codeRefs[index - 1].current.focus();
    }
  };

  const handleVerifyCode = () => {
    const fullCode = verificationCode.join('');
    if (fullCode.length < 6) {
      setErrors({ code: 'Please fill in all 6 verification digits.' });
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Mock Code Verification validation
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep('success');
    }, 1500);
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    alert('A new 6-digit confirmation code has been dispatched to ' + email);
  };

  const handleSuccessRedirect = () => {
    const simulatedUser = {
      email: email,
      fullName: fullName || 'New User',
      role: role
    };
    onAuthSuccess(simulatedUser);
    onClose();
  };

  return (
    <div className="autoshield-modal-overlay" onClick={onClose}>
      <div 
        className={`autoshield-modal-container ${
          mode === 'signup' && signupStep === 1 ? 'autoshield-modal-container-wide' : ''
        } ${isShakeActive ? 'autoshield-shake-error' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Handle Button */}
        <button className="autoshield-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>

        {/* ==========================================
            1. SIGN IN INTERFACE VIEWPORT
            ========================================== */}
        {mode === 'signin' && (
          <div>
            <h2 className="autoshield-modal-headline">{t('welcomeBack')}</h2>
            <p className="autoshield-modal-subheading">{t('signinSub')}</p>

            {/* Premium Role Selector Tabs */}
            <div className="autoshield-login-role-tabs">
              <button
                type="button"
                className={`autoshield-login-role-tab ${loginRole === 'customer' ? 'active' : ''}`}
                onClick={() => handleRoleSwitch('customer')}
              >
                <Car className="w-4 h-4" />
                <span>{t('userRole')}</span>
              </button>
              <button
                type="button"
                className={`autoshield-login-role-tab ${loginRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleSwitch('admin')}
              >
                <Shield className="w-4 h-4" />
                <span>{t('adminRole')}</span>
              </button>
              <button
                type="button"
                className={`autoshield-login-role-tab ${loginRole === 'technician' ? 'active' : ''}`}
                onClick={() => handleRoleSwitch('technician')}
              >
                <Wrench className="w-4 h-4" />
                <span>{t('techRole')}</span>
              </button>
            </div>

            <form onSubmit={handleSignIn}>
              {/* Email Control */}
              <div className="autoshield-form-group">
                <label className="autoshield-label" htmlFor="email-input">{t('emailAddr')}</label>
                <div className="autoshield-input-wrapper">
                  <input
                    id="email-input"
                    type="email"
                    className={`autoshield-input ${errors.email ? 'autoshield-input-error' : ''}`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {errors.email && <span className="autoshield-error-text">{errors.email}</span>}
              </div>

              {/* Password Control */}
              <div className="autoshield-form-group">
                <label className="autoshield-label" htmlFor="password-input">{t('passwordLabel')}</label>
                <div className="autoshield-input-wrapper">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    className={`autoshield-input ${errors.password ? 'autoshield-input-error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="autoshield-input-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <span className="autoshield-error-text">{errors.password}</span>}
              </div>

              {/* Remember & Forgot Password Link */}
              <div className="autoshield-form-links-row">
                <label className="autoshield-checkbox-container">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="autoshield-checkmark"></span>
                  {t('rememberMe')}
                </label>

                <span 
                  className="autoshield-forgot-link" 
                  onClick={() => alert('Instructions to reset your password have been delivered to your email.')}
                >
                  {t('forgotPass')}
                </span>
              </div>

              {/* Action Trigger Button */}
              <button 
                type="submit" 
                className="autoshield-btn autoshield-btn-primary"
                style={{ width: '100%', height: '48px' }}
                disabled={isLoading}
              >
                {isLoading ? <div className="autoshield-spinner" /> : t('signInBtn')}
              </button>
            </form>

            <div className="autoshield-social-divider">{t('orContinue')}</div>

            <div className="autoshield-social-row">
              <button className="autoshield-social-btn" onClick={() => alert('Redirecting to Google Social Login...')} title="Continue with Google">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </button>
              <button className="autoshield-social-btn" onClick={() => alert('Redirecting to Apple Social Login...')} title="Continue with Apple">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#000000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.48-.62.71-1.16 1.85-1.02 2.96 1.09.08 2.21-.57 2.91-1.38" />
                </svg>
              </button>
              <button className="autoshield-social-btn" onClick={() => alert('Redirecting to Microsoft Social Login...')} title="Continue with Microsoft">
                <svg viewBox="0 0 23 23" width="20" height="20">
                  <rect x="0" y="0" width="11" height="11" fill="#F25022" />
                  <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
                  <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
                  <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
                </svg>
              </button>
            </div>

            <p className="autoshield-modal-footer-text">
              {t('noAccount')}{' '}
              <span className="autoshield-modal-footer-link" onClick={() => setMode('signup')}>
                {t('createOne')}
              </span>
            </p>
          </div>
        )}

        {/* ==========================================
            2. SIGN UP INTERFACE WIZARD FLOW
            ========================================== */}
        {mode === 'signup' && (
          <div>
            {/* STEP 1: ROLE SELECTION CARDS GRID */}
            {signupStep === 1 && (
              <div>
                <h2 className="autoshield-modal-headline" style={{ textAlign: 'center' }}>Choose Your Account Type</h2>
                <p className="autoshield-modal-subheading" style={{ textAlign: 'center', marginBottom: '32px' }}>
                  Select the role that best fits your needs.
                </p>

                <div className="autoshield-signup-roles-grid">
                  {/* Card 1: Customer */}
                  <div 
                    className={`autoshield-signup-role-card ${role === 'customer' ? 'selected' : ''}`}
                    onClick={() => { setRole('customer'); setErrors({}); }}
                  >
                    <div className="autoshield-signup-role-icon">
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="autoshield-signup-role-info">
                      <h4 className="autoshield-signup-role-title">Individual Customer</h4>
                      <p className="autoshield-signup-role-desc">
                        File and manage your insurance claims. Upload photos of damage and get instant assessments.
                      </p>
                      <div className="autoshield-role-feature-li" style={{ color: 'var(--autoshield-text-secondary)', fontSize: '12px' }}>
                        ✓ Upload damage photos &middot; ✓ Instant AI assessment &middot; ✓ Track payout
                      </div>
                    </div>
                    {role === 'customer' && (
                      <div className="autoshield-signup-role-checkmark-badge">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Card 2: Admin */}
                  <div 
                    className={`autoshield-signup-role-card ${role === 'admin' ? 'selected' : ''}`}
                    onClick={() => { setRole('admin'); setErrors({}); }}
                  >
                    <div className="autoshield-signup-role-icon">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="autoshield-signup-role-info">
                      <h4 className="autoshield-signup-role-title">Administrator</h4>
                      <p className="autoshield-signup-role-desc">
                        Manage claims, configure policies, and monitor fraud detection. Full system access.
                      </p>
                      <div className="autoshield-role-feature-li" style={{ color: 'var(--autoshield-text-secondary)', fontSize: '12px' }}>
                        ✓ Review all claims &middot; ✓ Fraud detection alerts &middot; ✓ Analytics dashboard
                      </div>
                    </div>
                    {role === 'admin' && (
                      <div className="autoshield-signup-role-checkmark-badge">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Card 3: Technician */}
                  <div 
                    className={`autoshield-signup-role-card ${role === 'technician' ? 'selected' : ''}`}
                    onClick={() => { setRole('technician'); setErrors({}); }}
                  >
                    <div className="autoshield-signup-role-icon">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div className="autoshield-signup-role-info">
                      <h4 className="autoshield-signup-role-title">Field Technician</h4>
                      <p className="autoshield-signup-role-desc">
                        Inspect damaged vehicles on-site. Capture photos and verify AI assessments in the field.
                      </p>
                      <div className="autoshield-role-feature-li" style={{ color: 'var(--autoshield-text-secondary)', fontSize: '12px' }}>
                        ✓ Mobile photo capture &middot; ✓ Real-time sync &middot; ✓ Field damage reports
                      </div>
                    </div>
                    {role === 'technician' && (
                      <div className="autoshield-signup-role-checkmark-badge">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>

                {errors.role && (
                  <span className="autoshield-error-text" style={{ textAlign: 'center', marginBottom: '16px' }}>
                    {errors.role}
                  </span>
                )}

                <button 
                  onClick={handleSignupStep1}
                  className={`autoshield-btn ${role ? 'autoshield-btn-primary' : 'autoshield-btn-disabled'}`}
                  style={{ width: '100%', height: '48px' }}
                >
                  Continue to Step 2 <ArrowRight className="w-4 h-4" />
                </button>

                <p className="autoshield-modal-footer-text">
                  Already have an account?{' '}
                  <span className="autoshield-modal-footer-link" onClick={() => setMode('signin')}>
                    Sign In
                  </span>
                </p>
              </div>
            )}

            {/* STEP 2: PERSONAL INFORMATION FORM */}
            {signupStep === 2 && (
              <div>
                <h2 className="autoshield-modal-headline">Create Your Account</h2>
                <p className="autoshield-modal-subheading">Tell us a bit about yourself.</p>

                <form onSubmit={handleSignupStep2}>
                  {/* Full Name */}
                  <div className="autoshield-form-group">
                    <label className="autoshield-label" htmlFor="fullname-input">Full Name</label>
                    <div className="autoshield-input-wrapper">
                      <input
                        id="fullname-input"
                        type="text"
                        className={`autoshield-input ${errors.fullName ? 'autoshield-input-error' : ''}`}
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    {errors.fullName && <span className="autoshield-error-text">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="autoshield-form-group">
                    <label className="autoshield-label" htmlFor="signup-email-input">Email Address</label>
                    <div className="autoshield-input-wrapper">
                      <input
                        id="signup-email-input"
                        type="email"
                        className={`autoshield-input ${errors.email ? 'autoshield-input-error' : ''}`}
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && <span className="autoshield-error-text">{errors.email}</span>}
                  </div>

                  {/* Password */}
                  <div className="autoshield-form-group">
                    <label className="autoshield-label" htmlFor="signup-password-input">Password</label>
                    <div className="autoshield-input-wrapper">
                      <input
                        id="signup-password-input"
                        type={showPassword ? 'text' : 'password'}
                        className={`autoshield-input ${errors.password ? 'autoshield-input-error' : ''}`}
                        placeholder="Min. 8 chars, mixed letters & numbers"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="autoshield-input-toggle-eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Analyzer Meter */}
                    {password && (
                      <div className="autoshield-pw-strength-container">
                        <div className="autoshield-pw-strength-bar">
                          <div 
                            className="autoshield-pw-segment" 
                            style={{ 
                              backgroundColor: strength.score >= 1 
                                ? (strength.score === 1 ? 'var(--autoshield-error)' : strength.score === 2 ? '#F97316' : strength.score === 3 ? '#84CC16' : 'var(--autoshield-success)')
                                : '#E4E4E7' 
                            }} 
                          />
                          <div 
                            className="autoshield-pw-segment" 
                            style={{ 
                              backgroundColor: strength.score >= 2 
                                ? (strength.score === 2 ? '#F97316' : strength.score === 3 ? '#84CC16' : 'var(--autoshield-success)')
                                : '#E4E4E7' 
                            }} 
                          />
                          <div 
                            className="autoshield-pw-segment" 
                            style={{ 
                              backgroundColor: strength.score >= 3 
                                ? (strength.score === 3 ? '#84CC16' : 'var(--autoshield-success)')
                                : '#E4E4E7' 
                            }} 
                          />
                          <div 
                            className="autoshield-pw-segment" 
                            style={{ 
                              backgroundColor: strength.score >= 4 
                                ? 'var(--autoshield-success)' 
                                : '#E4E4E7' 
                            }} 
                          />
                        </div>
                        <span className={`autoshield-pw-strength-text ${strength.colorClass}`}>
                          {strength.text}
                        </span>
                      </div>
                    )}
                    {errors.password && <span className="autoshield-error-text">{errors.password}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className="autoshield-form-group">
                    <label className="autoshield-label" htmlFor="confirm-password-input">Confirm Password</label>
                    <div className="autoshield-input-wrapper">
                      <input
                        id="confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        className={`autoshield-input ${errors.confirmPassword ? 'autoshield-input-error' : ''}`}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    {errors.confirmPassword && <span className="autoshield-error-text">{errors.confirmPassword}</span>}
                  </div>

                  {/* Terms & Privacy checkbox */}
                  <div className="autoshield-form-group">
                    <label className="autoshield-checkbox-container" style={{ alignItems: 'flex-start' }}>
                      <input 
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span className="autoshield-checkmark" style={{ marginTop: '2px' }}></span>
                      <span style={{ fontSize: '13px', lineHeight: '1.4' }}>
                        I agree to the <span className="autoshield-modal-footer-link" onClick={(e) => { e.stopPropagation(); alert('Terms of Service Agreement Policy document'); }}>Terms of Service</span> and <span className="autoshield-modal-footer-link" onClick={(e) => { e.stopPropagation(); alert('Privacy Policy document'); }}>Privacy Policy</span>.
                      </span>
                    </label>
                    {errors.agreeTerms && <span className="autoshield-error-text">{errors.agreeTerms}</span>}
                  </div>

                  {/* Navigation step rows */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <button 
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="autoshield-btn autoshield-btn-secondary"
                      style={{ flex: 1, height: '48px' }}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="autoshield-btn autoshield-btn-primary"
                      style={{ flex: 2, height: '48px' }}
                      disabled={isLoading}
                    >
                      {isLoading ? <div className="autoshield-spinner" /> : 'Continue to Step 3'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: CODE VERIFICATION INPUTS */}
            {signupStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <h2 className="autoshield-modal-headline">Verify Your Email</h2>
                <p className="autoshield-modal-subheading">
                  We've sent a 6-digit confirmation code to <strong style={{ color: 'var(--autoshield-text-primary)' }}>{email}</strong>. Click the link or enter code to verify your account.
                </p>

                <div className="autoshield-verification-inputs">
                  {verificationCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={codeRefs[idx]}
                      type="text"
                      maxLength="1"
                      className="autoshield-verification-box"
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                    />
                  ))}
                </div>

                {errors.code && <span className="autoshield-error-text" style={{ marginBottom: '16px', display: 'block' }}>{errors.code}</span>}

                <div className="autoshield-verification-resend">
                  Didn't receive?{' '}
                  {canResend ? (
                    <span 
                      className="autoshield-modal-footer-link" 
                      onClick={handleResendCode}
                    >
                      Resend Link
                    </span>
                  ) : (
                    <span>
                      Resend in <span className="autoshield-resend-countdown">{countdown}s</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="autoshield-btn autoshield-btn-secondary"
                    style={{ flex: 1, height: '48px' }}
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={handleVerifyCode}
                    className="autoshield-btn autoshield-btn-primary"
                    style={{ flex: 2, height: '48px' }}
                    disabled={isLoading}
                  >
                    {isLoading ? <div className="autoshield-spinner" /> : 'Verify & Complete'}
                  </button>
                </div>
              </div>
            )}

            {/* SIGNUP WORKFLOW SUCCESS VIEWPORT */}
            {signupStep === 'success' && (
              <div className="autoshield-success-screen">
                <div className="autoshield-success-icon-box">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                
                <h2 className="autoshield-modal-headline" style={{ marginBottom: '12px' }}>Account Created Successfully!</h2>
                <p className="autoshield-modal-subheading" style={{ maxWidth: '320px', margin: '0 auto 28px' }}>
                  Welcome to AutoShield, {fullName.split(' ')[0]}! Your account is completely secure and verified.
                </p>

                <button 
                  onClick={handleSuccessRedirect}
                  className="autoshield-btn autoshield-btn-primary"
                  style={{ width: '100%', height: '48px', justifyContent: 'center' }}
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
