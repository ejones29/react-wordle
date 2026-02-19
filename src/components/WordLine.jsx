import React from "react";
import LetterBox from "./LetterBox";

function WordLine({ wordLength }) {
  return (
    <div>
      {Array.from({ length: wordLength }).map((_, index) => (
        <LetterBox key={index} />
      ))}
    </div>
  );
}

export default WordLine;
