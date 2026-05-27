'use client';

import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline'; // 버튼 스타일 변형
type ButtonSize = 'sm' | 'md' | 'lg'; // 버튼 크기 변형

type BaseButtonProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'href'
>;

interface ButtonProps extends BaseButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
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
  ...props
}) => {
  const baseClasses = "inline-block rounded-lg font-semibold transition-colors shadow hover:shadow-md disabled:opacity-50 border-2 font-sans";
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-yellow-500 text-black border-yellow-400 hover:bg-yellow-400",
    secondary: "bg-red-500 text-white border-red-600 hover:bg-red-600",
    outline: "bg-transparent text-white border-neutral-400 hover:bg-neutral-800 hover:border-white",
  };
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-3",
    lg: "px-10 py-4 text-lg",
  };
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ((as === 'a' || href) && href) {
    if (href.startsWith('/')) {
      return (
        <Link
          href={href}
          className={finalClassName}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={finalClassName}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={finalClassName}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
