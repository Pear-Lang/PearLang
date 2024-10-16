## PearLang Colorful Syntax

**PearLang Colorful Syntax** is a Visual Studio Code extension that provides syntax highlighting for the **Pear** programming language. Whether you're writing simple scripts or complex applications, this extension makes it easier to read and write **Pear** code by offering a visually distinct and vibrant syntax highlighting experience.

---

### Features

- **Syntax Highlighting** for the **Pear** programming language across `.p` and `.pear` file extensions.
- **Colorful and Clear Distinction** of language constructs:
  - Comments
  - Keywords (`define`, `if`, `else`, `function`, etc.)
  - Strings
  - Numbers
  - Operators (`+`, `-`, `*`, `&&`, etc.)
  - Functions and variables
- Support for **single-line comments** (`#`).

With this extension, you can easily differentiate between different language elements to make your **PearLang** coding experience more productive and enjoyable.

---

### Installation

To install **PearLang Colorful Syntax**:

1. Download and install the `.vsix` package for this extension.
2. In Visual Studio Code, go to the **Extensions** view (`Ctrl+Shift+X`).
3. Click on the three-dot menu (`...`) in the top-right corner.
4. Select **Install from VSIX...**, navigate to your `.vsix` file, and click **Install**.

Once installed, open any `.p` or `.pear` file and enjoy the syntax highlighting!

---

### Language Support

This extension provides syntax highlighting for files with the following extensions:

- **.pear**: The primary extension for Pear language files.
- **.p**: An alternative extension for Pear language files.

---

### Supported Syntax

The **PearLang Colorful Syntax** extension currently supports the following **Pear** programming language constructs:

- **Comments**: 
  - Single-line comments using `#`.

  ```pear
  # This is a single-line comment
  ```

- **Keywords**: 
  - Includes common control and data declaration keywords like `define`, `num`, `str`, `bool`, `function`, `if`, `else`, `for`, `while`, `try`, `catch`, and more.

  ```pear
  define num x = 10;
  if (x > 5) {
      print("x is greater than 5");
  }
  ```

- **Strings**: 
  - Double-quoted strings are highlighted.

  ```pear
  define str greeting = "Hello, Pear!";
  ```

- **Numbers**: 
  - Both integer and floating-point numbers are highlighted.

  ```pear
  define num price = 19.99;
  ```

- **Operators**: 
  - Arithmetic, comparison, and logical operators like `+`, `-`, `*`, `/`, `==`, `!=`, `&&`, `||`, etc.

  ```pear
  define num sum = x + y;
  if (x == 10 && y != 5) {
      print("Condition met");
  }
  ```

- **Functions**: 
  - Function definitions and calls are distinctly highlighted.

  ```pear
  function greet(name) {
      print("Hello, " + name + "!");
  }

  greet("PearLang User");
  ```

---

### Usage Example

Here’s a small **Pear** code snippet that demonstrates the syntax highlighting:

```pear
# PearLang syntax highlighting example

define num x = 10;
define str greeting = "Hello, Pear!";

function greet(name) {
    print(greeting + " " + name);
}

if (x > 5) {
    greet("User");
} else {
    print("x is too small.");
}
```

---

### Contributing

If you'd like to contribute to **PearLang Colorful Syntax**, feel free to:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with your changes.

We're happy to accept contributions that improve syntax highlighting, add additional language support, or enhance the overall development experience for **PearLang** users.

---

Enjoy coding with **PearLang Colorful Syntax**! 🍐

---
