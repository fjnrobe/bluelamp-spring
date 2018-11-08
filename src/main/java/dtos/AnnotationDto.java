package main.java.dtos;

/**
 * Created by Robertson_Laptop on 1/7/2018.
 */
public class AnnotationDto {

    private String id;
    private String annotationText;
    //used with shared shapes - if true, the annotation is persisted
    //with the template and visible to all shapes of the template type
    //if false, then the annotation goes with the shape only
    private boolean sharedInd;

    public boolean isSharedInd() {
        return sharedInd;
    }

    public void setSharedInd(boolean sharedInd) {
        this.sharedInd = sharedInd;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAnnotationText() {
        return annotationText;
    }

    public void setAnnotationText(String annotationText) {
        this.annotationText = annotationText;
    }

    public AnnotationDto()
    {

    }


}
