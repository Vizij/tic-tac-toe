$(document).ready(function() {
	var $win = $("#win");
	var $lose = $("#lose");
	var $draw = $("#draw");
	var $controls = $("#controls");
	var $xo = $(".xo");
	var $square1 = $("#square1");
	var $square2 = $("#square2");
	var $square3 = $("#square3");
	var $square4 = $("#square4");
	var $square5 = $("#square5");
	var $square6 = $("#square6");
	var $square7 = $("#square7");
	var $square8 = $("#square8");
	var $square9 = $("#square9");
	var $square = $(".square");
	var $main = $("main");

	var player, computer;
	var win = 0;
	var lose = 0;
	var draw = 0;
	var turn = 1;
	var state = [];
	var end = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

	$xo.on("click", function() {
		if (this.innerHTML === "X") {
			player = "X";
			computer = "O";
		} else {
			player = "O";
			computer = "X";
		}
		$(".square").prop("disabled", false);
		$controls.css("display", "none");
		$square.css("display", "flex");
	});

	$square.on("click", function() {
		if (this.innerHTML === "") {
			var $targetSquare = $("#" + this.id);
			var squareNumber = Number(this.id[6]);
			var corners = [1, 3, 7, 9];
			// Player
			state[squareNumber] = player;
			$targetSquare.css("color", "red");
			$targetSquare.text(player);
			if (minimax("YES", player, computer)) {
				return; // Player won
			}
			// AI
			switch (turn) {
				case 1:
					if (!state[5]) {
						$targetSquare = $("#square5");
						squareNumber = 5;
					} else {
						squareNumber = corners[Math.floor(Math.random() * 4)];
						$targetSquare = $("#square" + squareNumber);
					}
					break;
				case 2:
				case 3:
				case 4:
					squareNumber = minimax("NO", player, computer);
					$targetSquare = $("#square" + squareNumber);
					break;
			}
			if (turn < 5) {
				state[squareNumber] = computer;
				$targetSquare.text(computer);
				minimax("YES", player, computer);
				turn++;
			}
		}
	});

	function minimax(check, player, computer) {
		var score = [];
		// Gather scores
		end.forEach(function(arr) {
			var tally = 0;
			for (var i = 0; i < 3; i++) {
				if (state[arr[i]] === player) {
					tally++;
				} else if (state[arr[i]] === computer) {
					tally--;
				}
			}
			score.push(tally);
		});
		// Check for Game Over
		if (check === "YES") {
			if (score.indexOf(-3) >= 0 || score.indexOf(3) >= 0 || turn === 5) {
				$(".square").prop("disabled", true);
				if (score.indexOf(-3) >= 0) {
					$main.append('<div id="results">You Lose!</div>');
					lose++;
					$lose.text("AI: " + lose);
				}
				if (score.indexOf(3) >= 0) {
					$main.append('<div id="results">You Win!</div>');
					win++;
					$win.text("Player: " + win);
				}
				if (turn === 5) {
					$main.append('<div id="results">Draw!</div>');
					draw++;
					$draw.text("Draw: " + draw);
				}
				window.setTimeout(function() {
					turn = 1;
					state = [];
					$("#results").remove();
					$controls.css("display", "block");
					$square.css("display", "none");
					$square.css("color", "white");
					$square.text("");
				}, 2000);
				return true;
			}
		} else { // Determine optimal square
			if (score.indexOf(-2) >= 0) {
				return optimalSquare(score.indexOf(-2));
			}
			if (score.indexOf(2) >= 0) {
				return optimalSquare(score.indexOf(2));
			}
			if (score.indexOf(-1) >= 0) {
				return optimalSquare(score.indexOf(-1));
			}
		}

		function optimalSquare(x) {
			// Optimal range
			for (var j = 0; j < 3; j++) {
				if (state[end[x][j]] === undefined) {
					return end[x][j];
				}
			}
			// Suboptimal selection if optimal range is filled
			for (var k = 9; k > 0; k--) {
				if (state[k] === undefined) {
					return k;
				}
			}
		}
	}
});
