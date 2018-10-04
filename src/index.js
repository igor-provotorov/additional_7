module.exports = function solveSudoku(matrix) {

  function Sudoku(matrix) {
    let solved = [];
    let steps = 0;
    let backtracking_call = 0;

    initSolved(matrix);
    solve();


    function initSolved(matrix) {
      steps = 0;
      let suggest = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < 9; i++) {
        solved[i] = [];
        for (let j = 0; j < 9; j++) {
          if (matrix[i][j]) {
            solved[i][j] = [matrix[i][j], 'in', []];
          }
          else {
            solved[i][j] = [0, 'undefined', suggest];
          }
        }
      }
    };


    function solve() {
      let changed = 0;
      do {

        changed = updateSuggests();
        steps++;
        if (81 < steps) {

          break;
        }
      } while (changed);

      if (!isSolved() && !isFailed()) {

        backtracking();
      }
    };


    function updateSuggests() {
      let changed = 0;
      let buf = arrayDiff(solved[1][3][2], rowContent(1));
      buf = arrayDiff(buf, colContent(3));
      buf = arrayDiff(buf, sectContent(1, 3));
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('undefined' != solved[i][j][1]) {

            continue;
          }

          changed += solveSingle(i, j);

          changed += solveHiddenSingle(i, j);
        }
      }
      return changed;
    };


    function solveSingle(i, j) {
      solved[i][j][2] = arrayDiff(solved[i][j][2], rowContent(i));
      solved[i][j][2] = arrayDiff(solved[i][j][2], colContent(j));
      solved[i][j][2] = arrayDiff(solved[i][j][2], sectContent(i, j));
      if (1 == solved[i][j][2].length) {

        markSolved(i, j, solved[i][j][2][0]);
        return 1;
      }
      return 0;
    };


    function solveHiddenSingle(i, j) {
      let less_suggest = lessRowSuggest(i, j);
      let changed = 0;
      if (1 == less_suggest.length) {
        markSolved(i, j, less_suggest[0]);
        changed++;
      }
      less_suggest = lessColSuggest(i, j);
      if (1 == less_suggest.length) {
        markSolved(i, j, less_suggest[0]);
        changed++;
      }
      less_suggest = lessSectSuggest(i, j);
      if (1 == less_suggest.length) {
        markSolved(i, j, less_suggest[0]);
        changed++;
      }
      return changed;
    };


    function markSolved(i, j, solve) {
      solved[i][j][0] = solve;
      solved[i][j][1] = 'solved';
    };


    function rowContent(i) {
      let content = [];
      for (let j = 0; j < 9; j++) {
        if ('undefined' != solved[i][j][1]) {
          content[content.length] = solved[i][j][0];
        }
      }
      return content;
    };


    function colContent(j) {
      let content = [];
      for (let i = 0; i < 9; i++) {
        if ('undefined' != solved[i][j][1]) {
          content[content.length] = solved[i][j][0];
        }
      }
      return content;
    };


    function sectContent(i, j) {
      let content = [];
      let offset = sectOffset(i, j);
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if ('undefined' != solved[offset.i + k][offset.j + l][1]) {
            content[content.length] = solved[offset.i + k][offset.j + l][0];
          }
        }
      }
      return content;
    };


    function lessRowSuggest(i, j) {
      let less_suggest = solved[i][j][2];
      for (let k = 0; k < 9; k++) {
        if (k == j || 'undefined' != solved[i][k][1]) {
          continue;
        }
        less_suggest = arrayDiff(less_suggest, solved[i][k][2]);
      }
      return less_suggest;
    };


    function lessColSuggest(i, j) {
      let less_suggest = solved[i][j][2];
      for (let k = 0; k < 9; k++) {
        if (k == i || 'undefined' != solved[k][j][1]) {
          continue;
        }
        less_suggest = arrayDiff(less_suggest, solved[k][j][2]);
      }
      return less_suggest;
    };


    function lessSectSuggest(i, j) {
      let less_suggest = solved[i][j][2];
      let offset = sectOffset(i, j);
      for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
          if (((offset.i + k) == i && (offset.j + l) == j) || 'undefined' != solved[offset.i + k][offset.j + l][1]) {
            continue;
          }
          less_suggest = arrayDiff(less_suggest, solved[offset.i + k][offset.j + l][2]);
        }
      }
      return less_suggest;
    };


    function arrayDiff(ar1, ar2) {
      let arr_diff = [];
      for (let i = 0; i < ar1.length; i++) {
        let is_found = false;
        for (let j = 0; j < ar2.length; j++) {
          if (ar1[i] == ar2[j]) {
            is_found = true;
            break;
          }
        }
        if (!is_found) {
          arr_diff[arr_diff.length] = ar1[i];
        }
      }
      return arr_diff;
    };


    function arrayUnique(ar) {
      let sorter = {};
      for (let i = 0, j = ar.length; i < j; i++) {
        sorter[ar[i]] = ar[i];
      }
      ar = [];
      for (let i in sorter) {
        ar.push(i);
      }
      return ar;
    };


    function sectOffset(i, j) {
      return {
        j: Math.floor(j / 3) * 3,
        i: Math.floor(i / 3) * 3
      };
    };


    this.solution = function () {
      let solution = solved.slice();
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          solution[i][j].length = 1;
          solution[i][j] = Number(solution[i][j].join(''));
        }
      }

      return solved;
    };


    function isSolved() {
      let is_solved = true;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('undefined' == solved[i][j][1]) {
            is_solved = false;
          }
        }
      }
      return is_solved;
    };


    this.isSolved = function () {
      return isSolved();
    };


    function isFailed() {
      let is_failed = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if ('undefined' == solved[i][j][1] && !solved[i][j][2].length) {
            is_failed = true;
          }
        }
      }
      return is_failed;
    };


    this.isFailed = function () {
      return isFailed();
    };


    function backtracking() {
      backtracking_call++;

      let matrix = [[], [], [], [], [], [], [], [], []];
      let i_min = -1, j_min = -1, suggests_cnt = 0;
      for (let i = 0; i < 9; i++) {
        matrix[i].length = 9;
        for (let j = 0; j < 9; j++) {
          matrix[i][j] = solved[i][j][0];
          if ('undefined' == solved[i][j][1] && (solved[i][j][2].length < suggests_cnt || !suggests_cnt)) {
            suggests_cnt = solved[i][j][2].length;
            i_min = i;
            j_min = j;
          }
        }
      }


      for (let k = 0; k < suggests_cnt; k++) {
        matrix[i_min][j_min] = solved[i_min][j_min][2][k];

        let sudoku = new Sudoku(matrix);
        if (sudoku.isSolved()) {

          out_val = sudoku.solved();

          for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
              if ('undefined' == solved[i][j][1]) {
                markSolved(i, j, out_val[i][j][0])
              }
            }
          }
          return;
        }
      }
    };


    this.solved = function () {
      return solved;
    };


  };

  let sud = new Sudoku(matrix);
  return sud.solution();
}
