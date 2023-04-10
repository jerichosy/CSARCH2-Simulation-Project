

//let M = multiplicand
// const M_n = 0//comp M
// let A = "0"
// let Q_1 = "0"
// let Q = multiplier

// to convert negative decimal to binary
//Let binary = (decimal >>> 0).toString( redix );


const solve = document.getElementById('solve');

solve.addEventListener("click", () => {
    let M = 0
    let M_n = 0
    let Q = 0
    let A = 0
    let Q_1 = 0

    let multiplicand = document.getElementById('multiplicand').value;
    let multiplier = document.getElementById('multiplier').value;
    const input_type = document.querySelector('input[name="input-type"]:checked').value;
    const step_by_step = document.getElementById('step').checked;
    console.log(multiplicand, multiplier, input_type, step_by_step);

    if (input_type == "decimal") {
        let absMultiplicand = convertToBinary(Math.abs(multiplicand));
        let absMultiplier = convertToBinary(Math.abs(multiplier));
        let maxLength = Math.max(absMultiplicand.length, absMultiplier.length);
        let minLength = Math.min(absMultiplicand.length, absMultiplier.length);
        console.log("maxLength:" + maxLength);

        //NEGATIVE INPUTS
        if (multiplicand < 0) { // 0101 -> 1011
            multiplicand = convertToBinary(multiplicand) // 101 --> 1111 1111 1111 1111 1111 1111 1111 1011
            multiplicand = multiplicand.slice(-maxLength)
        }
        else {
            multiplicand = convertToBinary(multiplicand)
        }
        if (multiplier < 0) {
            multiplier = convertToBinary(multiplier)
            multiplier = multiplier.slice(-maxLength)
        }
        else {
            multiplier = convertToBinary(multiplier)
        }

        // Padding Sign Bit
        if (multiplicand.length > multiplier.length) {
            multiplier = String(multiplier).padStart(maxLength, multiplier[0])
        }
        else if (multiplicand.length < multiplier.length) {
            multiplicand = String(multiplicand).padStart(maxLength, multiplicand[0])
        }

        console.log("Binary multiplicand: " + multiplicand)
        console.log("Binary multiplier: " + multiplier)

    }

    let maxLength = Math.max(multiplicand.length, multiplier.length);
    let minLength = Math.min(multiplicand.length, multiplier.length);
    if (multiplicand.length > multiplier.length) {
        M = multiplicand;
        M_n = twosComplement(M)
        Q = String(multiplier).padStart(maxLength, multiplier[0]);
        A = "0".padStart(maxLength, 0)
    }
    else {
        M = String(multiplicand).padStart(maxLength, multiplicand[0])
        M_n = twosComplement(M)
        Q = multiplier;
        A = "0".padStart(maxLength, 0)
    }
    console.log("M: " + M)
    console.log("M_n: " + M_n)
    console.log("Q: " + Q)
    console.log("A: " + A)

    for (let i = 0; i < maxLength; i++) {
        if (Q[Q.length - 1] > Q_1) {
            // 10 -> A+M_n
            A = addBinary(A, M_n, maxLength)
        }
        else if (Q[Q.length - 1] < Q_1) {
            //  01 -> A+M
            A = addBinary(A, M, maxLength)
        }

        /*
        Q_1: 0
        Q: 0001
        A: 0101
        M: 1011
        M_n: 0101
    
        0101 0001 0
        0010 1000 1
        */
        //Shift Right

        sr = shiftRight(A, Q, Q_1, maxLength);
        A = sr[0];
        Q = sr[1];
        Q_1 = sr[2];
        console.log("A: " + A + " Q: " + Q + " Q_1: " + Q_1);
    }

});

function addBinary(A, M, maxLength) {
    let num1 = parseInt(A, 2);
    console.log(num1)
    let num2 = parseInt(M, 2);
    console.log(num2)
    let num3 = num1 + num2;
    num3 = convertToBinary(num3);
    num3 = String(num3).padStart(maxLength, num3[0])
    num3 = num3.slice(-maxLength);
    return num3;
}

// 1. Save A[maxLength-1] = savedA
// 2. Delete A[maxLength-1]
// 3. Prepend sign extension to A
// 4. Save Q[maxLength-1] = savedQ
// 5. Delete Q[maxLength-1]
// 6. Prepend savedA to Q
// 7. Set Q_1 to saved Q bit
function shiftRight(A, Q, Q_1, maxLength) {
    let savedA = A[maxLength - 1]
    A = A.slice(0, maxLength - 1)
    A = A[0] + A
    let savedQ = Q[maxLength - 1]
    Q = Q.slice(0, maxLength - 1)
    Q = savedA + Q
    Q_1 = savedQ

    return [A, Q, Q_1]
}


function convertToBinary(x) {
    const bin = (x >>> 0).toString(2)
    return x >= 0 ? '0' + bin : bin;
};

function twosComplement(str) {
    let comp = "";
    let foundOne = false;

    for (let i = str.length - 1; i >= 0; i--) {
        if (foundOne == false && str[i] == "0") {
            comp = "0" + comp;
        }
        else if (foundOne == false && str[i] == "1") {
            comp = "1" + comp;
            foundOne = true;
        }
        else {
            if (str[i] == "1") {
                comp = "0" + comp;
            }
            else comp = "1" + comp;
        }
    }

    return comp;
}

function isBinary(input) {
    return /^[01]+$/g.test(input);
}
