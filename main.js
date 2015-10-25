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
	model.at_bat = model.blue_team;
	update();
});

function update(){
	// Show outs
	set_color($('#outs'));
	$('#outs').text(model.outs + ' outs');

	// Show batter
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
	var red_total = 0;
	var blue_total = 0;
	var red_tds = $('#red-score td');
	var blue_tds = $('#blue-score td');
	for(var i = 1; i <= model.inning; i++){
		red_tds.eq(i).text(model.red_team.score[i]);
		red_total += model.red_team.score[i];
		blue_tds.eq(i).text(model.blue_team.score[i]);
		blue_total += model.blue_team.score[i];
	}
	$('#red-total').text(red_total);
	$('#blue-total').text(blue_total);

	/*--------------------------------------------------------------------------
			Color current inning
	--------------------------------------------------------------------------*/
	var score_tds = model.at_bat == model.red_team ? red_tds : blue_tds;
	var score_td = score_tds.eq(model.inning + 1);
	score_td.text(model.at_bat.score[model.inning]);
	set_color(score_td);
}

/*------------------------------------------------------------------------------
	Set the color of an element based on the team currently at bat
------------------------------------------------------------------------------*/
function set_color(element){
	element.removeClass(['red', 'blue']);
	element.addClass(model.at_bat.color);
}

function pitch(){
	// animate the dice, and then do game logic
	roll_dice(do_pitch);

	function do_pitch(die1, die2){
		/*	TODO:
			- based on dice values:
				- update #hype
				- do the correct action..
		*/
		// GET ON BASE
		if(die1 < 3){
			alert("on base");
		}
		// YOU'RE OUT
		else{
			alert("you're out");
		}
	}
}

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
