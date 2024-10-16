# main.pear

import { multiply, fetchData, Calculator } from "./module.pear";

# Functions

function greet(name) {
    print("Hello, " + name + "!");
}

# Variables and Data Types
let num x = 10;
let str greeting = "Hello, World!";
let bool isActive = true;
let obj person = {
    name: "John Doe",
    age: 30,
    isEmployed: true,
};

print("Person's Name: " + person.name);
print("Person's Age: " + person.age);
print("Is Person Employed? " + person.isEmployed);

# Arrays and Objects
let num numbers = [1, 2, 3, 4, 5];
let str names = ["Alice", "Bob", "Charlie"];

print("Numbers Array: " + numbers);
print("Names Array: " + names);

# Functions
greet("Pear User");

# Synchronous Function
function getData() {
    let data = fetchData("https://jsonplaceholder.typicode.com/posts/1");
    print("Fetched Data: " + data);
}

getData();

# Conditional Execution
if (x > 5) {
    print("x is greater than 5");
} else {
    print("x is less than or equal to 5");
}

# Loops
for (let num i = 0; i < 5; i = i + 1) {
    print("For Loop Iteration: " + i);
}

let num counter = 0;
while (counter < 3) {
    print("While Loop Counter: " + counter);
    counter = counter + 1;
}

do {
    print("Do-While Loop Counter: " + counter);
    counter = counter - 1;
} while (counter > 0);

# Exception Handling
try {
    throw "An error occurred!";
} catch (error) {
    print("Caught error: " + error);
} finally {
    print("Finally block executed.");
}

# Unary Expressions
let num positive = +x;
let num negative = -x;
let bool notActive = !isActive;

print("Positive x: " + positive);
print("Negative x: " + negative);
print("Is Active Negated? " + notActive);

# File IO Operations
let str fileData = readFile("C:/path/to/file");
print("File Content: " + fileData);
writeFile("output.txt", fileData + "\nAppended by Pear!");

# Editing Files (Overwrite)
editFile("output.txt", "This is the new content of output.txt.\nOverwritten by Pear!");

# Appending to Files
appendFile("output.txt", "\nAppended Line: More data added.");

# Moving Files
moveFile("output.txt", "backup/output_backup.txt");

# Deleting Files
deleteFile("backup/output_backup.txt");
print("File 'backup/output_backup.txt' has been deleted.");

# Fetch Data using Imported Function
function fetchFromAPI() {
    let apiData = fetchData("https://jsonplaceholder.typicode.com/users/1");
    print("API Data: " + apiData);
}

fetchFromAPI();

# Using Imported Multiply Function
let num multiplied = multiply(4, 5);
print("Multiplied Result: " + multiplied);
