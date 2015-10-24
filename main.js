var model = {
	red_team: {
		color: 'red',
		score: [0,0,0,0,0,0,0,0,0]
	},
	blue_team: {
		color: 'blue',
		score: [0,0,0,0,0,0,0,0,0]
	},
	inning: 8,
	at_bat: null, // this gets initialized in document ready
	outs: 0,
	bases: {
		'first': true,
		'second': true,
		'third': true
	}
}

$(document).ready(function(){
	$('#pitch').click(pitch);
	model.at_bat = model.red_team;
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
	for(var i = 0; i <= model.inning; i++){
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
	var die1 = Math.floor(Math.random() * 6) + 1;
	var die2 = Math.floor(Math.random() * 6) + 1;

	// animate the dice, and then do game logic
	roll_dice(die1, die2, do_pitch);

	function do_pitch(){

	}
}

function roll_dice(die1, die2, callback){

	callback();
}
