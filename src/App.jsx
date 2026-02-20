import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
// import WordLine from "./components/WordLine";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

function App() {
  // Initialize guessedWords with an array of empty strings, each representing a guess slot (6 in total)
  const [guessedWords, setGuessedWords] = useState(
    new Array(MAX_GUESSES).fill("     "),
  );
  const [correctWord, setCorrectWord] = useState("");
  const [correctLetterObject, setCorrectLetterObject] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("     ");
  const [gameOver, setGameOver] = useState(false);

  // Getting the correct word
  useEffect(() => {
    async function fetchWord() {
      const response = await axios.get(
        "https://api.datamuse.com/words?sp=?????&max=1000",
      );
      const words = response.data;
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex].word;
      console.log(word);

      const letterObject = {};
      // Frequency hashmap for letters in a string
      for (let letter of word) {
        letterObject[letter] = (letterObject[letter] || 0) + 1;
      }

      setCorrectWord(word);
      setCorrectLetterObject(letterObject);
    }
    fetchWord();
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
      if (currentWord === correctWord) {
        setGameOver(true);
        // alert("You've Won!");
        return;
      }

      if (currentWord !== correctWord && wordCount === MAX_GUESSES - 1) {
        setGameOver(true);
        // alert("You've Lost :(");
        return;
      }

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

    if (gameOver) {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [letterCount, currentWord, wordCount, correctWord, gameOver]);

  function resetGame() {
    console.log("resetting game...");
    setGuessedWords(new Array(MAX_GUESSES).fill("     "));
    setCorrectWord("");
    setCorrectLetterObject({});
    setWordCount(0);
    setLetterCount(0);
    setCurrentWord("     ");
    setGameOver(false);
  }

  return (
    <>
      <div className="App">
        <h1 className="text-4xl font-bold m-4">Wordle</h1>
        {guessedWords.map((word, index) => {
          // The line that I'm currently typing on is equal to the word count, so we want to render the current word with the correct styling. We also only want to reveal the current word if the game is over.
          {
            {
              if (index === wordCount) {
                return (
                  <WordLine
                    word={currentWord}
                    correctWord={correctWord}
                    correctLetterObject={correctLetterObject}
                    revealed={gameOver || false}
                    key={index}
                  />
                );
              }
            }
          }
          return (
            <WordLine
              word={word}
              correctWord={correctWord}
              correctLetterObject={correctLetterObject}
              revealed={true}
              key={index}
            />
          );
        })}
        <div className="flex flex-col items-center justify-center mt-4">
          <span className="text-lg font-medium">
            {gameOver
              ? currentWord === correctWord
                ? "You've Won!"
                : "You've Lost :("
              : "Type your guess and press Enter"}
          </span>
          <span>Guesses remaining: {MAX_GUESSES - wordCount}</span>
          <button
            className="mt-4 px-4 py-2 bg-transparent text-white rounded border-2 border-gray-300 hover:bg-gray-300 hover:text-black cursor-pointer transition-colors duration-300"
            onClick={(e) => {
              resetGame();
              e.target.blur();
            }}
          >
            Reset Game
          </button>
        </div>
      </div>
    </>
  );
}

function WordLine({ word, correctWord, correctLetterObject, revealed }) {
  return (
    <div className="flex flex-row space-x-2 m-2">
      {word.split("").map((letter, index) => {
        const hasCorrectLocation = letter === correctWord[index];
        const hasCorrectLetter = letter in correctLetterObject;

        return (
          <LetterBox
            letter={letter}
            green={hasCorrectLocation && hasCorrectLetter && revealed}
            yellow={!hasCorrectLocation && hasCorrectLetter && revealed}
            key={index}
          />
        );
      })}
    </div>
  );
}

function LetterBox({ letter, green, yellow }) {
  return (
    <div
      className={`w-18 h-18 border-2 border-gray-300 text-black text-2xl flex items-center justify-center ${green ? "bg-green-500" : yellow ? "bg-yellow-500" : "bg-white"}`}
    >
      {letter}
    </div>
  );
}

export default App;
