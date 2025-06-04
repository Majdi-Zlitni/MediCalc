import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import "./App.css";
import svnIcon from "./assets/svg.png";

interface FormulaState {
  input: string; // Remains for potential future use or consistency, but unused by fixed formulas
  result: string | number;
}

const initialFormulaStates: FormulaState[] = [
  { input: "", result: "" },
  { input: "", result: "" },
  { input: "", result: "" },
  { input: "", result: "" }, // Fourth formula
];

// Helper function for rounding
const applyArrondissement = (
  value: number
): number => {
  if (value % 1000 < 250) {
    return value - (value % 1000);
  } else if (
    value % 1000 >= 250 &&
    value % 1000 < 750
  ) {
    return value - (value % 1000) + 500;
  } else if (value % 1000 > 750) {
    // Round to the nearest multiple of 500
    return Math.round(value / 500) * 500;
  }
  // This case should ideally not be reached if the conditions are exhaustive
  // However, to be safe, return the original value or handle as an error
  return value;
};

function App() {
  const [baseValue, setBaseValue] =
    useState<string>("");
  const [formulas, setFormulas] = useState<
    FormulaState[]
  >(initialFormulaStates);

  const calculateFormulaResult = (
    _formulaInput: string, // Parameter kept for signature consistency, but ignored for fixed formulas 0,1,2
    currentBaseVal: number,
    formulaIndex: number
  ): string | number => {
    if (isNaN(currentBaseVal))
      return "Invalid Base Value";

    switch (formulaIndex) {
      case 0: // Formula 1: BaseValue + 19% TVA of BaseValue + 50% Added Value of BaseValue
        return (
          currentBaseVal +
          currentBaseVal * 0.19 +
          (currentBaseVal +
            currentBaseVal * 0.19) *
            0.5
        );
      case 1: // Formula 2: BaseValue + 19% TVA of BaseValue + 40% Added Value of BaseValue
        return (
          currentBaseVal +
          currentBaseVal * 0.19 +
          (currentBaseVal +
            currentBaseVal * 0.19) *
            0.4
        );
      case 2: // Formula 3: BaseValue + 7% TVA of BaseValue + 66.66% Added Value of BaseValue
        return (
          currentBaseVal +
          currentBaseVal * 0.07 +
          (currentBaseVal +
            currentBaseVal * 0.19) *
            (66.66 / 100)
        );
      // Formula 4 (index 3) is disabled and will be handled by the caller.
      // Add other cases here if more dynamic formulas are needed in the future.
      default:
        return ""; // For unhandled or disabled formulas
    }
  };

  useEffect(() => {
    const numericBase = parseFloat(baseValue);
    if (baseValue === "" || isNaN(numericBase)) {
      setFormulas((prevFormulas) =>
        prevFormulas.map((f) => ({
          ...f,
          result: "",
        }))
      );
    } else {
      setFormulas((prevFormulas) =>
        prevFormulas.map((f, index) => {
          if (index === 3)
            return { ...f, result: "" }; // Formula 4 is always disabled

          // For formulas 0, 1, 2, f.input is ignored by calculateFormulaResult.
          const rawResult =
            calculateFormulaResult(
              f.input,
              numericBase,
              index
            );

          if (typeof rawResult === "number") {
            const roundedResult =
              applyArrondissement(rawResult);
            return {
              ...f,
              result: roundedResult,
            };
          } else {
            return { ...f, result: rawResult }; // Handles "Invalid Base Value" or other string messages
          }
        })
      );
    }
  }, [baseValue]);

  const handleFormulaInputChange = (
    index: number,
    value: string
  ) => {
    // This function is generally for formulas that take direct input.
    // For fixed formulas (0,1,2) and disabled formula (3), their inputs are disabled,
    // so this handler won't be triggered for them via UI.
    // If it were, calculateFormulaResult would ignore 'value' for fixed formulas.

    const newFormulas = [...formulas];
    newFormulas[index].input = value; // Store input, though it might not be used by all formulas

    const numericBase = parseFloat(baseValue);

    if (index === 3) {
      newFormulas[index].result = ""; // Formula 4 is always disabled
    } else if (
      baseValue === "" ||
      isNaN(numericBase)
    ) {
      newFormulas[index].result =
        "Enter valid Base Value";
    } else {
      const rawResult = calculateFormulaResult(
        value,
        numericBase,
        index
      );
      if (typeof rawResult === "number") {
        newFormulas[index].result =
          applyArrondissement(rawResult);
      } else {
        newFormulas[index].result = rawResult;
      }
    }
    setFormulas(newFormulas);
  };

  const formulaLabels = [
    "F1: Base + 19% TVA + 50% Added",
    "F2: Base + 19% TVA + 40% Added",
    "F3: Base + 7% TVA + 66.66% Added",
    "f4: (Disabled)",
  ];

  const formulaInputLabels = [
    "Calculation:",
    "Calculation:",
    "Calculation:",
    "Input (Disabled)",
  ];

  const formulaInputPlaceholders = [
    "Automatic (Fixed)",
    "Automatic (Fixed)",
    "Automatic (Fixed)",
    "N/A",
  ];

  const isBaseValueInvalid =
    baseValue === "" ||
    isNaN(parseFloat(baseValue));

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          MediCalc - Pharmaceutical Calculator
        </h1>
      </header>

      <section className="base-value-input-section">
        <label htmlFor="base-value">
          Base Value:
        </label>

        <input
          type="number"
          id="base-value"
          value={baseValue}
          onChange={(
            e: ChangeEvent<HTMLInputElement>
          ) => setBaseValue(e.target.value)}
          placeholder="Enter a number"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "50%",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.1)",
            outline: "none",
            transition: "0.2s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor =
              "#3b82f6")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "#ccc")
          }
        />
      </section>
      <br />
      <div className="formulas-grid">
        {formulas.map((formula, index) => (
          <div
            className="formula-card"
            key={index}
          >
            <h3>{formulaLabels[index]}</h3>
            <div className="input-group">
              <label
                htmlFor={`formula-input-${index}`}
              >
                {formulaInputLabels[index]}:
              </label>
              <input
                type="text" // Changed to text as it will show placeholder text
                id={`formula-input-${index}`}
                value={formula.input} // This will be empty for fixed formulas
                readOnly // Make it readOnly instead of fully disabled to show placeholder better
                disabled={
                  index <= 2 || index === 3
                } // Disable interaction for fixed/disabled
                placeholder={
                  formulaInputPlaceholders[index]
                }
                // onChange is effectively not triggered for disabled inputs
                onChange={(e) =>
                  handleFormulaInputChange(
                    index,
                    e.target.value
                  )
                }
                style={
                  index <= 2 || index === 3
                    ? {
                        backgroundColor:
                          "#e9ecef",
                        cursor: "not-allowed",
                      }
                    : {}
                }
              />
            </div>
            <div
              className={`result ${
                index === 3 ||
                (isBaseValueInvalid &&
                  formula.result === "")
                  ? "disabled"
                  : ""
              }`}
            >
              <strong>Result:</strong>{" "}
              <img
                src={svnIcon} // Change this line
                alt="SVN"
                style={{
                  width: "16px",
                  marginLeft: "4px",
                }}
              />
              {"  "}
              {formula.result !== "" &&
              typeof formula.result === "number"
                ? (formula.result / 1000).toFixed(
                    3
                  )
                : formula.result}
              {(index === 3 ||
                (isBaseValueInvalid &&
                  formula.result === "" &&
                  index < 3)) &&
                "N/A"}{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
