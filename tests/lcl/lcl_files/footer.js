jQuery(document).ready(function(){
	$('#Impression').click(function(){window.print();})
	$('#Calculette').click(function(){
		 window.open('/SCUW/calculette/calc.html', 'Calculette', "width=220,height=260,directories=no,location=no,menubar=no,status=no,toolbar=no,resizable=no");})
	
	$('.texteLienFooterInDialog').click(function(){
		var lienFooter = jQuery(this).attr('href');
		var imgWait = "${bel:image('waitRond.gif')}";
		openPageInDialog(lienFooter, 'LCL', null, imgWait, 'LCL', false, 200, 200);
	})
	
});