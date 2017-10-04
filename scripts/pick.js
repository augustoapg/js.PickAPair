/*
 Name:  Augusto Araujo Peres Goncalez
 Project Name: PickAPair
 Date:  06/13/17
 
 Page Description: this is the page that contains all the functionality for the
 game, due to the Javascript functions and constants contained on it
 Files: index.html - the page that contains the board for the game
 pick.css - the page that contains the styles for the web site
 */

/**
 * pick.js
 * @author Augusto Araujo Peres Goncalez
 */

document.addEventListener("DOMContentLoaded", boardSize);

// The pictureMap array maps the pictures to each cell on the board: 
// The value of the elements is an index# for a picture file e.g. image1.png,
// image2.png, image3.png, etc.  So, for example, the element of index 0
// would default to a 1, meaning that cell's <img> would reference image1.png.
// By default, the pictures are laid out 1 1 2 2 3 3 4 4 etc...
// When the game starts, these indexes will be scrambled so that each
// cell is assigned a random index.  E.g. if pictureMap[0] is assigned the
// index 4, that means that cell is "hiding" images/image4.png, so when
// the user clicks on that image, it will reveal image4.png.
// Initialize the imgMap array:
var pictureMap = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
        10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18);

// matchedImgs keeps track of which image elements have been matched so that 
// the user can't flip an image that has already been matched. This one 
// stores a boolean true if the image has been matched and false if it hasn't
// been matched, yet.
var matchedImgs = new Array();
var numMatches = 0;  // keeps track of # of matched pairs (18 max)

// the pair of image elements that was clicked: index 0 contains the first 
// image element that was clicked and index 1 contains the second image 
// element that was clicked
var clickedImgs = new Array(null, null);

var okToClick = false;  // keep track of when it's ok to click during timer
var clickNum = 0; // first image click (0) or second image click (1)?
var flipTimer; // flips cards back after 2 seconds if no match
var gameTimer; // counts mins/seconds user is taking to finish
var gameTicker = 0;  // seconds counter for gameTimer

// used to keep elements board and row (tr) to increase efficiency
var board;
var row;

var img; // to keep image for adding src and events
var timer; // used to finish the timer at the end of the game

var numMoves = 0; // used to keep track of amount of moves

var size;

var firstGame = true;

function boardSize() {

    document.getElementById("size").style.display = "block";

    if (firstGame) {
        for (i = 1; i <= 3; i++) {
            document.getElementById("size" + i * 2).
                    addEventListener("click", function () {
                        size = this.id.substring(4);
                        init();
                    });

        }
    }
}


// start a new game
function init() {

    // hides button choises for size of the board
    document.getElementById("size").style.display = "none";

    // scramble the images
    scramble();
    // it's ok to click an image
    okToClick = true;

    // reset all images to unmatched
    for (i = 0; i < (size * size); i++) {
        matchedImgs[i] = false;
    }

    // creates 6 rows 
    board = document.getElementById("board");
    var imgId = 0; // to assign the correct ids to the images

    // loop to create as many roows as the size chosen
    for (i = 0; i < size; i++) {

        // append new row into board table
        board.appendChild(document.createElement("tr"));
        row = board.lastElementChild;

        // put images inside each row according to size chosen
        for (j = 0; j < size; j++) {

            // creates td, img and assign properties into img
            row.appendChild(document.createElement("td"));
            img = row.lastElementChild.
                    appendChild(document.createElement("img"));
            img.src = "images/image0.png";
            img.alt = "back";
            img.id = "img" + imgId++;

            // on click it is going to call the showPicture which needs the 
            // current image as a parameter
            img.addEventListener("click", function () {
                showPicture(this);
            });
        }
    }

    // execute timeGame every second
    timer = window.setInterval(timeGame, 1000);

    document.getElementById("message").
            addEventListener("click", function () {
                showDialog(false); // needs to pass value to showDialog
            });



}

// Flips over an image when it's clicked: swaps the source of
// the image to its hidden picture.  The img param is the
// actual image that the user clicked on
function showPicture(img) {

    // get the picture# from this image's id (always "imgX" so
    // substring(3) starts at pos 3 and gives us the rest of the string)
    var index = img.id.substring(3);

    // if it's ok to click right now and this image is not already
    // matched
    if (okToClick && !matchedImgs[index]) {

        img.src = "images/image" + pictureMap[index] + ".png";


        // The first click just reveals a hidden picture, and the 
        // second click determines if the first picture and second
        // picture match.

        // if this is the first image click
        if (clickNum === 0) {
            clickedImgs[0] = img;
            clickNum = 1;
        }

        // NOTE: Added this condition so that the user cannot click on the same
        // image twice and count as a match
        
        // this is the second image click
        else if (index !== clickedImgs[0].id.substring(3)) {

            clickedImgs[1] = img; // add second img to second position on array
            numMoves++; // increase num of moves made

            // If both pictures clicked are the same (same source)
            if (clickedImgs[0].src === clickedImgs[1].src) {

                // gets the index of the first image clicked and use it to
                // update the right position of the matchedImgs 
                matchedImgs[clickedImgs[0].id.substring(3)] = true;
                matchedImgs[index] = true; // relative to second image clicked

                // increase num of matches
                numMatches++;

                // execute flip to make it possible to click in other cards
                window.setTimeout(flip, 100);

            } else { // if images do not match
                window.setTimeout(flip, 1000); // flip to back after 1 second
            }

            // reset clickNum so that we can start over with
            // a new pair of pictures
            clickNum = 0;
            // don't allow clicking until flip() is done
            okToClick = false;

        } // end of if/else 1st/2nd image click
    } // end of if it's ok to click and the image isn't a matched one
} // function showPicture()

// Flips the images back over if there's no match and check to 
// see if the game is finished.
function flip() {

    if (clickedImgs[0].src !== clickedImgs[1].src) {
        clickedImgs[0].src = "images/image0.png";
        clickedImgs[1].src = "images/image0.png";
    }

    // it's ok to click again
    okToClick = true;

    // if game has been won

    // if there are matches equal to the amount of pair images on board (amount
    // of pair images are the size square divided by 2
    if (numMatches === ((size * size) / 2)) {

        // message for winner with the time taken and moves made
        document.getElementById("winner").innerText = "Good game! You \n\
            finished in " + document.getElementById("ticker").innerHTML +
                " and you made " + numMoves + " moves!";

        window.clearInterval(timer); // stops timer
        showDialog(true); // show message

        okToClick = false; // user cannot click anymore

        // gets restart button, shows it and add the click event to restart if
        // it is the first game
        var button = document.getElementById("restart");
        button.style.display = "block";

        /* if it is the first game, add the click event, otherwise there is no
         need to do so */
        if (firstGame) {
            button.addEventListener("click", function () {
                restart(button); // calls the restart to clear the game
            });
        }
    }
}

// restart function that will hide the button, remove the old board, reset all 
// variables (numMatches, numMoves, gameTicker and pictureMap) and 
// call the sizeBoard function (restart game)
function restart(button) {

    // removes old board game (all rows in the board)
    for (i = 0; i < size; i++) {
        board.removeChild(board.firstElementChild);
    }

    button.style.display = "none"; // hides button

    // variable used to prevent from adding eventListener more than once on 
    // buttons on the game
    firstGame = false;
    numMatches = 0; // reset matches
    numMoves = 0; // reset moves
    gameTicker = 0; // reset timer counter
    
    // reset piture map
    pictureMap = new Array(1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
        10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18);

    // reset time displayed on the page
    document.getElementById("ticker").innerHTML = "0:00";
    boardSize(); // restart game
}

// Executes once per second: updates the ticker on the page
// with the current time elapsed.
function timeGame() {

    // increment the ticker
    gameTicker++;

    // get the minutes and seconds and display
    // in the ticker element
    var minutes = Math.floor(gameTicker / 60);
    var seconds = gameTicker % 60;
    var output = minutes + ":";
    output += (seconds <= 9) ? "0" + seconds : seconds;
    document.getElementById("ticker").innerHTML = output;
}

// Scambles/shuffles the pictures in the pictureMap by swapping each
// picture with another picture chosen at random.  Repeats the process
// to sufficiently scramble the pictures.
function scramble() {

    // do this 5 times for good measure
    for (n = 0; n < 5; n++) {

        // swap each cell's img# with a random one
        for (i = 0; i < (size * size); i++) {

            // choose a picture at random
            var random = Math.floor(Math.random() * (size * size));
            var picNum = pictureMap[random];

            // swap the current picture with the random one
            var temp = pictureMap[i];
            pictureMap[i] = picNum;
            pictureMap[random] = temp;
        }
    }
}

// Shows or hides the message box.
function showDialog(show) {
    if (show) {
        document.getElementById("overlay").style.display = "block";
        document.getElementById("message").style.display = "block";
    } else {
        document.getElementById("overlay").style.display = "none";
        document.getElementById("message").style.display = "none";
    }
}