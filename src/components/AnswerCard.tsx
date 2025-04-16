type AnswerProps = {
  answer: {
    id: number
    text: string
    points: number
    revealed: boolean
  }
  onClick: () => void
}

export default function AnswerCard({ answer, onClick }: AnswerProps) {
  return (
    <div
      key={answer.id}
      onClick={onClick}
      className={`
    flex justify-between items-center p-4 rounded-lg cursor-pointer
    ${answer.revealed ? "bg-blue-600" : "bg-gray-700"}
    transition-all duration-300 h-16
  `}
    >
      <div className="font-bold text-xl">
        {answer.revealed ? answer.text : "?"}
      </div>
      <div
        className={`
    ${answer.revealed ? "bg-yellow-500" : "bg-gray-600"} 
    px-3 py-1 rounded-lg font-bold
  `}
      >
        {answer.revealed ? answer.points : ""}
      </div>
    </div>
  )
}
