export type Answers = {
  across: Array<string>
  down: Array<string>
}

export type Clues = {
  across: Array<string>
  down: Array<string>
}

export type Size = {
  cols: number
  rows: number
}

export interface CrosswordData {
  title: string
  publisher: string
  answers: Answers
  author: string
  editor: string
  clues: Clues
  grid: Array<string>
  gridnums: Array<number>
  date: string
  size: Size
}
