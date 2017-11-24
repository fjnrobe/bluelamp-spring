angular.module('bluelamp',)
	.factory("Tag", function TagFactory($http) {

     //dtos:
     //tagDto   {
     //                tagId,
     //                tagValue,
     //                lovId
     //                }"
     // lovid
	 return {

	    //get all tags for the incoming tag type
	    getTagsByType: function(tagId) {

	        var tagList = [{tagId: 1, tagValue: tagId + " one", lovId: tagId, lovTagType: "tag type " + tagId},
	        {tagId: 2, tagValue: tagId + " two", lovId: tagId, lovTagType: "tag type " + tagId},
	        {tagId: 3, tagValue: tagId + " three", lovId: tagId, lovTagType: "tag type " + tagId},
	        {tagId: 4, tagValue: tagId + " four", lovId: tagId, lovTagType: "tag type " + tagId}]

	        return tagList;
	    },
	    //create a new tag
	    addTag: function(tagDto)
	    {

	    }
	 }
});