import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, User, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import Header from "@/components/Header";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const signupSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  university: z.string().optional(),
  user_type: z.enum(["student", "owner"]),
  terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
});

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"student" | "owner">("student");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login"
  );

  const handleTabChange = (value: string) => {
    const v = value === "register" ? "register" : "login";
    setTab(v as "login" | "register");
    setSearchParams({ tab: v });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Sync tab state with URL changes
  useEffect(() => {
    const next = searchParams.get("tab") === "register" ? "register" : "login";
    setTab(next);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      loginSchema.parse(data);
      const { error } = await signIn(data.email, data.password);
      
      if (!error) {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      university: formData.get("university") as string,
      user_type: userType,
      terms: formData.get("terms") === "on",
    };

    try {
      signupSchema.parse(data);
      const { error } = await signUp(data.email, data.password, {
        full_name: data.full_name,
        phone: data.phone,
        university: data.university,
        user_type: data.user_type,
      });
      
      if (error) {
        const raw = (error?.message || '').toLowerCase();
        const isDup = raw.includes('já existe') || raw.includes('already registered') || raw.includes('already exists') || raw.includes('user already exists') || raw.includes('duplicate key') || raw.includes('email') && raw.includes('exists');
        setErrors({
          email: isDup
            ? 'Este email já está cadastrado. Faça login ou use outro email.'
            : (error?.message || 'Erro ao criar conta. Tente novamente.'),
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo ao Fushub</h1>
            <p className="text-muted-foreground">Entre ou crie sua conta para continuar</p>
          </div>

          <Card className="shadow-medium">
            <CardContent className="p-6">
              <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          required
                          className={errors.password ? "border-destructive" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                          Lembrar-me
                        </label>
                      </div>
                      <a href="#" className="text-secondary hover:underline">
                        Esqueceu a senha?
                      </a>
                    </div>

                    <Button type="submit" variant="hero" className="w-full hover:scale-105 transition-transform" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de usuário</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setUserType("student")}
                          className={`p-4 border rounded-lg text-center transition-all ${
                            userType === "student" 
                              ? "border-secondary bg-secondary/10 text-secondary scale-105" 
                              : "border-border hover:border-secondary/50 hover:scale-105"
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Estudante</div>
                          <div className="text-xs text-muted-foreground">Procurando moradia</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType("owner")}
                          className={`p-4 border rounded-lg text-center transition-all ${
                            userType === "owner" 
                              ? "border-secondary bg-secondary/10 text-secondary scale-105" 
                              : "border-border hover:border-secondary/50 hover:scale-105"
                          }`}
                        >
                          <Home className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Proprietário</div>
                          <div className="text-xs text-muted-foreground">Tenho imóveis</div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome completo</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="João Silva"
                        required
                        className={errors.full_name ? "border-destructive" : ""}
                      />
                      {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>

                    {userType === "student" && (
                      <div className="space-y-2">
                        <Label htmlFor="university">Universidade</Label>
                        <Input
                          id="university"
                          name="university"
                          type="text"
                          placeholder="USP, UNICAMP, etc."
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••"
                          required
                          className={errors.password ? "border-destructive" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" name="terms" className={errors.terms ? "border-destructive" : ""} />
                        <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                          Aceito os <a href="#" className="text-secondary hover:underline">termos de uso</a> e{" "}
                          <a href="#" className="text-secondary hover:underline">política de privacidade</a>
                        </label>
                      </div>
                      {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}

                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" />
                        <label htmlFor="newsletter" className="text-sm text-muted-foreground cursor-pointer">
                          Quero receber novidades por email
                        </label>
                      </div>
                    </div>

                    <Button type="submit" variant="hero" className="w-full hover:scale-105 transition-transform" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-secondary hover:underline">termos de serviço</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
