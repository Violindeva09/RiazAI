import { forwardRef } from 'react';

const Card = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`card ${className}`} {...props}>
    {children}
  </div>
));

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className = '', children, ...props }, ref) => (    <div ref={ref} className={`px-6 py-4 border-b border-slate-200 dark:border-slate-700 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className = '', children, ...props }, ref) => (    <div ref={ref} className={`px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-xl ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;