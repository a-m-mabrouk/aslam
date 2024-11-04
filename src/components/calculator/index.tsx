import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { create, all } from 'mathjs';

type Operator = '+' | '-' | '*' | '/' | '%' | '^' | '√' | 'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'π' | 'e';

const math = create(all, {
  number: 'number',
  precision: 14
});

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const handleButtonClick = (value: string | Operator) => {
    switch (value) {
      case 'C':
        setDisplay('');
        setResult(null);
        break;
      case '=':
        calculateResult();
        break;
      case 'π':
        setDisplay(display + math.pi);
        break;
      case 'e':
        setDisplay(display + math.e);
        break;
      case '√':
        setDisplay(display + 'sqrt(');
        break;
      case '^':
        setDisplay(display + '^');
        break;
      default:
        setDisplay(display + value);
        break;
    }
  };

  const calculateResult = () => {
    try {
      const evalResult = math.evaluate(display);
      setResult(evalResult);
      setDisplay(`${evalResult}`);
    } catch (error) {
      setDisplay('Error');
    }
  };

  const buttons = [
    { label: 'C', style: 'bg-orange-400' }, { label: '(', style: 'bg-blue-300' }, { label: ')', style: 'bg-blue-300' }, { label: '<=', style: 'bg-orange-400' },
    { label: '%', style: 'bg-blue-300' }, { label: 'x l', style: 'bg-blue-300' }, { label: 'x^', style: 'bg-blue-300' },
    { label: '7', style: 'bg-gray-400' }, { label: '8', style: 'bg-gray-400' }, { label: '9', style: 'bg-gray-400' }, { label: '*', style: 'bg-blue-300' }, { label: '/', style: 'bg-blue-300' },
    { label: 'ln', style: 'bg-blue-300' }, { label: 'e', style: 'bg-blue-300' },
    { label: '4', style: 'bg-gray-400' }, { label: '5', style: 'bg-gray-400' }, { label: '6', style: 'bg-gray-400' }, { label: '+', style: 'bg-blue-300' }, { label: '-', style: 'bg-blue-300' },
    { label: 'x²', style: 'bg-blue-300' }, { label: '√', style: 'bg-blue-300' },
    { label: '1', style: 'bg-gray-400' }, { label: '2', style: 'bg-gray-400' }, { label: '3', style: 'bg-gray-400' }, { label: 'sin', style: 'bg-blue-300' }, { label: 'tan', style: 'bg-blue-300' },
    { label: '±', style: 'bg-blue-300' }, { label: '0', style: 'bg-gray-400' }, { label: '.', style: 'bg-blue-300' }, { label: '=', style: 'bg-orange-400' },
    { label: 'π', style: 'bg-blue-300' }, { label: '°', style: 'bg-blue-300' }, { label: 'rad', style: 'bg-blue-300' }
  ];

  return (
    <div className="max-w-md mx-auto bg-[#fdf6e3] p-4 rounded-lg shadow-lg">
      <div className="bg-gray-800 text-white p-4 rounded-md text-right text-2xl mb-4 h-16">
        {display || result || '0'}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={() => handleButtonClick(btn.label as Operator | string)}
            className={`p-2 rounded-lg text-xl font-semibold ${btn.style} text-black`}
          >
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
