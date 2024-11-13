import { useState } from "react";
import { Button, Radio } from "flowbite-react";
import { BackspaceIcon } from "@heroicons/react/24/outline";

const Calculator = () => {
  const [calc, setCalc] = useState<string>("");
  const [runtimeAns, setRuntimeAns] = useState<string>("0");
  const [anglFunc, setAnglFunc] = useState<"Deg" | "Rad">("Deg");

  const handleButtonClick = (value: string) => {
    setCalc((prevInput) => (prevInput === "Error" ? value : prevInput + value));
  };

  const handleClear = () => setCalc("");
  const handleDelete = () => setCalc((prevInput) => prevInput.slice(0, -1));
  const handleCalculate = () => {
    try {
      const sanitizedCalc = calc.replace(/(?<!\d)0+(?=\d)/g, ""); // Remove leading zeros
      const result = eval(
        sanitizedCalc
          .replaceAll(
            "sin(",
            anglFunc === "Deg" ? "Math.sin(Math.PI / 180*" : "Math.sin(",
          )
          .replaceAll(
            "cos(",
            anglFunc === "Deg" ? "Math.cos(Math.PI / 180*" : "Math.cos(",
          )
          .replaceAll(
            "tan(",
            anglFunc === "Deg" ? "Math.tan(Math.PI / 180*" : "Math.tan(",
          )
          .replaceAll("ln", "Math.log")
          .replaceAll("log", "Math.log10")
          .replaceAll("√", "Math.sqrt")
          .replaceAll("π", "Math.PI")
          .replaceAll("ANS", `${runtimeAns}`)
          .replaceAll("^", "**")
          .replaceAll("%", "/100")
          .replaceAll("e^(", "Math.exp(")
          .replaceAll("E", "10**")
      ).toString();
      setCalc(result);
      setRuntimeAns(result);
    } catch {
      setCalc("Error");
    }
  };
  

  return (
    <div className="mx-auto flex flex-col gap-1 rounded-lg border border-gray-300 bg-white p-2 shadow-md">
      {/* Display */}
      <div className="flex min-h-[45px] items-center justify-end rounded-md border border-gray-200 bg-gray-50 p-2 text-lg font-semibold text-gray-800">
        {calc || "0"}
      </div>

      {/* Angle Selection */}
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center gap-2">
          <Radio
            id="rad-mode"
            name="angle-mode"
            value="Rad"
            checked={anglFunc === "Rad"}
            onChange={() => setAnglFunc("Rad")}
            className="text-blue-600"
          />
          <label className="cursor-pointer" htmlFor="rad-mode">Rad</label>
        </div>
        <div className="flex cursor-pointer items-center gap-2">
          <Radio
            id="deg-mode"
            name="angle-mode"
            value="Deg"
            checked={anglFunc === "Deg"}
            onChange={() => setAnglFunc("Deg")}
            className="text-blue-600"
          />
          <label className="cursor-pointer" htmlFor="deg-mode">Deg</label>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1">
        {[
          { label: "AC", action: handleClear, variant: "special" },
          { label: "(", action: () => handleButtonClick("(") },
          { label: ")", action: () => handleButtonClick(")") },
          { label: "%", action: () => handleButtonClick("%") },
          { label: "sin", action: () => handleButtonClick("sin(") },
          { label: "cos", action: () => handleButtonClick("cos(") },
          { label: "tan", action: () => handleButtonClick("tan(") },
          { label: "ln", action: () => handleButtonClick("ln(") },
          { label: "7", action: () => handleButtonClick("7") },
          { label: "8", action: () => handleButtonClick("8") },
          { label: "9", action: () => handleButtonClick("9") },
          { label: "÷", action: () => handleButtonClick("/") },
          { label: "4", action: () => handleButtonClick("4") },
          { label: "5", action: () => handleButtonClick("5") },
          { label: "6", action: () => handleButtonClick("6") },
          { label: "×", action: () => handleButtonClick("*") },
          { label: "1", action: () => handleButtonClick("1") },
          { label: "2", action: () => handleButtonClick("2") },
          { label: "3", action: () => handleButtonClick("3") },
          { label: "−", action: () => handleButtonClick("-") },
          { label: "0", action: () => handleButtonClick("0") },
          { label: ".", action: () => handleButtonClick(".") },
          { label: <BackspaceIcon className="size-5" />, action: handleDelete },
          { label: "+", action: () => handleButtonClick("+") },
          {
            label: "ANS",
            action: () => handleButtonClick("ANS"),
            variant: "secondary",
          },
          {
            label: "^",
            action: () => handleButtonClick("^"),
            variant: "secondary",
          },
          { label: "=", action: handleCalculate, variant: "primary" },
        ].map(({ label, action, variant = "default" }, index) => (
          <Button
            key={index}
            onClick={action}
            className={`h-9 w-11 p-0 text-xs ${
              variant === "primary"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : variant === "special"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : variant === "secondary"
                    ? "bg-gray-200 text-black"
                    : "bg-gray-600"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
