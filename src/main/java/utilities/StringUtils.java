package main.java.utilities;

/**
 * Created by Robertson_Laptop on 6/5/2016.
 */
public class StringUtils {

    public static boolean isEmpty(String var)
    {
        return ((var == null) || (var.length() == 0));
    }

    public static int compareTo(String var1, String var2)
    {
    	int compareValue = 0;
    	if (isEmpty(var1))
    	{ 
    		if (isEmpty(var2))
    		{
    			compareValue = 0;
    		}
    		else
    		{
    			compareValue = -1;
    		}
    	}
    	else
    	{
    		if (isEmpty(var2))
	    	{
	    		compareValue = 1;
	    	} else
	    	{
	    		compareValue = var1.compareTo(var2);
	    	}
    	}
    	
    	return compareValue;
    }
    
    public static boolean stringToBoolean(String value)
    {
        boolean retValue = false;
        if (!isEmpty(value))
        {
            if (value.equalsIgnoreCase("true"))
            {
                retValue = true;
            }
            else if (value.contains("Y"))
            {
                retValue = true;
            }
        }

        return retValue;
    }
}
