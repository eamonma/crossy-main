import { CrosswordData } from "../types/crosswordTypes"

/**
 * Return the starting highlight square and the ending highlight square
 * @param grid: Grid of answers of the crossword
 * @param direction: Currently across or down
 * @param curr: Current grid number
 */
export const findBounds = (
  puzzle: CrosswordData,
  direction: "across" | "down",
  curr: number
): [number, number] => {
  const startingSubset = puzzle.grid.slice(0, curr + 1)
  let endingSubset = puzzle.grid.slice(curr)

  let start: number, end: number
  // Go until find a .
  if (direction === "across") {
    for (let i = startingSubset.length - 1; i >= 0; i--) {
      if (startingSubset[i] === ".") {
        start = i + 1
        break
      }

      if (i % puzzle.size.cols === 0) {
        start = i
        break
      }
    }

    for (let i = 0; i < endingSubset.length; i++) {
      if (endingSubset[i] === ".") {
        end = i + startingSubset.length - 2
        break
      }

      if ((i + startingSubset.length) % puzzle.size.cols === 0) {
        end = i + startingSubset.length - 1
        break
      }
    }
  } else if (direction === "down") {
    for (let i = startingSubset.length - 1; i >= 0; i -= puzzle.size.cols) {
      if (startingSubset[i] === ".") {
        start = i + puzzle.size.cols
        break
      }

      if (i < puzzle.size.cols) {
        start = i
        break
      }
    }

    for (let i = 0; i < endingSubset.length; i += puzzle.size.cols) {
      if (endingSubset[i] === ".") {
        end = i + startingSubset.length - puzzle.size.cols - 1
        break
      }

      if (
        i + startingSubset.length - 1 >=
        puzzle.size.cols * (puzzle.size.rows - 1)
      ) {
        end = i + startingSubset.length - 1
      }
    }
  }

  return [start, end]
}
