import { useSession, getSession, signIn } from "next-auth/react"
import { getToken } from "next-auth/jwt"
import { GetServerSidePropsContext } from "next"
import React, { useEffect, useRef, useState } from "react"
import { gql, useSubscription } from "@apollo/client"
import client from "../../apollo-client"
import { useRouter } from "next/router"
import { CrosswordData } from "../../types/crosswordTypes"
import { useColorScheme } from "@mantine/hooks"
import styled from "styled-components"
import { findBounds } from "../../utils/findBounds"

//  w-screen h-screen grid-cols-1 dark:bg-stone-800 dark:text-slate-50 xl:grid-cols-[4fr,3fr]"

const MainContainer = styled.main`
  display: grid;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;

  @media (orientation: landscape) {
    grid-template-columns: 4fr 3fr;
  }

  @media (orientation: portrait) {
    grid-template-rows: 4fr 3fr;
  }

  /* @media () */
`

const CrosswordGrid = styled.div`
  display: grid;
  /* border: 4px solid black; */
  /* background: #000; */
  /* width: 800px; */
  /* width: 100%; */
  /* height: 100%; */

  /* max-height:  */
  /* max-height: 100vh; */
  /* max-width: 100%; */
  width: min(100%, 90vh);

  @supports (-webkit-touch-callout: none) {
    transform: scale(0.9) translate(-2%);
  }

  @media (orientation: portrait) {
    width: min(100%, 60vh);
  }

  /* padding-bottom: 1rem; */
  grid-template-columns: repeat(
    ${(props: { cols: number }) => props.cols},
    1fr
  );
`

const CrosswordCell = styled.button`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  aspect-ratio: 1;

  position: relative;

  @media (min-width: 600px) {
    border: 1px solid #aaaaaaaa;
  }

  border: 0.5px solid #aaaaaaaa;

  @media (hover: hover) {
    &:hover {
      background-color: ${(props: {
        isCurrentInputSlice: boolean
        isCurrentSquare: boolean
      }) => {
        if (props.isCurrentInputSlice || props.isCurrentSquare) return ""
      }};
    }
  }

  background-color: ${(props: {
    isVoid: string
    highlight: string
    isCurrentInputSlice: boolean
    isCurrentSquare: boolean
  }) => {
    if (props.isCurrentSquare) return "#3ddcff8a"
    if (props.isCurrentInputSlice) return "#fff18441"
    if (props.highlight) return props.highlight
    return props.isVoid ? "black" : "transparent"
  }};

  /* &:hover {
    filter: brightness(1.4);
  } */
`

const CrosswordLetter = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  user-select: none;
  /* font-size: 100%;*/
  /* top: 100%; */
  transform: translate(0, 10%);
  /* padding-top: 50%; */

  align-items: center;
  justify-content: center;

  /* padding: 1rem; */
`

const CrosswordNumber = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;

  line-height: 10px;
  font-size: 10px;
  @media (min-width: 600px) {
    top: 3px;
    left: 3px;
    line-height: 14px;
    font-size: 14px;
  }
`

const getGridNumberToHighlight = (
  puzzle: CrosswordData,
  currentDirection: "across" | "down",
  currentSquare: number,
  direction: "less" | "more" = "more"
) => {
  const firstSquareToNotBeBlack = puzzle.grid.findIndex((cell) => cell !== ".")
  const addGridNum = currentDirection === "across" ? 1 : puzzle.size.cols
  const incrementor = direction === "more" ? addGridNum : -addGridNum

  let gridNumberToHighlight = currentSquare + incrementor

  const puzzleSize = puzzle.size.cols * puzzle.size.rows

  while (puzzle.grid[gridNumberToHighlight] === ".") {
    gridNumberToHighlight += incrementor
  }

  if (gridNumberToHighlight >= puzzleSize || gridNumberToHighlight < 0) {
    gridNumberToHighlight = firstSquareToNotBeBlack
  }

  return gridNumberToHighlight
}

const gameUpdateSubscription = gql`
  subscription subscribeToGameUpdate($topic: String!) {
    subscribeToGameUpdate(topic: $topic) {
      answers
      updatedAt
      active
    }
  }
`

const GameView = ({
  data,
}: {
  data: { gameById: { puzzle: string; answers: Array<string> } }
}) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [answers, setAnswers] = useState<Array<string>>([])
  const [puzzle, setPuzzle] = useState<CrosswordData>()
  const [highlights, setHighlights] = useState<{ [gridNum: number]: string }>(
    {}
  )

  const [inputAnswer, setInputAnswer] = useState("")
  const inputAnswerInputElementRef = useRef<HTMLInputElement>(null)

  const [currentSquare, setCurrentSquare] = useState(0)
  const [currentDirection, setCurrentDirection] = useState<"across" | "down">(
    "across"
  )

  const [inputHighlights, setInputHighlights] = useState<{
    [gridNum: number]: boolean
  }>({})

  const prefersColorScheme = useColorScheme()
  const isDarkMode = prefersColorScheme === "dark"

  useEffect(() => {
    if (!inputAnswer) return
    setAnswers((prevAnswers) =>
      prevAnswers.map((answer, i) => {
        if (i !== currentSquare) return answer

        return inputAnswer
      })
    )

    setInputAnswer("")

    const gridNumberToHighlight = getGridNumberToHighlight(
      puzzle,
      currentDirection,
      currentSquare
    )

    setCurrentSquare(gridNumberToHighlight)
  }, [inputAnswer])

  useEffect(() => {
    const puzzle = JSON.parse(data.gameById.puzzle)
    setPuzzle(puzzle)
    setCurrentSquare(puzzle.grid.findIndex((cell: string) => cell !== "."))
    setAnswers(
      new Array(puzzle.grid.length)
        .fill("")
        .map((answer, i) => data.gameById.answers[i])
    )
  }, [data])

  useEffect(() => {
    document.querySelector("body").style.overflow = "hidden"
  }, [])

  useEffect(() => {
    if (!puzzle) return
    const bounds = findBounds(puzzle, currentDirection, currentSquare)

    const addGridNum = currentDirection === "across" ? 1 : puzzle.size.cols

    const newHighlights = {}

    for (let i = bounds[0]; i <= bounds[1]; i += addGridNum) {
      newHighlights[i] = true
    }

    setInputHighlights(newHighlights)
  }, [puzzle, currentDirection, currentSquare])

  const { gameId } = router.query

  const { data: subData, loading } = useSubscription(gameUpdateSubscription, {
    variables: { topic: gameId },
  })

  console.log(subData)
  useEffect(() => {
    if (!subData) return
    setAnswers(subData.subscribeToGameUpdate.answers)
  }, [subData])

  useEffect(() => {
    if (inputAnswerInputElementRef.current)
      inputAnswerInputElementRef.current.click()
    inputAnswerInputElementRef.current.focus()
  }, [inputAnswerInputElementRef.current])

  return (
    <div className="dark">
      <MainContainer className="dark:bg-stone-800 dark:text-slate-50">
        {/* Crossword grid container */}
        {/* Crossword grid TODO: extract into container */}
        <input
          ref={inputAnswerInputElementRef}
          // className="sr-only"
          className="absolute text-2xl text-black sr-only"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={inputAnswer}
          onChange={(e) => {
            setInputAnswer(e.target.value.toUpperCase())
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case "Backspace":
                setAnswers((prevAnswers) => {
                  if (prevAnswers[currentSquare] === "") {
                    setCurrentSquare(
                      getGridNumberToHighlight(
                        puzzle,
                        currentDirection,
                        currentSquare,
                        "less"
                      )
                    )
                  }
                  return prevAnswers.map((answer, i) => {
                    if (i !== currentSquare) return answer

                    return ""
                  })
                })
                break
              case "ArrowUp":
                setCurrentDirection("down")
                // setCurrentSquare(currentSquare - puzzle.size.cols)
                setCurrentSquare(
                  getGridNumberToHighlight(
                    puzzle,
                    "down",
                    currentSquare,
                    "less"
                  )
                )
                break
              case "ArrowRight":
                setCurrentDirection("across")
                // setCurrentSquare(gridNumberToHighlight)
                setCurrentSquare(
                  getGridNumberToHighlight(
                    puzzle,
                    "across",
                    currentSquare,
                    "more"
                  )
                )
                break
              case "ArrowDown":
                setCurrentDirection("down")
                setCurrentSquare(
                  getGridNumberToHighlight(
                    puzzle,
                    "down",
                    currentSquare,
                    "more"
                  )
                )
                // setCurrentSquare(currentSquare + puzzle.size.cols)
                break
              case "ArrowLeft":
                setCurrentDirection("across")
                // setCurrentSquare(currentSquare - 1)
                setCurrentSquare(
                  getGridNumberToHighlight(
                    puzzle,
                    "across",
                    currentSquare,
                    "less"
                  )
                )
                break
            }

            if (e.key === "Backspace") {
              setAnswers((prevAnswers) =>
                prevAnswers.map((answer, i) => {
                  if (i !== currentSquare) return answer

                  return ""
                })
              )
            }
          }}
          type="text"
        />
        <div className="flex items-center justify-center object-center p-1 sm:p-4 object-fit bg-stone-600">
          {puzzle && (
            <CrosswordGrid
              className="border shadow-lg sm:border-2"
              cols={puzzle.size.cols}
              rows={puzzle.size.rows}
              onClick={() => {
                if (status === "unauthenticated") signIn("discord")
              }}
            >
              {puzzle.grid.map((gridItem, i) => {
                return (
                  <CrosswordCell
                    isVoid={gridItem === "."}
                    className={`transition duration-75 ${
                      gridItem !== "." ? " cursor-pointer" : "cursor-default"
                    }`}
                    isCurrentInputSlice={inputHighlights[i]}
                    isCurrentSquare={i === currentSquare}
                    onClick={() => {
                      if (gridItem === ".") return

                      if (currentSquare === i) {
                        setCurrentDirection((prevCurrentDirection) => {
                          // return "across"
                          return prevCurrentDirection === "across"
                            ? "down"
                            : "across"
                        })
                      }

                      setCurrentSquare((prevCurrentSquare) => {
                        // if(prevCurrentSquare !== i) setClickFlag(false)
                        return i
                      })
                      inputAnswerInputElementRef.current.focus()
                    }}
                    // className="bg-transparent even:bg-white"
                  >
                    {/* lg:text-6xl md:text-4xl sm:text-3xl */}
                    <CrosswordLetter className="text-xl lg:text-4xl md:text-4xl">
                      {gridItem !== "." && answers[i]}
                      {/* {i} */}
                    </CrosswordLetter>

                    {!!puzzle.gridnums[i] && (
                      <CrosswordNumber>{puzzle.gridnums[i]}</CrosswordNumber>
                    )}
                  </CrosswordCell>
                )
              })}
            </CrosswordGrid>
          )}
        </div>
        {/* </div> */}
        {/* Clues container */}
        <div>
          <button
            className="p-4 select-none"
            onClick={() => setAnswers((prev) => [...prev, "a"])}
          >
            click em
          </button>
        </div>
      </MainContainer>{" "}
      {/* </main> */}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const gameQuery = gql`
    query gameById($gameId: String!) {
      gameById(gameId: $gameId) {
        channelId
        createdAt
        updatedAt
        active
        answers
        puzzle
      }
    }
  `

  const { gameId } = context.query

  const { data } = await client.query({
    query: gameQuery,
    variables: { gameId },
  })

  return { props: { data } }
}

export default GameView
