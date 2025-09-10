import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Eye, EyeOff, Mail, Lock, User, Phone, Home, Facebook, Chrome } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'student' | 'owner'>('student');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo à Fushub
              </h1>
              <p className="text-muted-foreground">
                Entre na sua conta ou crie uma nova
              </p>
            </div>

            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Social Login */}
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" size="lg">
                        <Chrome className="w-5 h-5 mr-2" />
                        Continuar com Google
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Facebook className="w-5 h-5 mr-2" />
                        Continuar com Facebook
                      </Button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Ou continue com email
                        </span>
                      </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-12"
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Sua senha"
                          className="pl-10 pr-10 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Lembrar de mim</span>
                        </label>
                        <a href="#" className="text-sm text-secondary hover:underline">
                          Esqueci minha senha
                        </a>
                      </div>

                      <Button variant="hero" className="w-full" size="lg">
                        Entrar
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Criar nova conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* User Type Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Você é:</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUserType('student')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            userType === 'student' 
                              ? 'border-secondary bg-secondary/10 text-secondary' 
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Estudante</div>
                          <div className="text-xs text-muted-foreground">Procurando moradia</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType('owner')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            userType === 'owner' 
                              ? 'border-secondary bg-secondary/10 text-secondary' 
                              : 'border-border hover:border-secondary/50'
                          }`}
                        >
                          <Home className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Proprietário</div>
                          <div className="text-xs text-muted-foreground">Tenho imóveis</div>
                        </button>
                      </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Nome"
                            className="pl-10 h-12"
                          />
                        </div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Sobrenome"
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-12"
                        />
                      </div>

                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="(11) 99999-9999"
                          className="pl-10 h-12"
                        />
                      </div>

                      {userType === 'student' && (
                        <Input
                          placeholder="Universidade/Faculdade"
                          className="h-12"
                        />
                      )}

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Crie uma senha"
                          className="pl-10 pr-10 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-start space-x-2">
                          <input type="checkbox" className="rounded mt-1" />
                          <span className="text-sm text-muted-foreground">
                            Li e aceito os <a href="#" className="text-secondary hover:underline">Termos de Uso</a> e 
                            a <a href="#" className="text-secondary hover:underline">Política de Privacidade</a>
                          </span>
                        </label>
                        <label className="flex items-start space-x-2">
                          <input type="checkbox" className="rounded mt-1" />
                          <span className="text-sm text-muted-foreground">
                            Aceito receber comunicações por email sobre ofertas e novidades
                          </span>
                        </label>
                      </div>

                      <Button variant="hero" className="w-full" size="lg">
                        Criar conta
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Ao se cadastrar, você concorda com a verificação de identidade
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;