/**
 * Ajoute le support des jours fériés dans le datepicker
 * TODO: en cas de prob de perf, optimiser _getPaque (cache)
 */
( function($) {
    //Datepicker is used as a singleton
    var me = $.datepicker;
	$.extend($.datepicker, {
		
		//XXX France only
		holidays: [
		   {d: 1, m:0}, // 1 jan
		   {d: 1, m:4}, // 1 may
		   {d: 8, m:4}, // 8 may
		   {d: 14, m:6},
		   {d: 15, m:7},
		   {d: 1, m:10},
		   {d: 11, m:10},
		   {d: 25, m:11}
		],
				
		_addDays: function(date, days){
			return new Date(date.getTime() + (days * 86400000));
		},
		
		_getPaque: function(date){
			var y = date.getFullYear();
			
			var n = y - 1900;
			var a = n % 19;
			var b = Math.floor((7 * a + 1 ) / 19);
			var c = (11 * a - b + 4) % 29;
			var d = Math.floor(n / 4);
			var p = 25 - c - (n - c + d + 31) % 7;
			var P = this._addDays(new Date(y, 2, 31), p);
			return P;
		},
		
		isAscension: function(date){
			var asc = this._addDays(this._getPaque(date), 39);
			return (asc.getDate() == date.getDate()) && (asc.getMonth() == date.getMonth());
		},
		
		isPentecote: function(date){
			var pent = this._addDays(this._getPaque(date), 50);
			return (pent.getDate() == date.getDate()) && (pent.getMonth() == date.getMonth());
		},
		
		isPaque: function(date){
			var P = this._getPaque(date);
    		return (P.getDate() == date.getDate()) && (P.getMonth() == date.getMonth());
		},
		
		isHoliday: function(date){
			var d = date.getDate();
			var m = date.getMonth();
			
			for(var i = 0; i < this.holidays.length; i++){
				var h = this.holidays[i];
				if(d == h.d && m == h.m)
					return true;
			}
			
			for(var i = 0; i < this.holidaysFuncs.length; i++)
				if(this.holidaysFuncs[i].call(this, date)) 
					return true;
			
			return false;
		},
		
		noHolidays: function(date) {
			return [ (!me.isHoliday(date)), 'ui-datepicker-week-end ui-datepicker-holiday' ];
		},
		
		//XXX: do smth more generic
		noHolidaysAndNoWeekEnds: function(date){
			var we = me.noWeekends(date) 
			var ho = me.noHolidays(date); 
			return [we[0] && ho[0], (we[0] ? '':we[1]) + ' ' + (ho[0] ? '':ho[1])]
		}
	});
	
	$.datepicker.holidaysFuncs = [me.isPaque, me.isAscension, me.isPentecote];
	//$.datepicker.holidaysFuncs = [];
})(jQuery);