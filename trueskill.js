const Result = {
    WIN: 1,
    DRAW: 0,
    LOSS: -1,
};

const GameInfo = {
    beta: 4.16667,
    tau: 0.0833333
};


function calculateNewRatings(teamL, teamR, rankL, rankR){
    // rank teams in order (i.e. team 1 >= team 2)
    let team1, team2;
    if (rankL < rankR){
        team1 = teamL;
        team2 = teamR;
    }
    else {
        team1 = teamR;
        team2 = teamL;
    }
    let wasDraw = (rankR == rankL);
    let newRatings = [];

    update(newRatings, team1, team2, wasDraw ? Result.DRAW : Result.WIN);
    update(newRatings, team2, team1, wasDraw ? Result.DRAW : Result.LOSS);

    return newRatings;

}

function update(newRatings, thisTeam, otherTeam, result){
    let drawMargin = 0; // We can't really draw a fussball game can we?
    let betaSquared = GameInfo.beta * GameInfo.beta;
    let tauSquared = GameInfo.tau * GameInfo.tau;
    let totalPlayers = thisTeam.length + otherTeam.length;

    let thisMeanSum = thisTeam.reduce((total, x) => total + x.mean, 0);
    let otherMeanSum = otherTeam.reduce((total, x) => total + x.mean, 0);

    let c = Math.sqrt(
        thisTeam.reduce((total, x) => total + (x.stdev * x.stdev), 0) +
        otherTeam.reduce((total, x) => total + (x.stdev * x.stdev), 0) +
        totalPlayers * betaSquared);

    let winningMean = thisMeanSum;
    let losingMean = otherMeanSum;
    if (result == Result.LOSS) {
        winningMean = otherMeanSum;
        losingMean = thisMeanSum;
    }

    let meanDelta = winningMean - losingMean;

    let v, w, rankMultiplier;

    if (result == Result.DRAW){
        // TODO
        console.log("Draws are not yet implemented!");
        console.log("Calculating draw as a win!");
        v = VWin(meanDelta/c, drawMargin/c);
        w = WWin(meanDelta/c, drawMargin/c);
        rankMultiplier = 1;
    }
    else {
        v = VWin(meanDelta/c, drawMargin/c);
        w = WWin(meanDelta/c, drawMargin/c);
        rankMultiplier = result;  // 1 if win, -1 if loss
    }
    for (player of thisTeam) {
        let meanMultiplier = ((player.stdev * player.stdev) + tauSquared)/c;
        let stdevMultiplier = ((player.stdev * player.stdev) + tauSquared)/(c*c);

        let playerMeanDelta = (rankMultiplier*meanMultiplier*v);
        let newMean = player.mean + playerMeanDelta;

        let newStdev = Math.sqrt(
            ((player.stdev * player.stdev) + tauSquared) * (1 - w*stdevMultiplier));

        newRatings.push({
            id: player.id,
            mean: newMean,
            stdev: newStdev,
        });
    }
}

// Also compare with:
// https://github.com/sublee/trueskill/blob/master/trueskill/__init__.py

function VWin(meanDelta, drawMargin){
    let denominator = cdf(meanDelta - drawMargin, 0, 1);
    if (denominator < 2.222758749e-162) {
        return - meanDelta + drawMargin;
    }
    let numerator = pdf(meanDelta - drawMargin, 0, 1);
    return numerator / denominator;
}


function WWin(meanDelta, drawMargin){
    let v = VWin(meanDelta, drawMargin);
    return v * (v + meanDelta - drawMargin);
}


// gaussian addapted from https://www.npmjs.com/package/gaussian
function erfc(x) {
    // Complementary error function
    // From Numerical Recipes in C 2e p221
    var z = Math.abs(x);
    var t = 1 / (1 + z / 2);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
            t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
            t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
            t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
}

function pdf(x, mu, sigma){
    var variance = sigma * sigma;
    var m = sigma * Math.sqrt(2 * Math.PI);
    var e = Math.exp(-Math.pow(x - mu, 2) / (2 * variance));
    return e / m;
}

function cdf(x, mu, sigma){
    return 0.5 * erfc(-(x - mu) / (sigma * Math.sqrt(2)));
}

trueSkill = {calculateNewRatings};
