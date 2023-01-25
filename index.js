const grid = document.querySelector(".grid");
let popup = document.querySelector(".popup");
let time = document.getElementById("timer");
let score = 0, adj = 0, tiles = 70, mines = 10,rows = 8, cols = 10;
let board = new Array(rows);
let isStart = false, gg = false;
// Key notes:"mine" = mine | 0-8 = number of mines adjacent
// mine = gameoever
//nothing = bfs
//adjacent mines = number
function createBoard() {//traverse all adjacent squares until border is reached or surrounded by mine adjacent squares
  for (let i = 0; i < rows; i++){
    board[i]= new Array(cols);
    for(let y = 0;y < cols;y++){
      const div = document.createElement("div");
      grid.classList.add("div");
      grid.appendChild(div);
      board[i][y] = div;
      //making squares
      div.addEventListener("click", function(){
        explore(i,y);
        if(tiles <= 0 && !gg){//game win condition
          gameWin();
        }
      });
      div.addEventListener('contextmenu', (ev) => {
        //flag function
        ev.preventDefault();
        if(div.classList.contains("-2") || gg){
          return;
        }
        if(div.classList.contains("flag")){
          // console.log(gg);
          div.classList.remove("flag");
          div.innerHTML="";
          div.style.background= "lightgray"
        }
        else{
          div.innerHTML="<img src=flag.png>";
          div.classList.add("flag");
        }
      });
    }
  }
}
function setMines(m) {//set out mines in random areas, and numbers squares
  for(let i = 0;i < m;i++){//setting down 10 mines
    let a = Math.floor(Math.random() * rows);
    let b = Math.floor(Math.random() * cols);
//placing down all mines, if square already has mine then go again
    if(!board[a][b].classList.contains("mine")){
      board[a][b].classList.remove(...board[a][b].classList);
      board[a][b].classList.add("mine");
      // board[a][b].innerHTML="<img src=mine.png>";
    }
    else{
      i--;
    }
  }
}
function number(){//giving number of adjacent mines number to squares if they are already not a mine, each surrounding square of each square is counted and checked for mine
  for(let i = 0;i < rows;i++){
    for(let y = 0;y < cols;y++){
      if(!board[i][y].classList.contains("mine")){
        adj = 0;
        for(let j = -1;j <= 1;j++){
          for(let k = -1;k <= 1;k++){
            count(i+j, y+k,adj);
          }
        }
        board[i][y].classList.add(adj);
      }
    }
  }
}
function explore(r,c){
  let square = board[r][c];
  if(square.classList.contains("flag") || square.classList.contains("-2") || gg){
    return;
  }
  if(square.classList.contains("mine")){//click on mine
    if(!isStart){
      square.classList.remove("mine");
      setMines(1);
      number();
      explore(r,c);
    }
    else{
      gameOver();
    }
  }
  else if(!isStart){
    isStart = true;
    timer = setInterval(startTime, 1000);
    number();
    explore(r,c);
  }
  else if(square.classList.contains("0") && !square.classList.contains("-2")){//empty
    let mySound = new Audio("beep-6-96243.mp3");
    mySound.play();
    exploreBFS(r,c);
  }
  else{// number
    let mySound = new Audio("start-13691.mp3");
    mySound.play();
    square.innerHTML=square.classList[0];
    if(!square.classList.contains("-2")){
      tiles--;
      square.style.background="gray";
      square.classList.add("-2");
    }
  }
  colour(square);
}
//empty tile
function exploreBFS(r, c){
  let xQ = [], yQ = [];
  xQ.push(r), yQ.push(c);
  board[r][c].style.background="gray";
  board[r][c].classList.add("-2");
  tiles--;
  while(xQ.length != 0){
    let xC = xQ[0];
    let yC = yQ[0];
    xQ.shift();
    yQ.shift();
    for(let i = -1;i <= 1;i++){
      for(let j = -1;j <= 1;j++){
        if(xC+i < 8 && xC+i >= 0 && yC+j < 10 && yC+j >= 0 && !board[xC+i][yC+j].classList.contains("-2") && board[xC][yC].classList.contains("0") && !board[xC][yC].classList.contains("flag")){
          let cur = board[xC+i][yC+j];
          if(cur.classList.contains("0")){
            cur.innerHTML=" ";
          }
          else{
            cur.innerHTML= cur.classList[cur.classList.length-1];
          }
          colour(cur);
          cur.style.background="gray";
          cur.classList.add("-2");
          xQ.push(xC+i);
          yQ.push(yC+j);
          tiles--;
        }
      }
    }
    
  }
}
//game end functions
//resets board
function restart(){
  gg = false;
  time.innerHTML = 0;
  score = 0;
  if(tiles > 0){
    document.getElementById("death").style.display = "none";
  }
  else{
    document.getElementById("win").style.display = "none"
  }
  tiles = 70;
  isStart = false;
  board.forEach(function(row){
    row.forEach(function(entry){
      entry.classList.remove(...entry.classList);
      let clear = grid.removeChild(entry);
    });
  });
  pop.style.display = "none";
  
  createBoard();
  setMines(mines);
}
//if game lost
function gameOver(){
  gg = true;
  let boom = new Audio("boom.mp3");
  boom.play();
  clearInterval(timer);
  pop =  document.getElementById("death");
  pop.style.display = "block";
  board.forEach(function(row){
    row.forEach(function(entry){
      if(entry.classList.contains("mine")){
        entry.style.background="red";
        entry.innerHTML="<img src=Mine.png>";
      }
    });
  });
}
//if win
function gameWin(){
  gg = true;
  clearInterval(timer);
  let congratulations = new Audio("Win.mp3");
  congratulations.play();
  pop = document.getElementById("win");
  pop.style.display = "block";
  board.forEach(function(row){
    row.forEach(function(entry){
      if(entry.classList.contains("mine")){
        entry.style.background="silver";
        entry.innerHTML="<img src=Mine.png>";
      }
    });
  });
  document.getElementById("score").innerHTML = score;
}
//Colour numbers
function colour(tile){
  switch(tile.innerHTML) {
    case "1":
      tile.style.color = "blue";
      break;
    case "2":
      tile.style.color = "green";
      break;
    case "3":
      tile.style.color = "red";
      break;
    case "4":
      tile.style.color = "darkblue";
      break;
    case "5":
      tile.style.color = "darkred";
      break;
    case "6":
      tile.style.color = "darkcyan";
      break
    case "8":
      tile.style.color = "darkgray"  
  }
}
//count adjacent mines
function count(x,y){
  if(x < 0 || x > 7 || y < 0 || y > 9){
    return;
  }
  if(board[x][y].classList.contains("mine")){
    adj++;
  }
}
//timer
function startTime(){
  score++;
  time.innerHTML = score;
}
//actual thing
document.addEventListener("DOMContentLoaded", function () {
  createBoard();
  setMines(mines);
});
