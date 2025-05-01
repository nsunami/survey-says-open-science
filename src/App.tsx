import { useMemo, useState } from "react"
import { questions } from "./data/os-retreat-2025-04-16"
import useSound from "use-sound"

import rightAnswerFx from "./sound/right-answer.mp3"
import wrongAnswerFx from "./sound/wrong-answer.mp3"
import nextQuestionFx from "./sound/next-question.mp3"
import stealFx from "./sound/steal.mp3"
import AnswerCard from "./components/AnswerCard"
import Logo from "./images/survey-says-logo.png"

function App() {
  const [currentQuestionId, setCurrentQuestionId] = useState(0)
  const [answers, setAnswers] = useState(questions[currentQuestionId].choices)
  const [totalScore, setTotalScore] = useState(0)
  const [strikes, setStrikes] = useState(0)

  const [playCorrect] = useSound(rightAnswerFx)
  const [playWrong] = useSound(wrongAnswerFx)
  const [playNextQuestion] = useSound(nextQuestionFx)
  const [playSteal] = useSound(stealFx)

  const title = useMemo(
    () => questions[currentQuestionId].text,
    [currentQuestionId]
  )

  const handleNextQuestion = () => {
    playNextQuestion()
    setStrikes(0)
    setCurrentQuestionId((current: number) => {
      if (current >= questions.length - 1) {
        return current
      }
      const nextQuestionId = current + 1
      setAnswers(questions[nextQuestionId].choices)
      return nextQuestionId
    })
  }

  const handleReveal = (id: number) => {
    playCorrect()
    setAnswers(
      answers.map((answer) => {
        if (answer.id === id && !answer.revealed) {
          setTotalScore(totalScore + answer.points)
          return { ...answer, revealed: true }
        }
        return answer
      })
    )
  }

  const handleStrike = () => {
    playWrong()
    if (strikes < 3) {
      setStrikes(strikes + 1)
    }
  }

  const resetGame = () => {
    setAnswers(answers.map((answer) => ({ ...answer, revealed: false })))
    setTotalScore(0)
    setStrikes(0)
  }

  const revealAll = () => {
    setAnswers(
      answers.map((answer) => {
        if (!answer.revealed) {
          setTotalScore(totalScore + answer.points)
          return { ...answer, revealed: true }
        }
        return answer
      })
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <img src={Logo} alt="Survey Says logo" className="w-64" />
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">{title}</h1>
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-4">
            {answers.map((answer) => {
              if (answer.id >= 6) return null
              return (
                <AnswerCard
                  answer={answer}
                  onClick={() => handleReveal(answer.id)}
                />
              )
            })}
          </div>
          <div className="flex flex-col gap-4">
            {answers.map((answer) => {
              if (answer.id < 6) return null
              return (
                <AnswerCard
                  answer={answer}
                  onClick={() => handleReveal(answer.id)}
                />
              )
            })}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-2xl mr-2">Strikes:</span>
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`text-4xl ${
                  i <= strikes ? "text-red-500" : "text-gray-600"
                }`}
              >
                X
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStrike}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold hover:cursor-pointer"
          >
            Strike
          </button>

          <button
            onClick={resetGame}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-lg font-bold hover:cursor-pointer"
          >
            Reset
          </button>
        </div>
        <div className="flex justify-center space-x-4 my-4">
          <button
            onClick={revealAll}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-lg font-bold hover:cursor-pointer"
          >
            Reveal All
          </button>
          <button
            onClick={handleNextQuestion}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-lg font-bold hover:cursor-pointer"
          >
            Next Question
          </button>
        </div>
        <div className="flex justify-center space-x-4 my-4">
          <button
            onClick={() => playSteal()}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-lg font-bold hover:cursor-pointer"
          >
            Steal
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
