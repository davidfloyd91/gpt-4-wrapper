import { useCallback, useState } from "react";
import styled from "styled-components";

const COLORS = {
  BLACK: "#0F1321",
  DARK_BLUE: "#202942",
  DARK_GRAY: "#262F3C",
  LIGHT_BLUE: "#879AC4",
  LIGHT_GRAY: "#627197",
  PINK: "#9187C4",
  WHITE: "#EFF1ED",
};

const Text = styled.div`
  color: ${COLORS.LIGHT_BLUE};
  font-size: 14px;
  line-height: 132%;
  margin-bottom: 12px;
  max-width: 836px;
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid ${COLORS.DARK_GRAY};
  border-radius: 4px;
  color: ${COLORS.WHITE};
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 24px;
  padding: 4px 12px;

  &:hover {
    background-color: ${COLORS.DARK_BLUE};
    border: 1px solid ${COLORS.LIGHT_GRAY};
  }

  &:disabled {
    background-color: transparent;
    border: 1px solid ${COLORS.DARK_GRAY};
    color: ${COLORS.LIGHT_GRAY};
    cursor: auto;
  }
`;

const Header = styled.h1`
  color: ${COLORS.PINK};
`;

const Loading = styled(Text)``;

const OldAnswer = styled(Text)``;

const OldQABlock = styled.div`
  margin-bottom: 24px;
`;

const OldQuestion = styled(Text)`
  color: ${COLORS.WHITE};
`;

const Question = styled.div`
  & textarea {
    background-color: ${COLORS.DARK_GRAY};
    border: 2px solid transparent;
    border-radius: 4px;
    color: ${COLORS.WHITE};
    margin-bottom: 8px;
    outline: none;
    padding: 8px;
    resize: none;

    &:focus {
      border: 2px solid ${COLORS.LIGHT_GRAY};
    }
  }
`;

const StyledError = styled.div`
  color: ${COLORS.PINK};
`;

const Home = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oldAnswers, setOldAnswers] = useState([]);
  const [oldQuestions, setOldQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [temperature, setTemperature] = useState(0.6);

  const handleChange = useCallback(
    (e) => {
      setQuestion(e.target.value);
    },
    [setQuestion]
  );

  const handleSubmit = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: question, temperature }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setQuestion("");
      setOldAnswers([...oldAnswers, data.result]);
      setOldQuestions([...oldQuestions, question]);
    } catch (_error) {
      console.error(_error);
      setError(_error);
    } finally {
      setLoading(false);
    }
  }, [
    question,
    oldAnswers,
    oldQuestions,
    setError,
    setLoading,
    setOldAnswers,
    setOldQuestions,
  ]);

  return (
    <>
      <style jsx global>{`
        body {
          background-color: ${COLORS.BLACK};
          color: ${COLORS.WHITE};
          font-family: monospace;
          padding: 0 12px;
        }
      `}</style>
      <div>
        <Header>GPT-4 API Wrapper</Header>
        {oldQuestions.map((oldQuestion, index) => {
          const oldAnswer = oldAnswers[index];
          return (
            <OldQABlock key={`${index}-${oldQuestion.slice(0, 25)}`}>
              <OldQuestion>{oldQuestion}</OldQuestion>
              <OldAnswer>{oldAnswer}</OldAnswer>
            </OldQABlock>
          );
        })}
        {error && <StyledError>{error}</StyledError>}
        <Question>
          <textarea
            type="textarea"
            cols={100}
            name="wut"
            placeholder="hi"
            rows={12}
            value={question}
            spellcheck="false"
            onChange={handleChange}
          />
        </Question>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "836px",
          }}
        >
          <Button onClick={handleSubmit} disabled={!question || loading}>
            Submit
          </Button>
          {loading && <Loading>Just a second ...</Loading>}
        </div>
      </div>
    </>
  );
};

export default Home;
