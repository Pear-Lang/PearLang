# Pearlang Example Program

# Variable declarations
define num x = 10;
define num y = 20;
define num z = x + y;

# Constant declaration
const num MAX_VALUE = 100;

# Function declaration
function multiply(a, b) {
    define num result = a * b;
    return result;
}

# Using the function
define num product = multiply(x, y);

# Control flow statements
if (product > MAX_VALUE) {
    print "Product is greater than MAX_VALUE";
} else {
    print "Product is less than or equal to MAX_VALUE";
}

# Loop
define num count = 0;
define num num,
for (num = 1; num < 10; num++)
do {
    print count; 
    count = count + 1;
} while (count < 5);

# Print statements
print "Sum is: " + z;
print "Product is: " + product;
