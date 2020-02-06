module.exports = class Game {

    constructor() {
        this.score = 0;
        this.players = [];
        this.costOfClick = 1;
    }

    buttonPress() {
        this.score++;
        return this.checkScore();
    }

    checkScore() {
        if (this.score % 500 == 0) {
            return 250 - this.costOfClick;
        } else if(this.score % 100 == 0) {
            return 40 - this.costOfClick;
        } else if (this.score % 10 == 0) {
            return 5 - this.costOfClick;
        } else {
            return -1;
        }
    }

    getDistanceToNextReward() {

        if (this.score % 10 == 0) {
            return 10;
        } else {
            return 10 - this.score % 10;
        }
        
    }
}