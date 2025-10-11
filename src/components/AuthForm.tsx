'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Lock, Mail, UserPlus, LogIn } from 'lucide-react'

interface User {
  name: string
  email: string
  password: string
}

interface AuthFormProps {
  onAuthSuccess: (user: User) => void
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Estados para cadastro
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // Estados para login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Simular banco de dados local (localStorage)
  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return []
    const users = localStorage.getItem('disc_users')
    return users ? JSON.parse(users) : []
  }

  const saveUser = (user: User) => {
    if (typeof window === 'undefined') return
    const users = getUsers()
    users.push(user)
    localStorage.setItem('disc_users', JSON.stringify(users))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validações
      if (!signupData.name.trim()) {
        throw new Error('Nome é obrigatório')
      }
      if (!signupData.email.trim()) {
        throw new Error('Email é obrigatório')
      }
      if (!signupData.password) {
        throw new Error('Senha é obrigatória')
      }
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error('Senhas não coincidem')
      }
      if (signupData.password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres')
      }

      // Verificar se email já existe
      const users = getUsers()
      const existingUser = users.find(user => user.email === signupData.email)
      if (existingUser) {
        throw new Error('Este email já está cadastrado')
      }

      // Simular delay de cadastro
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Criar novo usuário
      const newUser: User = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      }

      saveUser(newUser)
      onAuthSuccess(newUser)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validações
      if (!loginData.email.trim()) {
        throw new Error('Email é obrigatório')
      }
      if (!loginData.password) {
        throw new Error('Senha é obrigatória')
      }

      // Simular delay de login
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verificar credenciais
      const users = getUsers()
      const user = users.find(u => u.email === loginData.email && u.password === loginData.password)
      
      if (!user) {
        throw new Error('Email ou senha incorretos')
      }

      onAuthSuccess(user)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DISC Rápido
          </h1>
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full inline-block text-sm font-semibold">
            ⚡ Otnitec - Tecnologia em Avaliação Comportamental
          </div>
          <p className="text-lg text-gray-600">
            Faça login ou crie sua conta para acessar o teste DISC
          </p>
        </div>

        {/* Formulário de Auth */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Acesso ao Teste DISC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signup" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Criar Conta
                </TabsTrigger>
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </TabsTrigger>
              </TabsList>

              {/* Cadastro */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta e Iniciar Teste'}
                  </Button>
                </form>
              </TabsContent>

              {/* Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    size="lg"
                  >
                    {isLoading ? 'Entrando...' : 'Entrar e Iniciar Teste'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informações sobre o teste */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-blue-800 space-y-2">
              <p className="font-medium">🔒 Seus dados estão seguros</p>
              <p>
                Utilizamos apenas seu nome e email para personalizar o relatório. 
                Suas informações ficam armazenadas localmente no seu navegador.
              </p>
              <p className="text-blue-600 font-medium">
                ✨ Após o login, você terá acesso imediato ao teste DISC e poderá baixar seu relatório em PDF.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}