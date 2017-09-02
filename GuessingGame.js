function generateWinningNumber () {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var swapIndex = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[swapIndex];
    arr[swapIndex] = temp;
  }
  return arr;
}

function Game () {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
  if (this.playersGuess < this.winningNumber) {
    return true;
  }
  return false;
};

Game.prototype.playersGuessSubmission = function (guess) {
  if (typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw 'That is an invalid guess.'
  }
  this.playersGuess = guess;
  return this.checkGuess();
};

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $('#subtitle').text('Please press the Reset button for a New Game.');
    $('#hint, #submit').prop("disabled",true);
    return 'You Win!';

  } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
    return 'You have already guessed that number.';

  } else {
    this.pastGuesses.push(this.playersGuess);
    $('#list-of-guesses li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    if (this.pastGuesses.length === 5) {
      $('#subtitle').text('Please press the Reset button for a New Game.');
      $('#hint, #submit').prop("disabled",true);
      return 'You Lose.';
    } else {
      if (this.isLower()) {
        $('#subtitle').text("Guess Higher!");
      } else {
        $('#subtitle').text("Guess Lower!")
      }
    }

    if (this.difference() < 10) {
      return 'You\'re burning up!';
    } else if (this.difference() < 25) {
      return 'You\'re lukewarm.';
    } else if (this.difference() < 50) {
      return 'You\'re a bit chilly.';
    } else {
      return 'You\'re ice cold!';
    }
  }
};

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  var hintsArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
  return shuffle(hintsArr);
};


$(document).ready(function() {
  var game = new Game();

function grabGuess(game) {
  var guess = $('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
}

  $('#submit').click(function(e) {
    grabGuess(game);
  });

  $('#player-input').keypress(function(event) {
    if (event.which == 13) {
      grabGuess(game);
    }
  });

  $('#hint').click(function (e) {
    var hints = game.provideHint();
    $('#title').text('Try ' + hints[0] + ' or ' + hints[1] + ' or ' + hints[2] + ' as your winning number.')
  });

  $('#reset').click(function() {
    $('#title').text('EG\'s Guessing Game-arama!');
    $('#subtitle').text('*~*Guess a number between 1 and 100*~*');
    $('#hint, #submit').prop("disabled",false);
    $('.guess').text('_');
  })
});

