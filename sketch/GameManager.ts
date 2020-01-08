class GameManager {
    public gameSettings: GameSettings;
    public gameArea: GameArea;
    public gameMenu: GameMenu;
    public events!: Events[];
    public players: Player[];
    public balls: Ball[];
    public pads: Pad[];

    constructor(gameMusic: GameMusic) {
        this.gameSettings = new GameSettings(gameMusic);
        this.gameArea = new GameArea;
        this.gameMenu = new GameMenu;
        this.events = [];
        this.players = [];
        this.balls = [];
        this.pads = [];
    }

    // controls the number of players
    public update(): void {
        if (!nrOfPlayers) {
            this.setDefaultNrOfPlayers();
        }
        this.gameMenu.update();
        if (gameMode == 1 || gameMode == 2) {
            this.gameArea.update();
            for (const ball of this.balls) {
                if (ball != undefined) {
                    ball.update();
                }
            }
            for (let i = 0; i < nrOfPlayers; i++) {
                if (this.players[i].activePlayer === true) {
                    this.players[i].update();
                }
            }
            // check for inactive player
            this.removeInactivePlayer();
        }
    }

    public draw(): void {
        // draw menu
        if (gameMode == 0) {
            this.gameMenu.draw();
        }
        else if (gameMode == 1) {
            this.gameArea.draw();
            this.drawPlayers();
            // draws the "relese ball"-text
            fill('black');
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(40);
            text("press SPACE \n to start", width / 2, height / 2);
            // draws winner announcement
            if (this.players.length === 1) {
                this.drawWinnerAnnouncement();
            } 
            // Press space to start
            if (keyIsDown(32) && this.players.length > 1) {
                gameMode = 2;
                this.createEvent();
            }
        } else if (gameMode == 2) {
            this.gameArea.draw();
            this.drawPlayers();
            if (this.players.length > 1) {
                for (const ball of this.balls) {
                    if (ball != undefined) {
                        ball.draw();
                    }
                }
            }
        }

        this.gameSettings.draw();
    }
    
// remove player with activePlayer = false
    public removeInactivePlayer(): void {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (player.activePlayer === false) {
                this.pads.splice(i, 1);
                this.players.splice(i, 1);
                this.balls.length = 1;
                this.events.length = 0;
                gameMode = 1;
            }

            // if nr of players has changed, reset positions
            if (this.players.length < nrOfPlayers) {
                nrOfPlayers--;
                this.setDefaultPositions();
            }
        }
    }

    public setDefaultPositions(): void {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (i === 0) {
                // 0 is not read as number so it is set manually
                player.pad.setCurrentPosition = 0;
                player.pad.setStartPosition = 0;
            }
            else {
                // position = full circle divided by nr of players, multiplied by playerID
                // or else each player ends up at the same position
                player.pad.setCurrentPosition = (360 / nrOfPlayers) * i;
                player.pad.setStartPosition = (360 / nrOfPlayers) * i;
            }
            player.setConstrainValues();
        }
    }

    private drawWinnerAnnouncement() {
        /** Draw the yellow circle*/
        strokeWeight(2)
        stroke('#000000')
        fill('#F4ed47');
        circle((width * .5), (height * .5), 500)

        /** text*/
        strokeWeight(2)
        let winnerText1 = 'CONGRATULATIONS!'
        textSize(30);
        fill('#000000');
        text(winnerText1, (width * .5), (height * .5) - 70)

        let winnerText2 = 'YOU HAVE WON'
        textSize(30);
        fill('#000000');
        text(winnerText2, (width * .5), (height * .5) - 20)

        strokeWeight(5)
        let winnerText3 = 'BATTLE PONG'
        textSize(50);
        fill('#000000');
        text(winnerText3, (width * .5), (height * .5) + 30)

        strokeWeight(5)
        let winnerText4 = 'BATTLE PONG'
        textSize(50);
        fill('#ff0000');
        text(winnerText4, (width * .5) + 5, (height * .5) + 27)

        strokeWeight(0)
        let winnerText5 = 'Refresh the page to play again'
        textSize(20);
        fill('#000000');
        text(winnerText5, (width * .5), (height * .5) + 100)
    }

    // draw each player
    public drawPlayers(): void {
        if ((this.players && gameMode == 1) || (this.players && gameMode == 2)) {
            for (const player of this.players) {
                player.draw();
            }
        }
    }

    // add player and pad to each list
    public createPlayer(): void {
        let newPlayer = new Player;
        this.players.push(newPlayer);

        for (let i = 0; i < this.players.length; i++) {
            const pad = this.players[i].pad;
            this.pads.push(pad);
        }
    }

    // create and add ball to list
    public createBall(): void {
        let newBall = new Ball;
        this.balls.push(newBall);
    }

    // create event
    public createEvent(): void {
        if (!this.events || this.events.length < 1 || this.players.length > 1) {
            const newEvent = new Events;
            this.events.push(newEvent);
        }
        else {
            this.events.length = 0;
            this.balls.length = 0;
        }
    }

    // set and add default nr of players at game start
    private setDefaultNrOfPlayers() {
        nrOfPlayers = 2;
        for (let i = 0; i < nrOfPlayers; i++) {
            this.createPlayer();
        }
    }
}
