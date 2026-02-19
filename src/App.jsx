import { useState, useEffect } from "react";
import "./App.css";
// import WordLine from "./components/WordLine";

const WORD_LENGTH = 5;
const MAX_ALLOWED_GUESSES = 6;

function App() {
  // Initialize guessedWords with an array of empty strings, each representing a guess slot (6 in total)
  const [guessedWords, setGuessedWords] = useState(
    new Array(MAX_ALLOWED_GUESSES).fill("     "),
  );
  const [correctWord, setCorrectWord] = useState("");
  const [wordCount, setWordCount] = useState(0);
  // keep tract of how many letters have been typed
  const [letterCount, setLetterCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("     ");

  // Getting the correct word
  useEffect(() => {
    setCorrectWord("Apple");
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleAlphabetical(e.key);
      } else {
        return;
      }
    }

    function handleEnter() {
      if (letterCount !== WORD_LENGTH) {
        alert("Not enough letters. words must be five letters long.");
        return;
      }

      setGuessedWords((current) => {
        const updatedGuessedWords = [...current];
        updatedGuessedWords[wordCount] = currentWord;
        return updatedGuessedWords;
      });

      setWordCount((current) => current + 1);
      setLetterCount(0);
      setCurrentWord("     ");
    }

    function handleBackspace() {
      if (letterCount === 0) {
        return;
      }
      setCurrentWord((currentWord) => {
        const currentWordArray = currentWord.split("");
        currentWordArray[letterCount - 1] = " ";

        const newWord = currentWordArray.join("");
        return newWord;
      });

      setLetterCount((currentCount) => currentCount - 1);
    }

    function handleAlphabetical(key) {
      if (letterCount === WORD_LENGTH) {
        return;
      }

      setCurrentWord((currentWord) => {
        // convert currentWord to array - stored as value of currentWordArray
        const currentWordArray = currentWord.split("");
        currentWordArray[letterCount] = key;
        // convert back to string - stored as value of newWord
        const newWord = currentWordArray.join("");
        return newWord;
      });

      setLetterCount((currentCount) => currentCount + 1);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [letterCount, currentWord, wordCount]);

  useEffect(() => {
    console.log("currentWord:", currentWord);
    console.log("wordCount:", wordCount);
  }, [currentWord, wordCount]);

  return (
    <>
      <div className="App">
        {guessedWords.map((word, index) => {
          // If the line that I'm currently typing on is equal to ... ?
          {
            {
              if (index === wordCount) {
                return <WordLine word={currentWord} key={index} />;
              }
            }
          }
          return <WordLine word={word} key={index} />;
        })}
      </div>
    </>
  );
}

function WordLine({ word }) {
  return (
    <div className="flex flex-row space-x-2 m-2">
      {word.split("").map((letter, index) => {
        return <LetterBox letter={letter} key={index} />;
      })}
    </div>
  );
}

function LetterBox({ letter }) {
  return (
    <div className="w-18 h-18 border-2 border-gray-300 bg-white text-black text-2xl flex items-center justify-center">
      {letter}
    </div>
  );
}

export default App;
