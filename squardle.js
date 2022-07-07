

// date
let originDate = new Date("Thu Jun 30 2022 08:41:21 GMT+0200 (Central European Summer Time)")
let indexOfSquardle;
  //let indexOfSquardle = Math.floor((date.getTime() - originDate.getTime())/(3600*24*1000));

// information
let numberOfSquardles = 7;


// input data
let squardleName = "";
let size; // size of board
let lettersInBoard = []; // letters in board
let wordToFindPaths =[];
let wordsToFindStrings = [];


let libraryName = "library_syn2015.json"
let LIBRARY = [];
// variables for finding word
let mousePressed = false;
let wordPath = {
    positions:[]
}

// progress
let wordsFound = []; // bool array
let bonusWordsFound = [];

//design





async function initialize(){
    squardleName = "";
    lettersInBoard = [];
    wordToFindPaths =[];
    wordsToFindStrings = [];
    wordsFound = [];
    bonusWordsFound = [];
    await loadData();



    wordsToFindStrings = createWords(wordToFindPaths);

    window.addEventListener("pointerup",()=>{mouseUp()})


    createBoard();
    initSelector();
    updateScore();
    updateFound();
    updateActiveLettersInBoard()
}
// LOAD DATA
async function loadData()
{
    // index
    if(localStorage.getItem("index")!==null)
    {
        indexOfSquardle = JSON.parse(localStorage.getItem("index"))
    }
    else
    {
        indexOfSquardle = 0;
    }


    // loading structure
    let squardle = await getJson("./data/squardle_" + indexOfSquardle +".json");
    lettersInBoard = JSON.parse(JSON.stringify(squardle.letters));

    // letters
        //let tmpBoard = await getJson("./data/Board" + indexOfSquardle +".json");
    // size = tmpBoard.length;
    // for (let i = 0; i < tmpBoard.length; i++) {
    //     const element = tmpBoard[i];
    //     for (let j = 0; j < element.length; j++) {
    //         const subElement = element[j];
    //         lettersInBoard.push(subElement);
    //     }
    // }

    // words
    wordToFindPaths = squardle.wordsToFind;
        //wordsToFind = await getJson("./data/WordsToFind" + indexOfSquardle +".json");
    // load progress
    if(localStorage.getItem("progress_" + indexOfSquardle) !== null)
    {
        wordsFound = [];
        wordsFound = JSON.parse(localStorage.getItem("progress_" + indexOfSquardle));
    }
    else
    {
        for (let i = 0; i < wordToFindPaths.length; i++) {
            const element = wordToFindPaths[i];
            wordsFound.push(false);
        }
    }

    bonusWordsFound = [];
    if(localStorage.getItem("bonus_" + indexOfSquardle) !== null)
    {
        
        bonusWordsFound = JSON.parse(localStorage.getItem("bonus_" + indexOfSquardle));
    }

    // LIBRARY
    LIBRARY = await getJson("./libraries/" + libraryName)
    


}


async function getFile(url)
{
    try{
        return await fetch(url);
    }
    catch(error){
        console.log(error);
    }
    return false;
}
async function getJson(url){
    const obj = await getFile(url);
    if(obj == false)
    {
        return false;
    }
    const jsonObj = await obj.json();
    return jsonObj;
}


// SAVE SQUARDLE USER IS PLAYING
function changeIndex()
{   
    console.log("changed")
    saveProgress();
    let newIndex = document.getElementById("index-selector").selectedIndex;
    localStorage.setItem("index", JSON.stringify(newIndex))
    initialize();
}

async function initSelector()
{
    let selector = document.getElementById("index-selector");
    while(selector.firstChild)
    {
        selector.removeChild(selector.firstChild)
    }
    let i = 0;
    let squardle = await getJson("./data/squardle_" + i +".json");
    while(i < numberOfSquardles)
    {
        let newItem = document.createElement("option");
        newItem.textContent = squardle.name;
        newItem.value = i;
        selector.appendChild(newItem);
        i++;
        document.getElementById("index-selector").selectedIndex = indexOfSquardle
        squardle = await getJson("./data/squardle_" + i +".json");
    }
    
    console.log("The error above is OK");
}

// BOARD
function createBoard()
{
    let board = document.getElementById("board");
    let table = document.createElement("table");
    // deletes existing children
    while(board.firstChild)
    {
        board.removeChild(board.firstChild)
    }
    // creates new board
    for(var i = 0; i < lettersInBoard.length; i++)
    {
        let row = document.createElement("tr");
        row.className = "row";

        for(var j = 0; j < lettersInBoard[0].length; j++)
        {
            let cell = document.createElement("td");
            cell.className = "cell";
            let button = document.createElement("button");
            button.className = "boardButton";
            
            let text = document.createTextNode(lettersInBoard[i][j]);
            let x = i;
            let y = j;
            
            button.addEventListener("click",function(){mouseClick(x,y)});
            button.addEventListener("pointerdown",function(){mouseDown(x,y)});
            button.addEventListener("pointerup", function(){mouseUp()});
            button.addEventListener("pointerenter",function(){mouseEnter(x,y)});
            button.addEventListener("gotpointercapture",(e)=>{e.target.releasePointerCapture(e.pointerId)})

            button.appendChild(text);
            cell.appendChild(button);
            row.appendChild(cell);

        }
        table.appendChild(row);
    }


    board.appendChild(table);
}
function getButton(x,y)
{
    
    return document.getElementsByClassName("row")[x].childNodes[y].firstChild;

}

function updateActiveLettersInBoard()
{
    let includedLetterPaths = []
    for (let i = 0; i < wordToFindPaths.length; i++) {
        if(!wordsFound[i])
        {
            includedLetterPaths.push(wordToFindPaths[i]);
        }
        
    }
    console.log(includedLetterPaths)
    let allIncludedPositions = joinArrays(includedLetterPaths)
    console.log(allIncludedPositions)
    for (let i = 0; i < lettersInBoard.length; i++) {
        
        for (let y = 0; y < lettersInBoard.length; y++) {
            
            if(allIncludedPositions.filter(el=>(el[0]==i&&el[1]==y)) == 0)
            {
                let buttonToDeselect = getButton(i,y);
                buttonToDeselect.classList.add("allWereFound")

            }
            
        }
        
    }
}



// SELECTING WORD
function mouseClick()
{
    //mouseUp();
}
function mouseDown(x,y)
{
    // mouse is pressed now
    mousePressed = true;
    // changes button color etc.
    let button = getButton(x,y);

    button.classList.add("selected");
    // saves position to wordPath
    wordPath.positions.push([x,y]);

    updateWord()
    
    updateLine()
}
function mouseUp()
{
    mousePressed = false;
    if(wordPath.positions.length == 0)
    {
        return;
    }
    // unselects button
    wordPath.positions.forEach(element => {
        let button = getButton(element[0],element[1]);
        button.classList.remove("selected");
    });
    testMainWord();
    // resets array
    wordPath.positions = [];

    updateLine()
    
}
function mouseEnter(x,y)
{
    if(!mousePressed)
    {
        return;
    }
    let button = getButton(x,y);
    if(wordPath.positions.length > 0 && wordPath.positions.filter(element => element[0] == x && element[1] == y).length > 0)// if position was already visited
    {
        if(wordPath.positions.length > 0 && wordPath.positions[wordPath.positions.length-2][0] == x && wordPath.positions[wordPath.positions.length-2][1] == y)// if user is going back
        {
            // deletes last position
            let top = wordPath.positions.pop();
            // unselects last button
            getButton(top[0],top[1]).classList.remove("selected");
        }
    }
    else if(wordPath.positions.length > 0 && Math.abs(wordPath.positions[wordPath.positions.length-1][0] - x) <=1  && Math.abs(wordPath.positions[wordPath.positions.length-1][1] - y) <=1 )
    {
        button.classList.add("selected");
        wordPath.positions.push([x,y]);
    }
    updateWord(createWord(wordPath));

    updateLine()
}

// OUTPUT WORD
function createWord(path)
{
    let string = "";
    path.positions.forEach(element => {
        string += lettersInBoard[element[0]][element[1]];
    });
    return string;
}

function createWords(paths)
{
    let words = [];
    for (let i = 0; i < paths.length; i++) {
        const element = paths[i];
        words.push(createWord(element));
    }
    return words;
}
function updateWord(word)
{
    let wordBox = document.getElementById("output");
    wordBox.textContent = word;

}

// FINDING WORDS

function testMainWord() //<= goes here from mouseUp
{
    let mainWord = createWord(wordPath);
    for (let i = 0; i < wordToFindPaths.length; i++) {
        const element = createWord(wordToFindPaths[i]);
        if(mainWord == element)
        {
            if(wordsFound[i] == true)
            {
                // already found
            }
            else
            {
                // new
                wordsFound[i] = true;
                updateScore();
                updateFound();
                updateActiveLettersInBoard()
                return;
            }
        }
    }
    if(LIBRARY.includes(wordPath))
    {
        bonusWordsFound.push([wordPath]);
    }

}

function updateScore()
{
    let score = 0;
    let maxScore = 0
    for (let i = 0; i < wordsFound.length; i++) {
        let word = createWord(wordToFindPaths[i]);
        maxScore += word.length * word.length;
        if(wordsFound[i])
        {
            score += word.length * word.length;
        }
    }
    let scoreBox = document.getElementById("score-points");

    let scoreBar = document.getElementById("score-bar");
    scoreBar.style.width = String(score/maxScore*100) + "%"


    scoreBox.textContent = score + " bodů";
}

// FOUND WORDS LIST

function updateFound()
{
    let headerBox = document.getElementById("found-header");
    let textBox = document.getElementById("found-words");
    // deletes subdivisions
    while(textBox.firstChild)
    {
        textBox.removeChild(textBox.firstChild);
    }
    while(headerBox.firstChild)
    {
        headerBox.removeChild(headerBox.firstChild);
        
    }
    // creates header
    let numOfFound = 0
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            numOfFound++;
        }
    }
    let numText = document.createElement("p");
    numText.textContent = "Nalezená slova (" + numOfFound + "/" + wordsFound.length + ")";
    numOfFound.id = "numFound";
    headerBox.appendChild(numText);

    // appends found words
    let paragraph = document.createElement("div");

    let words = []
    for (let i = 0; i < wordsFound.length; i++) {
        if(wordsFound[i])
        {
            console.log("push")
            words.push(wordsToFindStrings[i])          
        }
    }


    // THE ULTIMATE FUNCTION TO PRINT FOUND WORDS!!!
    let currentLength = 4;
    let stringOfSameLengthWords = ""
    for (let i = 0; i < words.length; i++) {
        if(words[i].length > currentLength)
        {
            fastAppendText(currentLength + " písmenná slova:", "foundWord-letterHeader", paragraph)
            fastAppendText(stringOfSameLengthWords, "foundWord-words", paragraph)
            fastAppendText(" + zbývá najít " + (howManyXLongWords(currentLength,wordsToFindStrings)-howManyXLongWords(currentLength,words)),"foundWord-missing",paragraph)
            currentLength++;
            while(words[i].length > currentLength)
            {
                fastAppendText(currentLength + " písmenná slova:", "foundWord-letterHeader", paragraph)
                fastAppendText(" + zbývá najít " + (howManyXLongWords(currentLength,wordsToFindStrings)-howManyXLongWords(currentLength,words)),"foundWord-missing",paragraph)
                currentLength++;
            }
            stringOfSameLengthWords = ""
        }
        stringOfSameLengthWords+= words[i] + "  ";
    }
    fastAppendText(currentLength + " písmenná slova:", "foundWord-letterHeader", paragraph)
    fastAppendText(stringOfSameLengthWords, "foundWord-words", paragraph)
    fastAppendText(" + zbývá najít " + howManyXLongWords(currentLength,wordsToFindStrings),"foundWord-missing",paragraph)
    

    paragraph.classList.add("foundWord");
    textBox.appendChild(paragraph);
    saveProgress();
    
}

function sortWords(words)
{
    let newWords = JSON.parse(JSON.stringify(words));
    newWords.sort()
    newWords.sort((word)=>{word.length})
    return newWords;
}


let foundWordsPopUp = false;
function toggleFoundWordsPopUp()
{
    let foundWords = document.getElementById("found");
    if(foundWordsPopUp)
    {
        foundWords.style.display = "none";

    }
    else
    {
        foundWords.style.display = "block";
    }
    foundWordsPopUp = !foundWordsPopUp;
}
// SAVING
function saveProgress()
{
    localStorage.setItem("progress_" + indexOfSquardle,JSON.stringify(wordsFound));
    localStorage.setItem("bonus_" + indexOfSquardle, JSON.stringify(bonusWordsFound));
}

// CREATING LINE
function updateLine()
{
    let line = document.getElementById("line")
    while(line.firstChild)
    {
        line.removeChild(line.firstChild);
    }
    line.appendChild(connectButtons(wordPath))
}

function connectButtons(path)
{
    let positions = []
    for (let i = 0; i < path.positions.length; i++) {
        const element = path.positions[i]
        let button = document.getElementsByClassName("row")[element[0]].childNodes[element[1]].getBoundingClientRect()
        positions.push([button.left + button.width/2 - 7.5 + window.scrollX,button.top /*+ button.height/2*/ -15 + window.scrollY])
    }
    return drawLine(positions)
}

function drawLine(points)
{
    let line = document.createElement("div");
    for (let i = 1; i < points.length; i++) {
        const prevElement = points[i-1]
        const element = points[i];
        line.appendChild(createLine(prevElement[0],prevElement[1],element[0],element[1]));
    }
    return line;

}

// DRAW LINE
function createLineElement(x, y, length, angle) {
    var line = document.createElement("div");
    var styles = 'border: 2px solid rgb(20, 218, 218,0.1); '
               + 'width: ' + length + 'px; '
               + 'height: 15px; '
               + "background-color:rgb(20, 218, 218, 0.5);"
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; '
               + 'border-radius: 10px;'
               + 'z-index: 2';

    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}



function fastAppendText(text,className,where)
{
    let textDiv =document.createElement("div")
    textDiv.textContent = text;
    textDiv.classList.add(className)
    where.appendChild(textDiv);
}

function howManyXLongWords(x,words)
{
    return words.filter(el=>el.length == x).length;
}

function joinArrays(arrays)
{
    let megaArray = [];
    for (let i = 0; i < arrays.length; i++) {
        for (let y = 0; y < arrays[i].positions.length; y++) {
            megaArray.push(arrays[i].positions[y])
        }
    }
    console.log(megaArray)
    return megaArray;
}

function includedInPositionArray(array, position)
{
}

// calls starting program function
// initialize()