// ============================================
// components/CheckoutSteps.js - خطوات الشراء
// ============================================
// يعرض: [1. Shopping cart] -> [2. Checkout] -> [3. Complete]

import React from 'react';

function CheckoutSteps({ currentStep }) {
  // تعريف الخطوات
  const steps = [
    { number: 1, label: 'Shopping cart' },
    { number: 2, label: 'Checkout details' },
    { number: 3, label: 'Order complete' },
  ];

  return (
    <div className="checkout-steps">
      {steps.map(function (step, index) {
        const isDone   = step.number < currentStep;  // خطوة مكتملة
        const isActive = step.number === currentStep; // الخطوة الحالية

        // تحديد كلاس الخطوة
        let stepClass = 'step';
        if (isDone)   stepClass += ' done';
        if (isActive) stepClass += ' active';

        return (
          <React.Fragment key={step.number}>
            {/* الخطوة */}
            <div className={stepClass}>
              <div className="step-num">
                {isDone ? <i className="bi bi-check-lg"></i> : step.number}
              </div>
              <span className="step-label">{step.label}</span>
            </div>

            {/* الخط الفاصل بين الخطوات (ما عدا الأخيرة) */}
            {index < steps.length - 1 && (
              <div className={'step-line' + (isDone ? ' done' : '') + (isActive ? ' active' : '')}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default CheckoutSteps;
