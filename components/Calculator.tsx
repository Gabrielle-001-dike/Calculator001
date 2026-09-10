// components/Calculator.tsx
"use client";
import { useState, ReactNode } from "react";

type Operator = "+" | "-" | "*" | "/" | "^";
type BtnType = "num" | "op" | "eq";

function Btn({
  type,
  isPressed,
  onPressStart,
  onPressEnd,
  children,
  onClick,
  className = "",
}: {
  type: BtnType;
  isPressed: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const restShadow = type === "num" ? "shadow-[0_3px_0_#202022]" : "shadow-[0_3px_0_#b87b1f]";
  const pressShadow = type === "num" ? "shadow-[0_1px_0_#202022]" : "shadow-[0_1px_0_#b87b1f]";
  const bg = type === "num" ? "bg-[#3a3a3e] text-[#f5f5f0]" : "bg-[#f0a83c] text-[#1c1305]";
  const weight = type === "eq" ? "font-bold text-2xl" : "font-medium text-lg";

  return (
    <button
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      onClick={onClick}
      className={`h-14 rounded-2xl ${bg} ${weight} transition-transform
        ${isPressed ? `translate-y-[3px] ${pressShadow}` : restShadow}
        ${className}`}
    >
      {children}
    </button>
  );
}

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [stored, setStored] = useState<string | number | null>(null);
  const [pendingOp, setPendingOp] = useState<Operator | null>(null);
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false);
  const [pressed, setPressed] = useState<string | null>(null);

  const inputNum = (d: string) => {
    if (justEvaluated) {
      setDisplay(d);
      setJustEvaluated(false);
      return;
    }
    setDisplay(display === "0" ? d : display + d);
  };

  const inputDot = () => {
    if (justEvaluated) {
      setDisplay("0.");
      setJustEvaluated(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const compute = (
    a: string | number,
    b: string | number,
    op: Operator
  ): number | "Error" => {
    const numA = parseFloat(String(a));
    const numB = parseFloat(String(b));
    let r: number;
    if (op === "+") r = numA + numB;
    else if (op === "-") r = numA - numB;
    else if (op === "*") r = numA * numB;
    else if (op === "/") r = numB === 0 ? NaN : numA / numB;
    else r = Math.pow(numA, numB);
    return isNaN(r) ? "Error" : Math.round(r * 1e10) / 1e10;
  };

  const setOp = (op: Operator) => {
    if (pendingOp && !justEvaluated && stored !== null) {
      const result = compute(stored, display, pendingOp);
      setDisplay(String(result));
      setStored(result);
    } else {
      setStored(display);
    }
    setPendingOp(op);
    setJustEvaluated(true);
  };

  const equals = () => {
    if (pendingOp == null || stored === null) return;
    const result = compute(stored, display, pendingOp);
    setDisplay(String(result));
    setStored(null);
    setPendingOp(null);
    setJustEvaluated(true);
  };

  const clearAll = () => {
    setDisplay("0");
    setStored(null);
    setPendingOp(null);
    setJustEvaluated(false);
  };

  const deleteLast = () => {
    if (justEvaluated) return;
    setDisplay((prev) => {
      const next = prev.slice(0, -1);
      return next === "" || next === "-" ? "0" : next;
    });
  };

  const squareRoot = () => {
    const num = parseFloat(display);
    if (num < 0) {
      setDisplay("Error");
    } else {
      const result = Math.sqrt(num);
      setDisplay(String(Math.round(result * 1e10) / 1e10));
    }
    setStored(null);
    setPendingOp(null);
    setJustEvaluated(true);
  };

  const btnProps = (id: string) => ({
    isPressed: pressed === id,
    onPressStart: () => setPressed(id),
    onPressEnd: () => setPressed(null),
  });

  return (
    <div className="w-lg mx-auto p-5 bg-[#242427] border border-[#38383c] rounded-[32px] shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
      <div className="bg-[#18181a] text-[#f5f5f0] text-right font-mono font-medium text-4xl rounded-2xl px-4 py-4 mb-4 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] overflow-x-auto">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {/* Row 1 */}
        <Btn type="op" {...btnProps("clear")} onClick={clearAll}>C</Btn>
        <Btn type="op" {...btnProps("del")} onClick={deleteLast}>Del</Btn>
        <Btn type="op" {...btnProps("pow")} onClick={() => setOp("^")}>^</Btn>
        <Btn type="op" {...btnProps("plus")} onClick={() => setOp("+")}>+</Btn>

        {/* Row 2 */}
        {[7, 8, 9].map((n) => (
          <Btn key={n} type="num" {...btnProps(`n${n}`)} onClick={() => inputNum(String(n))}>{n}</Btn>
        ))}
        <Btn type="op" {...btnProps("minus")} onClick={() => setOp("-")}>−</Btn>

        {/* Row 3 */}
        {[4, 5, 6].map((n) => (
          <Btn key={n} type="num" {...btnProps(`n${n}`)} onClick={() => inputNum(String(n))}>{n}</Btn>
        ))}
        <Btn type="op" {...btnProps("mult")} onClick={() => setOp("*")}>×</Btn>

        {/* Row 4 */}
        {[1, 2, 3].map((n) => (
          <Btn key={n} type="num" {...btnProps(`n${n}`)} onClick={() => inputNum(String(n))}>{n}</Btn>
        ))}
        <Btn type="op" {...btnProps("divide")} onClick={() => setOp("/")}>÷</Btn>

        {/* Row 5 */}
        <Btn type="op" {...btnProps("sqrt")} onClick={squareRoot}>√</Btn>
        <Btn type="num" {...btnProps("n0")} onClick={() => inputNum("0")}>0</Btn>
        <Btn type="num" {...btnProps("dot")} onClick={inputDot}>.</Btn>
        <Btn type="eq" {...btnProps("eq")} onClick={equals}>=</Btn>
      </div>
    </div>
  );
}