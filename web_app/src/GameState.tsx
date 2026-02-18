export class GameState {
  boardA: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]];
  boardB: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]];

  playerNames: string[] = ['None1', "None2"]

  constructor(name: string, name2: string) {
    this.playerNames[0] = name;
    this.playerNames[1] = name2;
  }

  canSetCell(board: number, column: number) {
    if (board == 0) {
      for (let i = 0; i < 3; i++)
        if (this.boardA[i][column] == 0) return true;

    } else {
      for (let i = 0; i < 3; i++)
        if (this.boardB[i][column] == 0) return true;
    }
    return false;

  }

  getBoard(name: string) {
    if (this.playerNames[0] == name) return this.boardA;
    else return this.boardB;
  }

  sumPointsForColumn(board: number, column: number) {
    const target = board === 0 ? this.boardA : this.boardB;
    const occurrences = new Map<number, number>();

    for (let i = 0; i <= 6; i++) {
      occurrences.set(i, 0);
    }

    for (let i = 0; i < 3; i++) {
      const value = target[i][column];
      occurrences.set(value, occurrences.get(value)! + 1);
    }

    let sum = 0;
    for (let i = 0; i < 3; i++) {
      const value = target[i][column];
      sum += value * occurrences.get(value)!;
    }

    return sum;
  }

  gameEnded() {

    for (let i = 0; i < 3; i++) {
      if (this.canSetCell(0, i) || this.canSetCell(1, i)) return false;
    }
    return true

  }

  setCell(board: number, column: number, value: number) {
    if (!this.canSetCell(board, column)) return;

    const target = board === 0 ? this.boardA : this.boardB;
    const opposite = board === 0 ? this.boardB : this.boardA;

    for (let i = 0; i < 3; i++) {
      if (target[i][column] === 0) {
        target[i][column] = value;
        break;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (opposite[i][column] === value) {
        opposite[i][column] = 0;
      }
    }
  }

}
