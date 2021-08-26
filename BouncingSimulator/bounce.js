"use strict"

const board = require("./board.js").board;

class BouncingSimulator {
    constructor(board) {
        this.board = board;
        this.vector = { x: 1, y: 1 };
        this.ballPosition = {};
        this.newPosition;
        this.startPosition;
        this.moveCount = 0;
    }
    gameStart() {
        this.whereIsBall();
        this.startPosition = this.ballPosition;
        console.log("Let's play a game.");
        console.table(this.board);
        this.bounceLogic();
        while (
            this.ballPosition.x !== this.startPosition.x ||
            this.ballPosition.y !== this.startPosition.y
        ) {
            this.bounceLogic();
        }
        this.gameOver();
    }
    whereIsBall() {
        for (let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board[row].length; column++) {
                if (this.board[row][column] === "1") {
                    this.ballPosition.x = column;
                    this.ballPosition.y = row;
                    return;
                }
            }
        }
    }
    bounceLogic() {
        this.newPosition = {
            x: this.ballPosition.x + this.vector.x,
            y: this.ballPosition.y + this.vector.y,
        };
        if (
            this.board[this.newPosition.y][this.newPosition.x] === "X" ||
            this.board[this.newPosition.y][this.ballPosition.x] === "X" ||
            this.board[this.ballPosition.y][this.newPosition.x] === "X"
        ) {
            this.borderXVectorChange();
            this.bounceLogic();
        } else if (
            this.board[this.newPosition.y][this.newPosition.x] === "Y"
        ) {
            this.obstacleYVectorChange();
            this.bounceLogic();
        } else this.moveTheBall();
    }
    moveTheBall() {
        {
            this.board[this.ballPosition.y][this.ballPosition.x] = "0";
            this.ballPosition = this.newPosition;
            this.board[this.ballPosition.y][this.ballPosition.x] = "1";
            this.moveCount++;
            console.log(`v: ${this.vector.x}, ${this.vector.y}`);
            console.log(`position: ${this.ballPosition.x}, ${this.ballPosition.y}`);
            console.table(this.board);
        }
    }
    borderXVectorChange() {
        if (
            (this.board[this.newPosition.y][this.ballPosition.x] === "X" &&
                this.board[this.ballPosition.y][this.newPosition.x] === "X") ||
            (this.board[this.newPosition.y][this.ballPosition.x] === "0" &&
                this.board[this.ballPosition.y][this.newPosition.x] === "0")
        ) {
            this.vector.y = -this.vector.y;
            this.vector.x = -this.vector.x;
        } else if (
            this.board[this.newPosition.y][this.ballPosition.x] === "X"
        ) {
            this.vector.y = -this.vector.y;
        } else if (
            this.board[this.ballPosition.y][this.newPosition.x] === "X"
        ) {
            this.vector.x = -this.vector.x;
        }
    }
    obstacleYVectorChange() {
        this.moveTheBall();
        const randomVectorChange = () => {
            const vectors = [1, -1];
            let newVectorX = vectors[Math.floor(Math.random() * vectors.length)];
            let newVectorY = vectors[Math.floor(Math.random() * vectors.length)];
            if (newVectorX === -this.vector.x && newVectorY === -this.vector.y) {
                randomVectorChange();
            } else {
                this.vector.x = newVectorX;
                this.vector.y = newVectorY;
            }
        };
        randomVectorChange();
    }
    gameOver() {
        console.log(`The ball is back`);
        console.log(`The ball moved ${this.moveCount} times.`);
    }
}

const bounce = new BouncingSimulator(board);
bounce.gameStart();