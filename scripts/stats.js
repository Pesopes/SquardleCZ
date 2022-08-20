function updateStats()
{
    let allStatsDiv =document.getElementById("stats-all")
    applyStats(allStatsDiv, squardlesCasual.concat(squardlesSpecial.concat(squardlesWeekly)), "all")
    
    let weeklyStatsDiv = document.getElementById("stats-weekly");
    applyStats(weeklyStatsDiv, squardlesWeekly, "weekly");

    let casualStatsDiv = document.getElementById("stats-casual");
    applyStats(casualStatsDiv, squardlesCasual, "casual");

    let specialStatsDiv = document.getElementById("stats-special");
    applyStats(specialStatsDiv, squardlesSpecial, "special");
    
    let importedStatsDiv = document.getElementById("stats-shared");
    applyStats(importedStatsDiv, squardlesShared, "shared");

    
}

function applyStats(where, sqArr, type)
{
    let completed = where.getElementsByClassName("completed")[0];
    completed.textContent = "Dokončeno " + countCompletedSquardles(sqArr);

    let played = where.getElementsByClassName("played")[0];
    played.textContent = "Hráno " + countPlayedSquardles(sqArr);

    

    let totalScore = where.getElementsByClassName("totalScore")[0];
    totalScore.textContent = "Nasbíráno " + countTotalPoints(sqArr) + " bodů";


    let totalBonusWordsNum = countTotalBonusWords(sqArr)
    let totalWordsFoundNum =  countTotalWordsFound(sqArr)
    
    let totalWordsFound = where.getElementsByClassName("totalWordsFound")[0];
    switch(type)
    {
        case "shared":
        case "all":
            totalWordsFound.textContent = "Slov nalezeno: " + totalWordsFoundNum;
            break;
        default:
            totalWordsFound.textContent = "Slov nalezeno: " + totalWordsFoundNum + "/" + countTotalWords(sqArr);
            break;
    }

    let totalBonusWords = where.getElementsByClassName("totalBonusWords")[0];
    totalBonusWords.textContent = "Bonusových slov: " + totalBonusWordsNum;

    let totalTimePlayed = where.getElementsByClassName("totalTimePlayed")[0];
    totalTimePlayed.textContent = "Celkový čas: " + countTotalTime(sqArr) + " sekund";


    let totalAccuracy = where.getElementsByClassName("totalAccuracy")[0];
    let totalWordsFoundAny =  totalBonusWordsNum + totalWordsFoundNum;
    let accuracyPercent = (totalWordsFoundAny/(countTotalWrongTries(sqArr)+totalWordsFoundAny) * 100)
    if(accuracyPercent)
    {
        totalAccuracy.textContent = "Přesnost: " + (Math.round(accuracyPercent*100)/100) + "%" // round to two decimals
    }
    else
    {
        totalAccuracy.textContent = "Přesnost: neurčena"
    }
    
    
}

function countCompletedSquardles(sqArr)
{
    let numCompleted = 0;
    for (let i = 0; i < sqArr.length; i++) {
        const element = sqArr[i];
        if(getSquardleProgress(element) === 1)
        {
            numCompleted++;
        }
    }
    return numCompleted;
}

function countPlayedSquardles(sqArr)
{
    let numPlayed= 0;
    for (let i = 0; i < sqArr.length; i++) {
        const element = sqArr[i];
        if(getSave(hashSquardle(element)).existed !== false)
        {
            numPlayed++;
        }
    }
    return  numPlayed;
    
}

function countTotalWords(sqArr)
{
    let numWords= 0;
    for (let i = 0; i < sqArr.length; i++) {

        const save = getSave(hashSquardle(sqArr[i]));
        if(save.existed === true)
        {
            numWords += sqArr[i].wordsToFind.length;
        }
  
    }
    return  numWords;
}

function countTotalWordsFound(sqArr)
{
    let numWordsFound= 0;
    for (let i = 0; i < sqArr.length; i++) {
        const save = getSave(hashSquardle(sqArr[i]));
        if(save.existed === true)
        {
            numWordsFound += countTrue(save.wordsFound);
        }
    }
    return  numWordsFound;
}

function countTotalBonusWords(sqArr)
{
    let numBonusWordsFound= 0;
    for (let i = 0; i < sqArr.length; i++) {
        const save = getSave(hashSquardle(sqArr[i]));
        if(save.existed === true)
        {
            numBonusWordsFound += save.bonusWordsFound.length;
        }
    }
    return  numBonusWordsFound;
}

function countTotalPoints(sqArr)
{
    let totalScore = 0;
    for (let i = 0; i < sqArr.length; i++) {
        const element = sqArr[i];
        totalScore += getSquardleScore(element);
    }
    return totalScore;
}

function countTotalTime(sqArr)
{
    let time = 0;
    for (let i = 0; i < sqArr.length; i++) {
        const save = getSave(hashSquardle(sqArr[i]));
        time += save.timePlayed;
    }
    return time;
}
function countTotalWrongTries(sqArr)
{
    let wrongTries = 0;
    for (let i = 0; i < sqArr.length; i++) {
        const save = getSave(hashSquardle(sqArr[i]));
        wrongTries += save.numberOfWrongTries;
    }
    return wrongTries;
}

function toggleStatBox(box)
{
    if(box.classList.contains("opened"))
    {
        box.classList.remove("opened");
    }
    else
    {
        box.classList.add("opened");
    }
}

