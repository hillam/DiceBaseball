var model = {
	red_team: {
		color: 'red',
		score: [0,0,0,0,0,0,0,0,0]
	},
	blue_team: {
		color: 'blue',
		score: [0,0,0,0,0,0,0,0,0]
	},
	inning: 0,
	at_bat: null, // this gets initialized in document ready
	outs: 0,
	bases: {
		'first': false,
		'second': false,
		'third': false
	}
}

$(document).ready(function(){
	$('#pitch').click(pitch);
	model.at_bat = model.red_team;
	update();
});

/*------------------------------------------------------------------------------
	Update the view
------------------------------------------------------------------------------*/
function update(){
	// Show outs in team color
	set_color($('#outs'));
	$('#outs').text(model.outs + ' outs');

	// Show batter in team color
	set_color($('#batter'));

	/*--------------------------------------------------------------------------
		If a base is true, show a runner with the batting team's color
	--------------------------------------------------------------------------*/
	for (var base in model.bases) {
		if(model.bases[base]){
			$('#' + base).show();
			set_color($('#' + base));
		}
		else{
			$('#' + base).hide();
		}
	}

	/*--------------------------------------------------------------------------
			Show scores and display total runs
	--------------------------------------------------------------------------*/
	var red_tds = $('#red-score td');
	var blue_tds = $('#blue-score td');
	for(var i = 0; i <= model.inning; i++){
		red_tds.eq(i+1).text(model.red_team.score[i]);
		blue_tds.eq(i+1).text(model.blue_team.score[i]);
	}
	$('#red-total').text(sum(model.red_team.score));
	$('#blue-total').text(sum(model.blue_team.score));

	/*--------------------------------------------------------------------------
			Color current inning
	--------------------------------------------------------------------------*/
	var score_tds = model.at_bat == model.red_team ? red_tds : blue_tds;
	var score_td = score_tds.eq(model.inning + 1);
	score_td.text(model.at_bat.score[model.inning]);
	$('td').each(function(){
		$(this).removeClass('red blue');
	});
	set_color(score_td);
}

/*------------------------------------------------------------------------------
	Set the color of an element based on the team currently at bat
------------------------------------------------------------------------------*/
function set_color(element){
	element.removeClass('red blue');
	element.addClass(model.at_bat.color);
}

/*------------------------------------------------------------------------------
	Do the dice animation and then perform the game logic,
	then call update()
------------------------------------------------------------------------------*/
function pitch(){
	// Animate the dice, and then invoke do_pitch
	roll_dice(do_pitch);

	// Perform the game logic
	function do_pitch(die1, die2){
		var outcomes = {
			reach_base: ['Walk', 'Single', 'Single', 'Double', 'Triple', 'Home Run!'],
			out: ['Strikeout', 'Groundout', 'Groundout', 'Groundout', 'Flyout', 'Flyout']
		}

		// GET ON BASE
		if(die1 < 3){
			// display result
			$('#hype').text(outcomes.reach_base[die2-1]);
			// put a runner on base (and shift others)
			advance(true);
			if(die2 / 4 >= 1){
				// 4 will advance once,
				// 5 will advance 2 times,
				// 6 will advance 3 times
				advance(false, (die2 % 4) + 1);
			}
		}
		// YOU'RE OUT
		else{
			// display result
			$('#hype').text(outcomes.out[die2-1]);
			model.outs++;
			if(die2 >= 2 && die2 <= 4 && model.outs < 2){
				// groundout -> runners advance
				advance(false);
			}
		}

		// Next ups
		if(model.outs > 2){
			if(model.at_bat == model.red_team){
				model.at_bat = model.blue_team;
			}
			else{
				model.at_bat = model.red_team;
				model.inning++;
			}
			model.bases.first = false;
			model.bases.second = false;
			model.bases.third = false;

			if(model.inning < 9){
				model.outs = 0;
			}
		}

		update();

		/*----------------------------------------------------------------------
			Check if the game is over
		----------------------------------------------------------------------*/
		if(model.inning == 9 || (model.inning == 8 	&&
				model.at_bat == model.blue_team 	&&
				sum(model.red_team.score) < sum(model.blue_team.score))){
			alert('Game Over');
			$('#pitch').addClass('ui-disabled');
		}
	}
}

/*------------------------------------------------------------------------------
	Animate dice
------------------------------------------------------------------------------*/
function roll_dice(callback){
	$('#pitch').addClass('ui-disabled');

	var counter = 0,
		die1 = 0,
		die2 = 0;
	var animation = setInterval(function(){
		die1 = Math.floor(Math.random() * 6) + 1;
		die2 = Math.floor(Math.random() * 6) + 1;
		$('#die1').text(die1);
		$('#die2').text(die2);

		counter++;
		if (counter >= 10)
		{
		    clearInterval(animation);
			$('#pitch').removeClass('ui-disabled');
			callback(die1, die2);
		}
	}, 100);
}

/*------------------------------------------------------------------------------
	IF take_base is true, put a runner on first and shift other runners,
	ELSE just shift all runners
------------------------------------------------------------------------------*/
function advance(take_base, n){
	if(typeof n === "undefined"){
		n = 1;
	}
	for(var i = 0; i < n; i++){
		if(model.bases.third){
			model.at_bat.score[model.inning]++;
		}
		model.bases.third = model.bases.second;
		model.bases.second = model.bases.first;
		model.bases.first = take_base;
	}
}

// return the sum of an array of numbers
function sum(arr){
	var total = 0;
	for(var i = 0; i < arr.length; i++){
		total += arr[i];
	}
	return total;
}
