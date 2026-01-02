
import React, { useState } from 'react';

interface SimulationOption {
  id: string;
  label: string;
  checked: boolean;
}

type ViewState = 'SCAN' | 'ERROR' | 'LOADING' | 'AUTH' | 'SUCCESS_FINAL' | 'VALIDATION_ERROR' | 'LOGIN_PAGE';

export const CustomerPhoneHome: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('SCAN');
  const [validationErrorMessage, setValidationErrorMessage] = useState<string>('');
  // Error type: 'expired' (Pad expired or race scene) | 'validation' (validation failed) | null
  const [errorType, setErrorType] = useState<'expired' | 'validation' | null>(null);
  const [options, setOptions] = useState<SimulationOption[]>([
    { id: 'login', label: '开启登录状态', checked: true },
    { id: 'wsm', label: '满足前置WSM活动参与资格', checked: true },
    { id: 'frequency', label: '满足面对面活动频次资格', checked: true },
    { id: 'race', label: '抢码场景', checked: false },
  ]);

  const toggleOption = (id: string) => {
    setOptions(options.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    ));
  };

  const showValidationError = (msg: string) => {
    setValidationErrorMessage(msg);
    setCurrentView('VALIDATION_ERROR');
  };

  const handleScanClick = () => {
    // 0. Check global Pad state first (Must be open)
    const padState = (window as any).__PAD_QR_STATE__;
    if (!padState || !padState.isOpen) {
      return;
    }

    const getOpt = (id: string) => options.find(o => o.id === id)?.checked;

    // --- CHECK 1: Pad QR is expired ---
    if (padState.status === 'expired') {
      setCurrentView('ERROR');
      setErrorType('expired');
      return; // Pad does NOT reset, user must manually refresh
    }

    // --- CHECK 2: Race scene (special case, no validation) ---
    if (getOpt('race')) {
      setCurrentView('ERROR');
      setErrorType('expired');
      return; // Pad does NOT reset, user must manually refresh
    }

    // --- CHECK 3: Login Status ---
    if (!getOpt('login')) {
      // Show login page, Pad stays in "校验中" state
      setCurrentView('LOGIN_PAGE');
      // Notify Pad to lock (show "校验中")
      window.dispatchEvent(new CustomEvent('pad-lock-qr'));
      return;
    }

    // Login is enabled, start validation sequence
    // Show loading and notify Pad to lock (show "校验中")
    setCurrentView('LOADING');
    window.dispatchEvent(new CustomEvent('pad-lock-qr'));

    // Helper to reset Pad and show error
    const handleValidationFailure = (message: string) => {
      showValidationError(message);
      setErrorType('validation');
      // Reset Pad from "校验中" back to initial state
      window.dispatchEvent(new CustomEvent('pad-reset-qr'));
    };

    // Helper for final success
    const handleSuccess = () => {
      setCurrentView('AUTH');
    };

    // Login is enabled, validate it (always pass in demo), then check WSM
    setTimeout(() => {
      // Step 2: Check WSM Qualification
      if (!getOpt('wsm')) {
        // WSM not enabled, show error
        handleValidationFailure('暂不满足活动参与资格');
        return;
      }

      // WSM is enabled, validate it (always pass in demo), then check Frequency
      setTimeout(() => {
        // Step 3: Check Frequency Qualification
        if (!getOpt('frequency')) {
          // Frequency not enabled, show error
          handleValidationFailure('暂不满足活动参与资格');
          return;
        }

        // All 3 enabled and passed, enter auth flow
        setTimeout(() => {
          handleSuccess();
        }, 800);
      }, 800);
    }, 800);
  };

  // Handle "确认登陆" button click from login page
  const handleConfirmLogin = () => {
    // Enable login option
    setOptions(options.map(opt =>
      opt.id === 'login' ? { ...opt, checked: true } : opt
    ));
    // Start validation sequence with login enabled
    setCurrentView('LOADING');
    window.dispatchEvent(new CustomEvent('pad-lock-qr'));

    const getOpt = (id: string) => options.find(o => o.id === id)?.checked;
    const handleValidationFailure = (message: string) => {
      showValidationError(message);
      setErrorType('validation');
      window.dispatchEvent(new CustomEvent('pad-reset-qr'));
    };
    const handleSuccess = () => {
      setCurrentView('AUTH');
    };

    // Step 2: Check WSM Qualification
    setTimeout(() => {
      if (!getOpt('wsm')) {
        handleValidationFailure('暂不满足活动参与资格');
        return;
      }

      setTimeout(() => {
        // Step 3: Check Frequency Qualification
        if (!getOpt('frequency')) {
          handleValidationFailure('暂不满足活动参与资格');
          return;
        }

        setTimeout(() => {
          handleSuccess();
        }, 800);
      }, 800);
    }, 800);
  };

  // Handle "取消" button click from login page
  const handleCancelLogin = () => {
    setCurrentView('SCAN');
    // Reset Pad QR back to initial state
    window.dispatchEvent(new CustomEvent('pad-reset-qr'));
  };

  const handleConfirmAuth = () => {
    // Exception Scenario: Check if Pad modal was closed while phone was on Auth page
    const padState = (window as any).__PAD_QR_STATE__;
    if (!padState || !padState.isOpen) {
      // If modal is closed, session is invalid/expired
      setCurrentView('ERROR');
      return;
    }

    setCurrentView('SUCCESS_FINAL');
    // Trigger Pad to jump to confirmation modal
    window.dispatchEvent(new CustomEvent('pad-confirm-qr'));
  };

  const handleCancelAuth = () => {
    setCurrentView('SCAN');
    // Reset Pad QR status to pending (awaiting scan)
    window.dispatchEvent(new CustomEvent('pad-reset-qr'));
    // Clear error type
    setErrorType(null);
  };

  const handleResetFlow = () => {
    setCurrentView('SCAN');
    // Only reset Pad QR if error was from validation (not expired/race)
    if (errorType === 'validation') {
      window.dispatchEvent(new CustomEvent('pad-reset-qr'));
    }
    // Clear error type
    setErrorType(null);
  };

  const renderScanView = () => (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <button 
            onClick={handleScanClick}
            className="w-32 h-32 rounded-full bg-[#d31145] shadow-2xl shadow-[#d31145]/30 flex flex-col items-center justify-center text-white group relative transition-all active:scale-95"
          >
            <i className="fas fa-qrcode text-4xl mb-2 relative z-10"></i>
            <span className="text-sm font-black relative z-10">扫一扫</span>
          </button>
          
          <p className="mt-8 text-slate-400 text-xs font-medium text-center leading-relaxed">
            点击上方按钮模拟 <br/>
            微信扫码流程
          </p>
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 p-6 pb-10 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-3 bg-[#d31145] rounded-full"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">模拟参数配置</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {options.map((opt) => (
            <div 
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={`
                flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer
                ${opt.checked 
                  ? 'bg-[#d31145]/5 border-[#d31145]/20' 
                  : 'bg-slate-50 border-slate-100'}
              `}
            >
              <div className={`
                w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all shrink-0
                ${opt.checked 
                  ? 'bg-[#d31145] border-[#d31145]' 
                  : 'bg-white border-slate-200'}
              `}>
                {opt.checked && <i className="fas fa-check text-[10px] text-white"></i>}
              </div>
              <span className={`text-xs font-bold ${opt.checked ? 'text-[#d31145]' : 'text-slate-500'}`}>
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderErrorView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
        <i className="fas fa-circle-exclamation text-4xl"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">二维码已失效</h3>
      <p className="text-slate-400 text-sm font-medium mb-12 text-center px-8 leading-relaxed">
        该二维码已失效，请重新扫码。
      </p>

      <button
        onClick={() => {
          setCurrentView('SCAN');
          // Only reset Pad QR if error was from validation (not expired/race)
          if (errorType === 'validation') {
            window.dispatchEvent(new CustomEvent('pad-reset-qr'));
          }
          setErrorType(null);
        }}
        className="w-full max-w-[200px] bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#d31145]/20 transition-all active:scale-95"
      >
        返回
      </button>
    </div>
  );

  const renderValidationErrorView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
        <i className="fas fa-exclamation-circle text-4xl"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">暂无法参与</h3>
      <p className="text-slate-400 text-sm font-medium mb-12 text-center px-8 leading-relaxed">
        {validationErrorMessage}
      </p>

      <button
        onClick={handleResetFlow}
        className="w-full max-w-[200px] bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#d31145]/20 transition-all active:scale-95"
      >
        返回
      </button>
    </div>
  );

  const renderLoginPage = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-[#d31145]/10 rounded-full flex items-center justify-center mb-6 text-[#d31145]">
        <i className="fas fa-user-lock text-4xl"></i>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">模拟登陆页面</h3>
      <p className="text-slate-400 text-sm font-medium mb-12 text-center px-8 leading-relaxed">
        请先登录后再参与活动
      </p>

      <button
        onClick={handleConfirmLogin}
        className="w-full max-w-[200px] bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#d31145]/20 transition-all active:scale-95 mb-4"
      >
        确认登陆
      </button>

      <button
        onClick={handleCancelLogin}
        className="w-full max-w-[200px] bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-95"
      >
        取消
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-[#d31145] border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-slate-500 font-bold animate-pulse text-sm text-center">正在安全验证...</p>
    </div>
  );

  const renderAuthView = () => (
    <div className="flex-1 flex flex-col p-8 bg-white animate-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-[#d31145]">
          <i className="fas fa-file-signature text-4xl"></i>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-4">您将参与面对面活动</h3>
        <p className="text-slate-500 font-medium leading-relaxed px-4">
          请确认是否同意授权您的信息参与本次活动。
        </p>
      </div>

      <div className="space-y-3 pb-8">
        <button 
          onClick={handleConfirmAuth}
          className="w-full bg-[#d31145] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
        >
          确认
        </button>
        <button 
          onClick={handleCancelAuth}
          className="w-full text-slate-400 font-bold py-3 transition-colors hover:text-slate-600"
        >
          取消
        </button>
      </div>
    </div>
  );

  const renderSuccessFinalView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500">
        <i className="fas fa-check-circle text-5xl"></i>
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">感谢您参与</h3>
      <p className="text-slate-500 font-medium mb-16">感谢您参与本次活动</p>
      
      <button 
        onClick={handleResetFlow}
        className="w-full max-w-[200px] bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
      >
        返回
      </button>
    </div>
  );

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      {/* Brand Header */}
      <div className="h-14 bg-white flex items-center justify-center px-4 shrink-0 border-b border-slate-100 shadow-sm relative z-20">
        <span className="font-bold text-slate-800 text-sm tracking-tight">职域服务助手</span>
      </div>

      {currentView === 'SCAN' && renderScanView()}
      {currentView === 'ERROR' && renderErrorView()}
      {currentView === 'LOADING' && renderLoadingView()}
      {currentView === 'AUTH' && renderAuthView()}
      {currentView === 'SUCCESS_FINAL' && renderSuccessFinalView()}
      {currentView === 'VALIDATION_ERROR' && renderValidationErrorView()}
      {currentView === 'LOGIN_PAGE' && renderLoginPage()}

      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-200 rounded-full z-20"></div>
    </div>
  );
};
