angular.module('bluelamp',)
	.factory("Lov", function LovFactory($http) {

//    dtos:
//      lovDto: {
//              lovId,
//              lovTable,
//              shortName,
//              longName
//    }
	return {

        //return all lovDto entries for the incoming lov table
	    getLovByTable: function(lovTable)
	    {
            var list = [{lovId: 1, lovTable: lovTable, shortName: lovTable + ' short name 1', longName: lovTable + 'long name 1'},
            {lovId: 2, lovTable: lovTable, shortName: lovTable + ' short name 2', longName: lovTable + 'long name 2'},
            {lovId: 3, lovTable: lovTable, shortName: lovTable + 'short name 3', longName: lovTable + 'long name 3'}];

	        return list;
	    }
	}
});