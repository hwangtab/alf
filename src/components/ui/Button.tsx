'use client';

import React from 'react';
import Link from 'next/link';
import { motion, MotionProps } from 'framer-motion';
// import { UrlObject } from 'url'; // 사용하지 않으므로 제거

type ButtonVariant = 'primary' | 'secondary' | 'outline'; // 버튼 스타일 변형
type ButtonSize = 'sm' | 'md' | 'lg'; // 버튼 크기 변형

// HTMLAnchorElement와 HTMLButtonElement의 공통 속성 + motion props + 커스텀 props
type BaseButtonProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'href'> & MotionProps;

interface ButtonProps extends BaseButtonProps {
  children: React.ReactNode;
  href?: string; // UrlObject 제거, string | undefined 로 단순화 (motion.a 호환)
  onClick?: any; // 타입 단순화 (any)
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  as?: 'button' | 'a'; // 렌더링할 태그 타입 지정 (기본값은 href 유무로 결정)
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary', // 기본 variant
  size = 'md', // 기본 size
  className = '',
  as,
  disabled = false,
  ...props // 나머지 모든 props (motion props 포함)
}) => {
  // 기본 스타일 클래스
  const baseClasses = "inline-block rounded-lg font-semibold transition-colors shadow hover:shadow-md disabled:opacity-50 border-2";

  // Variant별 스타일
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-yellow-500 text-black border-yellow-400 hover:bg-yellow-400", // !important 제거, 다시 시도
    secondary: "bg-red-500 text-white border-red-600 hover:bg-red-600", // 예시: 빨간색 버튼
    outline: "bg-transparent text-white border-neutral-400 hover:bg-neutral-800 hover:border-white", // 예시: 외곽선 버튼
  };

  // Size별 스타일
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3", // 기본 크기
    lg: "px-10 py-4 text-lg",
  };

  // 최종 클래스 조합 (단순화)
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  // 애니메이션 설정
  const animationProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    ...props // 전달받은 motion props 적용
  };

  // 렌더링할 태그 결정 (as prop 우선, 없으면 href 유무로 결정)
  const Tag = as ? (as === 'a' ? motion.a : motion.button) : href ? motion.a : motion.button;




  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const commonProps = {
    className: finalClassName,
    disabled: disabled,
    ...animationProps, // Framer Motion props 포함
  };

  if (Tag === motion.a && href) {
    // Next.js Link의 기능을 사용하고 싶다면 Link 컴포넌트를 활용
    // 여기서는 간단하게 motion.a 사용
    // href 타입이 string | undefined 이므로 UrlObject 변환 불필요
    return (
      <Tag href={href} {...commonProps} onClick={onClick}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag type={Tag === motion.button ? 'button' : undefined} {...commonProps} onClick={onClick}>
      {children}
    </Tag>
  );
};

export default Button;
