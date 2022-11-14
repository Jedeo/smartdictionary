import React, { useState, useEffect, useContext } from "react";
import { getWordDefinition, getQuizWords } from "../../apiCalls/getWords";
import { QuizContext } from "../../context/quizContext/QuizContext";
import Quiz from "../quizComponent/Quiz";
import PropTypes from "prop-types";

export default function Learn({ getErrors }) {
  const [words, setWords] = useState([]);
  const [quiz, setQuiz] = useContext(QuizContext);
  const [gotError, setGotError] = useState(false);
  
  useEffect(() => {
    getLearningWords();
  }, []);

  useEffect(() => {
    const getDif = async () => {
      const allDefs = {};
      const allWords = [];

      words.map(async (word) => {
        const results = await getWordDefinition(word.word);
        if (Object.keys(results).length > 0) {
          setGotError(false);
          results.map((result) => {
            const keys = Object.keys(allDefs);
            if (!keys.includes(result.word)) {
              allWords.push(result.word);
              allDefs[result.word] = [];
              allDefs[result.word].push(result.text);
            } else {
              allDefs[result.word].push(result.text);
            }
          });
        } else {
          setGotError(true);
          getErrors(results);
        }
      });

      setQuiz({ quizWords: allWords, quizDefs: allDefs });
    };
    getDif();
  }, [words]);

  const getLearningWords = async () => {
    const quizWords = await getQuizWords();
    if (Object.keys(quizWords).length > 0) {
      setWords([...quizWords]);
      setGotError(false);
    } else {
      setGotError(true);
      getErrors(quizWords);
    }
  };

  const getQuiz = () => {
    getLearningWords();
  };

  return (
    <React.Fragment>
      <Quiz gotError={gotError} getQuiz={getQuiz} />
    </React.Fragment>
  );
}

Learn.propTypes = {
  getError: PropTypes.func,
};
