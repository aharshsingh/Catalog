const fs = require('fs');

// Function to decode the y value from a given base
function decodeYValue(value, base) {
    let yValue = 0;
    for (let char of value) {
        if (/[0-9]/.test(char)) {
            yValue = yValue * base + (parseInt(char, 10));
        } else if (/[a-f]/i.test(char)) {
            yValue = yValue * base + (char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        }
    }
    return yValue;
}

// Function to perform Lagrange interpolation and find the constant term c
function findPolynomialConstant(decodedValues) {
    let c = 0;
    const n = decodedValues.length;

    for (let i = 0; i < n; i++) {
        let term = decodedValues[i][1]; // y value
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= (0 - decodedValues[j][0]) / (decodedValues[i][0] - decodedValues[j][0]);
            }
        }
        c += term;
    }
    return c;
}

// Main function to execute the code
function main() {
    // Read the JSON file
    fs.readFile('test_cases.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        const testCases = JSON.parse(data).test_cases;

        // Process each test case
        testCases.forEach((testCase, index) => {
            const decodedValues = [];
            const n = testCase.keys.n;
            const k = testCase.keys.k;

            for (const key in testCase) {
                if (key === "keys") continue; // Skip the "keys" object
                const x = parseInt(key, 10);
                const base = parseInt(testCase[key].base, 10);
                const value = testCase[key].value;

                const y = decodeYValue(value, base);
                decodedValues.push([x, y]);
            }

            // Calculate the constant term c for the current test case
            const c = findPolynomialConstant(decodedValues);
            console.log(`Secret (constant term c) for Test Case ${index + 1}: ${Math.round(c)}`);
        });
    });
}

// Execute the main function
main();
