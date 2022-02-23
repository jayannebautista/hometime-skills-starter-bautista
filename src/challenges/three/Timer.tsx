import { Button, HStack, Text } from "@chakra-ui/react";
import { useState, useEffect, useContext, createContext } from "react";

type TimerProps = {
  children: JSX.Element;
};

export const TimeContext = createContext({
  time: 0,
  setTime: (time: number) => {}
});
export default function Timer({ children }: TimerProps) {
  const [time, setTime] = useState(0);
  return (
    <TimeContext.Provider value={{ time, setTime }}>
      {children}
    </TimeContext.Provider>
  );
}

export function TimerDisplay() {
  const context = useContext(TimeContext);

  const [mins, setMins] = useState("00");
  const [secs, setSecs] = useState("00");
  const [milli, setMilli] = useState("0");
  useEffect(() => {
    let secVal = Math.floor((context?.time / 100) % 60);
    let minVal = Math.floor((context?.time / 6000) % 60);
    let minStr = minVal.toString();
    let secStr = secVal.toString();

    if (minVal < 10) {
      minStr = `${0}${minVal}`;
    }
    if (secVal < 10) {
      secStr = `${0}${secVal}`;
    }
    setMilli(Math.floor((context?.time / 10) % 10).toString()[0]);
    setSecs(secStr);
    setMins(minStr);
  }, [context.time]);

  return (
    <Text
      fontSize="7xl"
      color="gray.600"
      sx={{
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {mins}:{secs}:{milli}
    </Text>
  );
}

export function TimerControls() {
  const context = useContext(TimeContext);
  const [isRunning, setIsRunning] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        context?.setTime((prevTime) => prevTime + 1);
      }, 10);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleButton = (running: boolean) => {
    setIsRunning(running);
    setIsCleared(false);
  };

  const handleReset = () => {
    setIsCleared(true);
    setIsRunning(false);
    context?.setTime(0);
  };

  return (
    <HStack>
      {isRunning ? (
        <Button colorScheme="red" onClick={() => handleButton(false)}>
          Paused
        </Button>
      ) : (
        <Button colorScheme="green" onClick={() => handleButton(true)}>
          Start
        </Button>
      )}
      {!isCleared ? <Button onClick={handleReset}>Reset</Button> : null}
    </HStack>
  );
}
