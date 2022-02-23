import {
  Box,
  Input,
  Flex,
  Text,
  VStack,
  Image,
  Heading,
  HStack,
  Tag,
  Skeleton,
  SkeletonText
} from "@chakra-ui/react";
import { useDebounce } from "use-debounce";
import React, { useEffect, useState } from "react";

// putting this here as a guide for what the API returns
// and what you need from it.
interface Show {
  score: number;
  show: {
    id: number;
    name: string;
    type: string;
    genres: string[];
    image?: {
      medium: string;
    };
    summary: string;
  };
}

function ShowCard(props: Show) {
  // 💡 use this link below for placeholder images.
  // "https://via.placeholder.com/112x157.png?text=No+image"

  // 💡 A few hints:
  // genres use the Tag component
  // loading placeholders use the Skeleton component
  // both from @chakra-ui/react
  // use the docs: https://chakra-ui.com/docs/getting-started

  return (
    <Flex
      w="full"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{
        cursor: "pointer",
        shadow: "lg"
      }}
      p={0}
    >
      <Box w={28}>
        <Image
          w={28}
          objectFit="cover"
          src={`${props.show?.image?.medium}`}
          fallbackSrc={"https://via.placeholder.com/112x157.png?text=No+image"}
        />
      </Box>
      <Box p={4} flex="1">
        <HStack>
          {props.show?.genres.map((genre, key) => {
            return (
              <Tag fontSize="xs" key={key} p={1}>
                {genre}
              </Tag>
            );
          })}
        </HStack>
        <Heading as="h2" fontSize="md" color="gray.600" mt={2}>
          {props.show?.name}
        </Heading>
        <Text
          fontSize="sm"
          color="gray.500"
          mt={2}
          noOfLines={2}
          dangerouslySetInnerHTML={{ __html: props.show?.summary }}
        />
      </Box>
    </Flex>
  );
}
function LoadingSkeleton() {
  return (
    <Flex
      w="full"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{
        cursor: "pointer",
        shadow: "lg"
      }}
      p={0}
    >
      <Skeleton>
        <Box w={28} h={150} />
      </Skeleton>

      <Box padding="6" flex="1">
        <Skeleton height="40px" />
        <SkeletonText mt="4" noOfLines={3} spacing="2" size="2" />
      </Box>
    </Flex>
  );
}
export default function Two() {
  const [search, setSearch] = useState("");
  const [searchValue] = useDebounce(search, 500);
  const [shows, setShows] = useState([]);
  const [searching, setSearching] = useState(true);

  // I've debounced the input for you just
  // use 'searchValue' to trigger a request to the search API
  // https://api.tvmaze.com/search/shows?q=:searchValue
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${searchValue}`
        );

        const result = await response.json();
        setShows(result);
        setSearching(false);
      } catch (error) {
        setSearching(false);
      }
    };

    setSearching(true);
    setShows([]);
    fetchMovies();
  }, [searchValue]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <Box>
      <Input
        type="text"
        placeholder="Search for a TV show"
        onChange={handleSearch}
      />
      {searchValue === "" ? (
        <Text padding={6} textAlign="center" color="gray.500">
          Nothing here. Try searching for a TV show above!
        </Text>
      ) : null}

      {searchValue !== "" && !searching && !shows.length ? (
        <Text padding={6} textAlign="center" color="gray.500">
          No results for "{searchValue}"
        </Text>
      ) : null}
      {searching ? (
        <VStack spacing={4} mt={6}>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </VStack>
      ) : null}
      <VStack spacing={4} mt={6}>
        {shows.map((item, index) => {
          return <ShowCard key={index} {...item} />;
        })}
      </VStack>
    </Box>
  );
}
