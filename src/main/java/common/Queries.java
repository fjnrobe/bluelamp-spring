package main.java.common;

public class Queries {

    public static String artifactSearch = "SELECT ar.id, ar.documenttitle , 'artifact' as doctype " +
            "FROM PUBLIC.ANNOTATION a " +
            " inner join artifact ar " +
            " on a.artifact_id = ar.id " +
            " WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(?1) " +
            " union " +
            " SELECT ar.id, ar.documenttitle ,  'artifact' as doctype " +
            " FROM PUBLIC.TAG t " +
            " inner join artifact ar " +
            " on t.artifact_id = ar.id " +
            " WHERE to_tsvector(t.tagvalue) @@ to_tsquery(?1) " +
            " UNION " +
            " select ar.id, ar.documenttitle,  'artifact' as doctype " +
            " FROM artifact ar " +
            " WHERE to_tsvector(ar.abbreviation || ' ' || " +
            "                   ar.detailedtext || ' ' || " +
            "                   ar.documenttitle) @@ to_tsquery(?1) ";


}