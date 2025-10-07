'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ChevronRight } from 'lucide-react'

interface Question {
  id: number
  question_text: string
  option_d: string
  option_i: string
  option_s: string
  option_c: string
}

interface DISCTestProps {
  questions: Question[]
  onComplete: (responses: any[]) => void
}

export default function DISCTest({ questions, onComplete }: DISCTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<any[]>([])
  const [selectedChoice, setSelectedChoice] = useState<string>('')
  const [startTime, setStartTime] = useState(Date.now())

  // Usar apenas as primeiras 25 questões
  const limitedQuestions = useMemo(() => {
    return questions.slice(0, 25)
  }, [questions])

  const currentQ = limitedQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / limitedQuestions.length) * 100

  // Opções de múltipla escolha A, B, C, D
  const multipleChoiceOptions = useMemo(() => {
    if (!currentQ) return []
    return [
      { key: 'A', trait: 'D', text: currentQ.option_d },
      { key: 'B', trait: 'I', text: currentQ.option_i },
      { key: 'C', trait: 'S', text: currentQ.option_s },
      { key: 'D', trait: 'C', text: currentQ.option_c }
    ]
  }, [currentQ])

  const handleNext = () => {
    if (!selectedChoice) return

    const timeSpent = (Date.now() - startTime) / 1000
    const selectedOption = multipleChoiceOptions.find(opt => opt.key === selectedChoice)
    
    const response = {
      qID: currentQ.id,
      choice: selectedChoice,
      trait: selectedOption?.trait,
      tempo_gasto: timeSpent
    }

    const newResponses = [...responses, response]

    if (currentQuestion === limitedQuestions.length - 1) {
      onComplete(newResponses)
    } else {
      setResponses(newResponses)
      setCurrentQuestion(currentQuestion + 1)
      setSelectedChoice('')
      setStartTime(Date.now())
    }
  }

  const canProceed = selectedChoice !== ''

  if (!currentQ) return null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header com progresso */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Teste DISC Rápido
        </h1>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Questão {currentQuestion + 1} de {limitedQuestions.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Questão atual */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {currentQ.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Opções de múltipla escolha */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 text-center">
              Escolha a opção que melhor descreve você:
            </h3>
            <RadioGroup value={selectedChoice} onValueChange={setSelectedChoice}>
              <div className="grid gap-4">
                {multipleChoiceOptions.map((option) => (
                  <div key={option.key} className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={option.key} 
                      id={`option-${option.key}`}
                      className="mt-1"
                    />
                    <Label 
                      htmlFor={`option-${option.key}`} 
                      className="flex-1 cursor-pointer p-4 rounded-lg border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 flex items-center gap-3"
                    >
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold min-w-[40px] text-center">
                        {option.key}
                      </span>
                      <span className="text-gray-700">{option.text}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Botão de próxima */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleNext}
              disabled={!canProceed}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              {currentQuestion === limitedQuestions.length - 1 ? 'Finalizar Teste' : 'Próxima Questão'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-blue-800 space-y-2">
            <p className="font-medium">💡 Instruções:</p>
            <p>Para cada situação, escolha a opção (A, B, C ou D) que melhor descreve seu comportamento natural.</p>
            <p>Responda de forma instintiva - sua primeira impressão é geralmente a mais precisa.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}