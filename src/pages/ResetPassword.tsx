import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useResetPassword, useVerifyResetToken } from "@/services/queryService";
import { PasswordInput } from "@/components/ui/password-input";

// Validation schemas
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordMutation = useResetPassword();
  const { data: tokenValidation, isLoading: isValidating, error: validationError } = useVerifyResetToken(token);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect if no token is provided
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // If token is invalid, show error and redirect
  useEffect(() => {
    if (!isValidating && token && validationError) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isValidating, token, validationError, navigate]);

  const handleSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          const timer = setTimeout(() => {
            navigate("/login");
          }, 2000);
          return () => clearTimeout(timer);
        },
      }
    );
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                Verifying reset link...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (token && !isValidating && validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Invalid or expired reset link. This link may have already been used or has expired.
              You will be redirected to the login page shortly.
            </AlertDescription>
          </Alert>
          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-center mb-2">Invalid Reset Link</h3>
              <p className="text-center text-muted-foreground text-sm mb-6">
                The password reset link you used is invalid or has expired.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show success message after password reset
  if (resetPasswordMutation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-center mb-2">Password Reset Successful</h3>
              <p className="text-center text-muted-foreground text-sm mb-6">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Aboosto Fleet
          </h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card className="shadow-lg border-border/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-6 duration-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>

          {tokenValidation?.data?.email && (
            <div className="px-6 pb-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Resetting password for: <strong>{tokenValidation.data.email}</strong>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your new password"
                          {...field}
                          disabled={resetPasswordMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm your new password"
                          {...field}
                          disabled={resetPasswordMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-md"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}