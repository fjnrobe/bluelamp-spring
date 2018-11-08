package main.java.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;


import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by Robertson_Laptop on 4/7/2018.
 */
@Repository
@EnableAutoConfiguration
public class DiagramDao {

    //@Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    private static String SELECT_DIAGRAMS_BY_SEARCH =
        "SELECT d.id  " +
            "FROM PUBLIC.ANNOTATION a  " +
            "INNER JOIN relationship r  " +
            "ON a.relationship_id = r.id  " +
            "inner join diagram d " +
            "on r.diagram_id= d.id " +
            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(:searchText) " +
            "union " +
            "SELECT d.id  " +
            "FROM PUBLIC.ANNOTATION a " +
            "INNER JOIN shape s " +
            "ON a.shape_id = s.id " +
            "inner join diagram d " +
            "on s.diagram_id= d.id " +
            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM PUBLIC.ANNOTATION a " +
            "inner join diagram d " +
            "on a.diagram_id= d.id " +
            "WHERE to_tsvector(a.annotationtext ) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM PUBLIC.TAG t " +
            "INNER JOIN relationship r " +
            "ON t.shape_relationship_id = r.id " +
            "inner join diagram d " +
            "on r.diagram_id= d.id " +
            "WHERE to_tsvector(t.tagvalue ) @@ to_tsquery(:searchText) " +
            "union " +
            "SELECT d.id  " +
            "FROM PUBLIC.TAG t " +
            "INNER JOIN shape s " +
            "ON t.shape_id = s.id " +
            "inner join diagram d " +
            "on s.diagram_id= d.id " +
            "WHERE to_tsvector(t.tagvalue) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM PUBLIC.TAG t " +
            "inner join diagram d " +
            "on t.diagram_id= d.id " +
            "WHERE to_tsvector(t.tagvalue ) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM shape s " +
            "inner join diagram d " +
            "on s.diagram_id= d.id " +
            "WHERE to_tsvector(s.shapetext ) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM relationship r " +
            "inner join diagram d " +
            "on r.diagram_id= d.id " +
            "WHERE to_tsvector(r.shapetext ) @@ to_tsquery(:searchText) " +
            "UNION " +
            "SELECT d.id  " +
            "FROM  diagram d " +
            "WHERE to_tsvector(d.pagetitle || ' ' || d.pagedescription ) @@ to_tsquery(:searchText) ";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }

    public List<String> findBySearchText(String searchText)
    {
        MapSqlParameterSource params = new MapSqlParameterSource("searchText", searchText);

        List<String> diagramIds = this.jdbcTemplate.queryForList(this.SELECT_DIAGRAMS_BY_SEARCH,
                                params, String.class);
                    
        return diagramIds;
    }
}
