import React, { useState } from 'react';
import { CheckCircle, XCircle, Upload, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswers: number[];
}

interface OptionButtonProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isAnswered: boolean;
  isMultipleChoice: boolean;
  onClick: (index: number) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  index,
  isSelected,
  isCorrect,
  isIncorrect,
  isAnswered,
  isMultipleChoice,
  onClick
}) => {
  const getButtonClasses = () => {
    let classes = "option-btn flex items-center w-full text-left p-4 rounded-xl border border-slate-300 bg-white transition-all duration-200 cursor-pointer";
    
    if (isAnswered) {
      classes += " cursor-not-allowed";
      if (isCorrect) {
        classes += " border-green-600 bg-green-50 text-green-700 font-semibold";
      } else if (isIncorrect) {
        classes += " border-red-600 bg-red-50 text-red-700 font-semibold";
      }
    } else {
      if (isSelected) {
        classes += " border-blue-500 bg-blue-50 text-blue-800";
      } else {
        classes += " hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.2)]";
      }
    }
    
    return classes;
  };

  const renderIcon = () => {
    if (isCorrect) {
      return <CheckCircle className="h-6 w-6 mr-3 text-green-600" />;
    }
    if (isIncorrect) {
      return <XCircle className="h-6 w-6 mr-3 text-red-600" />;
    }
    return <span className="w-8"></span>;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={() => !isAnswered && onClick(index)}
      disabled={isAnswered}
    >
      {renderIcon()}
      <span className="flex-1">{option}</span>
    </button>
  );
};

function App() {
  // Estados principales
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'study'>('setup');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lastQuestionIndex, setLastQuestionIndex] = useState(-1);
  const [fileName, setFileName] = useState("Haz clic aquí para seleccionar un archivo");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Manejo de carga de archivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedJson = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsedJson) && parsedJson.length > 0) {
            setAllQuestions(parsedJson);
          } else {
            throw new Error("El JSON debe ser un array de preguntas y no puede estar vacío.");
          }
        } catch (error) {
          alert(`Error al procesar el archivo JSON: ${(error as Error).message}`);
          setFileName("Haz clic aquí para seleccionar un archivo");
          setAllQuestions([]);
        }
      };
      reader.readAsText(file);
    }
  };

  // Iniciar estudio
  const startStudy = () => {
    if (allQuestions.length === 0) {
      alert("No se han cargado preguntas.");
      return;
    }
    setCurrentScreen('study');
    displayRandomQuestion();
  };

  // Mostrar pregunta aleatoria
  const displayRandomQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswers([]);
    setShowFeedback(false);
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allQuestions.length);
    } while (allQuestions.length > 1 && randomIndex === lastQuestionIndex);
    
    setLastQuestionIndex(randomIndex);
    setCurrentQuestion(allQuestions[randomIndex]);
  };

  // Manejo de selección de opciones
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    const isMultipleChoice = currentQuestion && currentQuestion.correctAnswers.length > 1;
    
    if (!isMultipleChoice) {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }
  };

  // Verificar respuesta
  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    setIsAnswered(true);
    setShowFeedback(true);
    
    const correctAnswers = [...currentQuestion.correctAnswers].sort();
    const userAnswers = [...selectedAnswers].sort();
    const correct = JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
    
    setIsCorrect(correct);
  };

  // Volver al menú
  const goBackToMenu = () => {
    setCurrentScreen('setup');
    setFileName("Haz clic aquí para seleccionar un archivo");
    setAllQuestions([]);
    setCurrentQuestion(null);
    setSelectedAnswers([]);
    setIsAnswered(false);
    setShowFeedback(false);
  };

  // Determinar si una opción es correcta/incorrecta
  const getOptionState = (index: number) => {
    if (!isAnswered || !currentQuestion) return {};
    
    const isCorrectOption = currentQuestion.correctAnswers.includes(index);
    const isSelectedOption = selectedAnswers.includes(index);
    
    return {
      isCorrect: isCorrectOption,
      isIncorrect: isSelectedOption && !isCorrectOption
    };
  };

  const isMultipleChoice = currentQuestion && currentQuestion.correctAnswers.length > 1;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="w-full max-w-3xl mx-auto">
        
        {/* Pantalla de configuración */}
        {currentScreen === 'setup' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-slate-900 mb-4">
              Simulador de Estudio Cisco
            </h1>
            <p className="text-slate-600 text-center mb-6">
              Sube un archivo JSON con tus preguntas para comenzar.
            </p>

            <label
              htmlFor="json-file-input"
              className="block p-4 border-2 border-dashed border-slate-300 rounded-xl text-center cursor-pointer bg-white hover:bg-slate-50 transition-colors duration-200"
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <span className="font-semibold text-blue-600">{fileName}</span>
            </label>
            <input
              type="file"
              id="json-file-input"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />

            <button
              onClick={startStudy}
              disabled={allQuestions.length === 0}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Iniciar Estudio
            </button>
            
            <div className="mt-8 p-4 bg-slate-100 rounded-lg text-sm">
              <p className="font-semibold mb-2 text-slate-700">
                Formato del archivo JSON esperado:
              </p>
              <pre className="whitespace-pre-wrap text-slate-500 bg-slate-200 p-2 rounded text-xs">
{`[
  {
    "question": "¿Pregunta 1?",
    "options": ["Opción A", "Opción B"],
    "correctAnswers": [0]
  },
  {
    "question": "¿Pregunta 2? (Elija dos)",
    "options": ["Opción 1", "Opción 2", "Opción 3"],
    "correctAnswers": [1, 2]
  }
]`}
              </pre>
            </div>
          </div>
        )}

        {/* Pantalla de estudio */}
        {currentScreen === 'study' && currentQuestion && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">
              <FileText className="inline h-6 w-6 mr-2" />
              Modo de Estudio: {fileName}
            </h1>
            
            <div className="text-lg sm:text-xl font-semibold mb-8 text-slate-900 min-h-[75px]">
              {currentQuestion.question}
              {isMultipleChoice && (
                <span className="text-sm font-normal text-slate-500 block mt-2">
                  (Puede tener varias respuestas correctas)
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={index}
                  option={option}
                  index={index}
                  isSelected={selectedAnswers.includes(index)}
                  isAnswered={isAnswered}
                  isMultipleChoice={!!isMultipleChoice}
                  onClick={handleOptionSelect}
                  {...getOptionState(index)}
                />
              ))}
            </div>

            <div className="mt-8 min-h-[60px] flex items-center justify-center">
              {!showFeedback ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswers.length === 0}
                  className="bg-blue-600 text-white w-full sm:w-auto py-3 px-10 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Revisar
                </button>
              ) : (
                <div className="text-center font-bold text-xl">
                  {isCorrect ? (
                    <span className="text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 mr-2" />
                      ¡Correcto!
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-center">
                      <XCircle className="h-6 w-6 mr-2" />
                      Incorrecto
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-between items-center flex-col sm:flex-row gap-4">
              <button
                onClick={goBackToMenu}
                className="bg-slate-200 text-slate-700 py-2 px-5 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cambiar Archivo
              </button>
              <button
                onClick={displayRandomQuestion}
                className="bg-slate-700 text-white py-2 px-8 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center"
              >
                Siguiente Pregunta Aleatoria
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;