//Created By Olin Johnson
var boardSize = 12;
var numMines = 15;

var mode = document.getElementById('modeDisplay').textContent;
if(mode == 'easy' || mode == 'Easy'){
    boardSize = 12;
    numMines = 15;
}else if(mode == 'medium' || mode == 'Medium'){
    boardSize = 16;
    numMines = 24;
    document.getElementById('styling').href = '/css/medium.css';
}else if(mode == 'hard' || mode == 'Hard'){
    boardSize = 20;
    numMines = 50;
    document.getElementById('styling').href = '/css/hard.css';
}

//Alternating Colors Variable
var alternate = 0;



//Stopwatch
var timeStamp = document.getElementById('stopWatch');

var ms = 0;
var s = 0;
var m = 0;
var timer;

function startWatch() {
    timer = setInterval(run, 10);
}

function run() {
    timeStamp.textContent = `${(m < 10 ? "0" + m : m)}:${(s < 10 ? "0" + s : s)}:${(ms < 10 ? "0" + ms : ms)}`;
    ms++;
    if(ms == 100){
        ms = 0;
        s++
    }else if(s == 60){
        s = 0;
        m++;
    }
}

function stopTimer(){
    clearInterval(timer);
}
startWatch();




//Draw Board
for(var i = 1; i < boardSize; i++){
    var row = document.createElement('div');
    var board = document.getElementById('board');
    board.appendChild(row);
    for(var x = 1; x < boardSize;  x++){
            var elem = document.createElement('button');
            row.appendChild(elem);
            if(alternate == 0){
                elem.setAttribute('class', 'board-square');
                alternate = 1;
            }else{
                elem.setAttribute('class', 'board-square-2');
                alternate = 0;
            }
            elem.textContent = '.';
            elem.setAttribute('id', `[${x}, ${i}]`);
            elem.setAttribute('oncontextmenu', `flagged(${x}, ${i})`);
            elem.setAttribute('onclick', `reveal(${x}, ${i})`)


    }
}



//Prevent the Player From Using The Context Menu
document.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    return false;
}, false);



//Generate Mines
var mineBlocks = [];

function plant() {
    var mines = numMines;
    function getMines(){
        for(var m = 0; m < mines; m++) {
            //generate mine coordinates
            var randX = Math.floor(Math.random() * (boardSize -1)) + 1;
            var randY = Math.floor(Math.random() * (boardSize -1)) + 1;
            var block = [randX, randY];
    
            //are two mines on the same square
            function isSame() {
                var numMatches = 0
                for(var i = 0; i < mineBlocks.length; i++){
                    if(block[0] === mineBlocks[i][0] && block[1] === mineBlocks[i][1]){
                        //console.log('match');
                        randX = Math.floor(Math.random() * (boardSize -1)) + 1;
                        randY = Math.floor(Math.random() * (boardSize -1)) + 1;
                        block = [randX, randY];
                        numMatches++;
                        isSame();

                    }
                }
                return numMatches;    
            }
            isSame();

            mineBlocks.push(block);
        }
    }
    getMines();
    //turn the mines a different color
    for(var i = 0; i < mineBlocks.length; i++){
        var b = `[${mineBlocks[i][0]}, ${mineBlocks[i][1]}]`;
        if(b != null){
            var p = document.getElementById(b);
            if(p.className == 'board-square'){
                p.className = 'highlighted-1';
            }else{
                p.className = 'highlighted-2';
            }
        }
    }
}





//Detect Neighbors
function findNeighbors(sqx, sqy) {
    var neighbors = [
        [sqx - 1, sqy - 1], 
        [sqx, sqy - 1], 
        [sqx + 1, sqy - 1], 
        [sqx + 1, sqy],
        [sqx + 1, sqy + 1],
        [sqx, sqy + 1],
        [sqx - 1, sqy + 1],
        [sqx - 1, sqy]
    ];
    return(neighbors);
}




//Display the number of mines near a block
function showMinesNear(m1, m2){
    var surround = findNeighbors(m1, m2);
    var mineCounter = 0;
    var elem = document.getElementById(`[${m1}, ${m2}]`);
    for(var i = 0; i < surround.length; i++){
        var s = surround[i];
        var n = `[${s[0]}, ${s[1]}]`;
        var ment = document.getElementById(n);
        if(ment != null){
            if(ment.className == 'highlighted-1' || ment.className == 'highlighted-2' || ment.className == 'highlighted-1 flagged' || ment.className == 'highlighted-2 flagged'){
                if(elem.className != 'highlighted-1' || elem.className != 'highlighted-2'){
                    mineCounter++;
                }
            }
        }
    }
    if(mineCounter > 0){
        elem.textContent = mineCounter;
        elem.style.color = 'black';
    }else{
        elem.textContent = mineCounter;
    }
}

//Mine Counter
var numMinesFlagged = numMines;
var mineCounter = document.getElementById('mineCounter');
mineCounter.textContent = `Mines Left: ${numMinesFlagged}`;
//Flag the Mines
function flagged(c1, c2) {
    var s = document.getElementById(`[${c1}, ${c2}]`);
    if(s.className == 'board-square flagged'){
        s.className = 'board-square';
        numMinesFlagged++;
    }else if(s.className == 'board-square-2 flagged'){
        s.className = 'board-square-2';
        numMinesFlagged++;
    }else if(s.className == 'highlighted-1 flagged'){
        s.className = 'highlighted-1';
        numMinesFlagged++;
    }else if(s.className == 'highlighted-2 flagged'){
        s.className = 'highlighted-2';
        numMinesFlagged++;
    }else if(s.className == 'revealed'){
        return false;
    }else{
        s.className += ' flagged';
        numMinesFlagged--;
    }
    mineCounter.textContent = `Mines Left: ${numMinesFlagged}`;

    var minesFlagged = [];
    for(var m = 0; m < mineBlocks.length; m++){
        var Mine = document.getElementById(`[${mineBlocks[m][0]}, ${mineBlocks[m][1]}]`);
        if(isFlagged(mineBlocks[m][0], mineBlocks[m][1]) == true){
            minesFlagged.push(Mine);
        }
        if(minesFlagged.length == numMines){
            youWin();
        }
    }
}

var isFlagged = (xCoord, yCoord) => {
    var element = document.getElementById(`[${xCoord}, ${yCoord}]`);
    if(
        element.className == 'board-square' ||
        element.className == 'board-square-2' ||
        element.className == 'highlighted-1' ||
        element.className == 'highlighted-2' ||
        element.className == 'revealed'
    ){
        return false;
    }else{
        return true;
    }
}

var ended = false;
plant();
//Reveal Blocks
function reveal(coordX, coordY){
    //If the block is flagged
    if(isFlagged(coordX, coordY)){
        return false;
    }
    //If the block is a mine
    else if(!ended && document.getElementById(`[${coordX}, ${coordY}]`).className == 'highlighted-1' || document.getElementById(`[${coordX}, ${coordY}]`).className == 'highlighted-2'){
        ended = true;
        endGame();
    //If the block is not a mine
    }else if(!ended){
        //Reveal It
        var elem = document.getElementById(`[${coordX}, ${coordY}]`);
        elem.className = 'revealed';
        showMinesNear(coordX, coordY);
        //Expand more if the square is blank
        if(elem.textContent == '0'){
            var friends = findNeighbors(coordX, coordY);
            for(var i = 0; i < friends.length; i++){
                if(document.getElementById(`[${friends[i][0]}, ${friends[i][1]}]`) !=  null){
                    var f = document.getElementById(`[${friends[i][0]}, ${friends[i][1]}]`);
                    if(f.textContent == '.' && (f.className == 'board-square' || f.className == 'board-square-2')){
                        reveal(friends[i][0], friends[i][1]);
                    }
                }
            }
        }
        //Check to see if all blocks that aren't mines are uncovered
        var uncovered = document.getElementsByClassName('revealed');
        var total = document.getElementsByTagName('button');
        if(uncovered.length == total.length - numMines){
            ended = true;
            youWin();
        }
    }
}

var isMine = (id) => {
    var g = document.getElementById(id);
    if(g.className == 'highlighted-1'){
        return true;
    }else if(g.className == 'highlighted-2'){
        return true;
    }else if(g.className == 'highlighted-1 flagged'){
        return true;
    }else if(g.className == 'highlighted-2 flagged'){
        return true;
    }else {
        return false;
    }
}

//End Game Function
function endGame(){
    var squares = document.getElementsByTagName('button');
    stopTimer();
    for(var o = 0; o < squares.length; o++){
        if(isMine(squares[o].id) == true){
            document.getElementById(squares[o].id).className += ' highlighted';
        }
    }
    setTimeout(() => {
        alert("You Lost!\nWould You Like To Play Again?");
        goBackToBeginning();
    }, 1000);

    
    function goBackToBeginning() {
        window.location.href = '/';
    }
}

function youWin(){
    setTimeout(winner(), 1000);
    stopTimer();
    function winner(){
        alert('You Win!\nWould You Like To Play Again?');
        window.location.href = '/';
    }
}