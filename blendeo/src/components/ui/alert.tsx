import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
<<<<<<< HEAD
);
=======
)
>>>>>>> 9f2d9b6f84b9b4941275b9f0c0918f549548d77d

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
<<<<<<< HEAD
));
Alert.displayName = "Alert";
=======
))
Alert.displayName = "Alert"
>>>>>>> 9f2d9b6f84b9b4941275b9f0c0918f549548d77d

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
<<<<<<< HEAD
));
AlertTitle.displayName = "AlertTitle";
=======
))
AlertTitle.displayName = "AlertTitle"
>>>>>>> 9f2d9b6f84b9b4941275b9f0c0918f549548d77d

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
<<<<<<< HEAD
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
=======
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
>>>>>>> 9f2d9b6f84b9b4941275b9f0c0918f549548d77d
