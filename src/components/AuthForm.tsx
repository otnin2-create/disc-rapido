'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

interface User {
  name: string
  email: string
  password: string
}

interface AuthFormProps {
  onAuthSuccess: (user: { name: string; email: string }) => void
  onCancel: () => void
}

export default function AuthForm({ onAuthSuccess, onCancel }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados do formulário
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Validação de email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Validação de senha
  const isValidPassword = (password: string) => {
    return password.length >= 6
  }

  // Função para fazer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validações
      if (!loginData.email || !loginData.password) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (!isValidEmail(loginData.email)) {
        throw new Error('Por favor, insira um email válido')
      }

      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verificar se usuário existe no localStorage
      const users = JSON.parse(localStorage.getItem('disc_users') || '[]')
      const user = users.find((u: User) => 
        u.email === loginData.email && u.password === loginData.password
      )

      if (!user) {
        throw new Error('Email ou senha incorretos')
      }

      setSuccess('Login realizado com sucesso!')
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        onAuthSuccess({ name: user.name, email: user.email })
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  // Função para fazer cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Validações
      if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
        throw new Error('Por favor, preencha todos os campos')
      }

      if (!isValidEmail(registerData.email)) {
        throw new Error('Por favor, insira um email válido')
      }

      if (!isValidPassword(registerData.password)) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      if (registerData.password !== registerData.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      // Simular delay de cadastro
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verificar se usuário já existe
      const users = JSON.parse(localStorage.getItem('disc_users') || '[]')
      const existingUser = users.find((u: User) => u.email === registerData.email)

      if (existingUser) {
        throw new Error('Este email já está cadastrado')
      }

      // Salvar novo usuário
      const newUser: User = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      }

      users.push(newUser)
      localStorage.setItem('disc_users', JSON.stringify(users))

      setSuccess('Cadastro realizado com sucesso!')
      
      // Aguardar um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        onAuthSuccess({ name: newUser.name, email: newUser.email })
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            DISC Rápido
          </h1>
          <p className="text-gray-600">Faça login ou cadastre-se para continuar</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Acesso ao Teste DISC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>

              {/* Aba de Login */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              {/* Aba de Cadastro */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        className="pl-10"
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        className="pl-10 pr-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Mensagens de erro e sucesso */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-800 text-sm">{success}</span>
              </div>
            )}

            {/* Botão de cancelar */}
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                onClick={onCancel}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações sobre segurança */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Seus dados são armazenados localmente e com segurança</p>
          <p>📧 Use um email válido para receber seu relatório</p>
        </div>
      </div>
    </div>
  )
}