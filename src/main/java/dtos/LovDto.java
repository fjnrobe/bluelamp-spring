package main.java.dtos;

/**
 * Created by Robertson_Laptop on 1/13/2018.
 */
public class LovDto {

    private String id;
    private String lovTable;
    private String shortName;
    private String longName;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLovTable() {
        return lovTable;
    }

    public void setLovTable(String lovTable) {
        this.lovTable = lovTable;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getLongName() {
        return longName;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }
}
