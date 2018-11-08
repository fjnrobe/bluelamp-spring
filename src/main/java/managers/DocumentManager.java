package main.java.managers;

import main.java.dtos.ArtifactDto;
import main.java.models.Artifact;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.Properties;

/**
 * Created by Robertson_Laptop on 5/15/2018.
 */
@Repository("documentManager")
public class DocumentManager {

    public static final String FILE_DIRECTORY = "fileDirectory";
    public static final String ARTIFACT_FILE_NAME_PATTERN = "artifactFilePattern";
    public static final String ARTIFACT_FILE_NAME_TEMPLATE = "artifactFileName";

    public static void persistDocument(ArtifactDto artifactDto)
    {
        Properties props =  SystemManager.loadProperties();
        String filePath = props.getProperty(FILE_DIRECTORY);
        String fileTemplate = props.getProperty(ARTIFACT_FILE_NAME_TEMPLATE);

        //delete an existing file if already present
        deleteDocument(artifactDto.getId());

        String fileName = fileTemplate.replace("{artifactId}", artifactDto.getId());
        fileName = fileName.replace("{documentName}", artifactDto.getDocumentName());

        //strip the leading data:*/*;base64, from the content before decoding
        int idx = artifactDto.getDocumentContent().indexOf(";base64,");

        String strippedContent = artifactDto.getDocumentContent().substring(idx + 8);


        FileOutputStream stream  = null;
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(strippedContent);

            stream = new FileOutputStream(filePath + "//" + fileName);

            stream.write(decodedBytes);

            stream.close();

        } catch (FileNotFoundException e) {

        } catch (IOException e) {

        } catch (Exception e) {

            System.out.print(e.getStackTrace());
        } finally {
            stream = null;
        }
    }


    public static File getDocument(String artifactId)
    {
        File file = null;
        Properties props =  SystemManager.loadProperties();
        String filePath = props.getProperty(FILE_DIRECTORY);
        String artifactDocPattern = props.getProperty(ARTIFACT_FILE_NAME_PATTERN);

        File folder = new File(filePath);
        File[] listOfFiles = folder.listFiles();

        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                if (listOfFiles[i].getName().startsWith(artifactDocPattern)) {

                    String[] fileNameParts = listOfFiles[i].getName().split("_");
                    if (fileNameParts[1].equals(artifactId))
                    {
                        file = new File(listOfFiles[i].getPath());
                        break;
                    }
                }
            }
        }

        return file;
    }


    public static String getDocumentFileName(String artifactId)
    {
        String fileName = "";
        Properties props =  SystemManager.loadProperties();
        String filePath = props.getProperty(FILE_DIRECTORY);
        String artifactDocPattern = props.getProperty(ARTIFACT_FILE_NAME_PATTERN);

        File folder = new File(filePath);
        File[] listOfFiles = folder.listFiles();

        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                if (listOfFiles[i].getName().startsWith(artifactDocPattern)) {

                    String[] fileNameParts = listOfFiles[i].getName().split("_");
                    if (fileNameParts[1].equals(artifactId)) {

                        fileName = listOfFiles[i].getPath();

                        break;
                    }
                }
            }
        }

        return fileName;
    }

    public static void deleteDocument(String artifactId)
    {
        Properties props =  SystemManager.loadProperties();
        String filePath = props.getProperty(FILE_DIRECTORY);
        String artifactDocPattern = props.getProperty(ARTIFACT_FILE_NAME_PATTERN);

        File folder = new File(filePath);
        File[] listOfFiles = folder.listFiles();

        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                if (listOfFiles[i].getName().startsWith(artifactDocPattern)) {

                    String[] fileNameParts = listOfFiles[i].getName().split("_");
                    if (fileNameParts[1].equals(artifactId)) {
                        try {
                            Files.deleteIfExists(listOfFiles[i].toPath());
                        } catch (Exception e)
                        {

                        }
                        break;
                    }
                }
            }
        }
    }
}
