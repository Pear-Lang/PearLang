# createDefaultHTML.peartest.pear

# Description:
# This Pear program creates an 'index.html' file with default HTML content
# in the current working directory.

# 1. Define the Base Directory
define str baseDir = ".";  # Current directory

# 2. Define the Default HTML Content
define str htmlContent = "<!DOCTYPE html>\n" +
"<html>\n" +
"<head>\n" +
"    <title>My Page</title>\n" +
"    <meta charset=\"UTF-8\">\n" +
"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
"</head>\n" +
"<body>\n" +
"    <h1>Welcome to My Page</h1>\n" +
"    <p>This is a default HTML file created using Pear.</p>\n" +
"</body>\n" +
"</html>\n";

# 3. Write the HTML Content to 'index.html'
writeFile(baseDir + "/index.html", htmlContent);
print("File 'index.html' has been created with default HTML content in " + baseDir + ".");
