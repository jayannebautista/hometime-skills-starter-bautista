import { Box, Text } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";

function useMouseLocation(ref: React.RefObject<HTMLElement>) {
  // implement me!
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const box = ref.current;

    const checker = (e: MouseEvent) => {
      const rectTop = Math.round(box.getBoundingClientRect().top);
      const rectLeft = Math.round(box.getBoundingClientRect().left);
     
      let x = e.clientX - rectLeft;
      let y = e.clientY - rectTop;
      setCoordinates({ x, y });
    };
    box.addEventListener("mousemove", checker);
  }, [ref]);

  return coordinates;
}

export default function One() {
  // ❗ This our target API
  const ref = useRef(null);
  const { x, y } = useMouseLocation(ref);

  return (
    <>
      <Box
        h="350px"
        w="full"
        bg="red.200"
        rounded="xl"
        position="relative"
        mt={6}
        _hover={{
          shadow: "lg"
        }}
        ref={ref}
      >
        <Text
          position="absolute"
          p={2}
          background="gray.600"
          rounded="md"
          color="gray.100"
          fontSize="sm"
          fontWeight="bold"
          top={y}
          left={x}
        >
          x: {x}, y:{y}
        </Text>
      </Box>
      
    </>
  );
}
