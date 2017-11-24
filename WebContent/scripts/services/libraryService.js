angular.module('bluelamp', [])
	.factory("Library", function LibraryFactory($http) {

        //libraryLevelDto
//        {
//
//          libraryId,
//          level,
//          description,
//          abbreviation,
//          parentLibraryId
//         }
        return {
            loadSubLibrary : function(parentLibraryId)
            {
               // var libraryList = "[{libraryId:'0',level:1,description:'Health Overview',abbreviation:'',parentLibraryId:-1,subLibraryList:[{libraryId:'8e9a4b3c-c07e-47f8-a816-5419533d9d77',level:2,description:'UID Flows',abbreviation:'',parentLibraryId:'0',subLibraryList:[{libraryId:'c623aa74-5eff-4a02-8b53-b932ec362ecc',level:3,description':'New Enrollment','abbreviation':'','parentLibraryId':'8e9a4b3c-c07e-47f8-a816-5419533d9d77','subLibraryList':[],'expanded':false,'$$hashKey':'object:12'},{'libraryId':'bb07fc4e-4d61-4535-8214-7a44c9fee8fd',level:3,description:'Cancellation',abbreviation:'',parentLibraryId:'8e9a4b3c-c07e-47f8-a816-5419533d9d77',subLibraryList:[],expanded.false},{libraryId:'a4e209a2-0ddb-49a2-bdee-8513aa416059',level:3,description:'Open Enrollment',abbreviation:'',parentLibraryId:'8e9a4b3c-c07e-47f8-a816-5419533d9d77',subLibraryList:[],expanded:false}],expanded:true},{libraryId:'761423c4-9394-4c93-a925-6182cb9061c8',level:2,description:'Appointment / Health Integration',abbreviation:'',parentLibraryId:'0',subLibraryList:[],expanded':false}],expanded:true},{libraryId:'393026c1-484b-4b26-a6c9-6b0a0fa1c453',level:1,description:'Benefits',abbreviation:'',parentLibraryId:-1,subLibraryList:[{libraryId:'5fdd7813-44ae-4788-8aad-364250f7d7ef',level:2,description:'Death Processing',abbreviation:'',parentLibraryId:'393026c1-484b-4b26-a6c9-6b0a0fa1c453',subLibraryList:[],expanded:false}],expanded:true}]";
                //dummy data for now
                var library1 = {libraryId: 44, level: 1,
                        description: 'Library ' + parentLibraryId, abbreviation: 'abbrev ', parentLibraryId: parentLibraryId, subLibraryList: [], expanded: false };
                return library1;
//                $http({
//                  method: 'GET',
//                  url: '/libraryList',
//                  data: parentLibraryId
//                }).then(function successCallback(response) {
//                        return library1;
//                  }, function errorCallback(response) {
//
//                      return library1;
//
//                  });
            },
            deleteLibraryEntry : function(libraryId)
             {
//                 $http({
//                   method: 'DELETE',
//                   url: '/libraryList' + libraryId
//                 }).then(function successCallback(response) {
//                     // this callback will be called asynchronously
//                     // when the response is available
//                   }, function errorCallback(response) {
//                     // called asynchronously if an error occurs
//                     // or server returns response with an error status.
//                   });
             },

            persistLibraryEntry : function(newEntry)
            {
//                $http({
//                  method: 'POST',
//                  url: '/libraryEntry',
//                  data: newEntry
//                }).then(function successCallback(response) {
//                    // this callback will be called asynchronously
//                    // when the response is available
//                  }, function errorCallback(response) {
//                    // called asynchronously if an error occurs
//                    // or server returns response with an error status.
//                  });

            },

            getLibraryEntry: function(libraryId)
            {
                var library1 = {libraryId: libraryId, level: 1,
                        description: 'Library ' + libraryId,
                        abbreviation: 'abbrev ',
                        parentLibraryId: 7 };
                return library1;
            }
        };
	});


