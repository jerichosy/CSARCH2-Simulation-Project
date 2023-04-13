const solve = document.getElementById('solve');
const clear = document.getElementById('clear');
const download = document.getElementById('download');

let results = []
let given = {}

clear.addEventListener("click", () => {
    let input1 = document.getElementById('multiplicand');
    let input2 = document.getElementById('multiplier');
    let element = document.querySelector("#solution-box");
    let buttons = document.querySelector("#next-step-box");
    element.innerHTML = '';
    buttons.innerHTML = '';
    input1.value = '';
    input2.value = '';
})

solve.addEventListener("click", () => {
    let element = document.querySelector("#solution-box");
    let buttons = document.querySelector("#next-step-box");
    element.innerHTML = '';
    buttons.innerHTML = '';
    results = []
    let M = 0
    let M_n = 0
    let Q = 0
    let A = 0
    let Q_1 = 0

    let multiplicand = document.getElementById('multiplicand').value;
    let multiplier = document.getElementById('multiplier').value;
    const input_type = document.querySelector('input[name="input-type"]:checked').value;
    const step_by_step = document.getElementById('step').checked;

    console.log(multiplicand, multiplier, input_type, step_by_step)

    if (input_type == "decimal") {
        // if decimal, check for beyond 16-bit signed integer range
        if (multiplicand < -32768 || multiplicand > 32767 || multiplier < -32768 || multiplier > 32767) {
            alert("Multiplicand and multiplier must be between -32768 and 32767");
            return;
        }
        // validate not empty field
        if (multiplicand == "" || multiplier == "") {
            alert("Please enter multiplicand and multiplier");
            return;
        }

        let absMultiplicand = convertToBinary(Math.abs(multiplicand));
        let absMultiplier = convertToBinary(Math.abs(multiplier));
        let maxLength = Math.max(absMultiplicand.length, absMultiplier.length);

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

    }
    else {
        // if binary, check length AND check if 0 and 1 only
        if (multiplicand.length > 16 || multiplier.length > 16) {
            alert("Binary inputs must be 16 bits or less");
            return;
        }
        if (!isBinary(multiplicand) || !isBinary(multiplier)) {
            alert("Binary inputs must only contain 0 and 1");
            return;
        }
    }

    let maxLength = Math.max(multiplicand.length, multiplier.length);
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

    given = { M_n: M_n, M: M, A: A, Q: Q, Q_1: Q_1 }

    for (let i = 0; i < maxLength; i++) {
        if (Q[Q.length - 1] > Q_1) {
            // 10 -> A+M_n
            A = addBinary(A, M_n, maxLength)
            result = {
                "A": A,
                "Q": Q,
                "Q_1": Q_1,
                "msg": "A-M"
            }
            results.push(result);
        }
        else if (Q[Q.length - 1] < Q_1) {
            //  01 -> A+M
            A = addBinary(A, M, maxLength)
            result = {
                "A": A,
                "Q": Q,
                "Q_1": Q_1,
                "msg": "A+M"
            }
            results.push(result);
        }
        else {
            result = {
                "A": A,
                "Q": Q,
                "Q_1": Q_1,
                "msg": "Do Nothing"
            }
            results.push(result);
        }

        sr = shiftRight(A, Q, Q_1, maxLength);
        A = sr[0];
        Q = sr[1];
        Q_1 = sr[2];
        result = {
            "A": A,
            "Q": Q,
            "Q_1": Q_1,
            "msg": "SAR"
        }
        results.push(result);
        console.log("A: " + A + " Q: " + Q + " Q_1: " + Q_1);
    }

    displayResults(step_by_step, maxLength);
});

function addBinary(A, M, maxLength) {
    let num1 = parseInt(A, 2);
    let num2 = parseInt(M, 2);
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
    console.log
    if (A == "undefined") {
        A = savedA;
    }
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

function displayResults(step_by_step, maxLength) {
    let element = document.querySelector("#solution-box");
    let initial = document.createElement("div");
    initial.setAttribute("class", "step");
    initial.innerHTML =
        `
        <div class="step-row">
            <div class="step-element negative-m"> -M: ` + given.M_n + `</div>
            <div class="step-element">M: ` + given.M + `</div>
            <div class="step-element">A: ` + given.A + `</div>
            <div class="step-element">Q: ` + given.Q + `</div>
            <div class="step-element1">Q_1: ` + given.Q_1 + `</div>
        </div>
        
        `
    element.appendChild(initial);


    for (let i = 0; i < results.length - 1; i += 2) {

        let step = document.createElement("DIV");
        step.setAttribute("class", "step");
        step.setAttribute("hidden", "true");
        step.innerHTML =
            `
            <h2> Step `+ ((i / 2) + 1) + ` </h2>
            <div class="step-row">
                <div class="step-element a">A: ` + results[i].A + `</div>
                <div class="step-element q">Q: ` + results[i].Q + `</div>
                <div class="step-element q1">Q<sub>-1</sub>: ` + results[i].Q_1 + `</div>
                <div class="step-element msg">` + results[i].msg + `</div>
            </div>
            <div class="step-row">
                <div class="step-element result a">A: ` + results[i + 1].A + `</div>
                <div class="step-element result q">Q: ` + results[i + 1].Q + `</div>
                <div class="step-element q1">Q<sub>-1</sub>: ` + results[i + 1].Q_1 + `</div>
                <div class="step-element msg">` + results[i + 1].msg + `</div>
            </div>

        `
        if (i == results.length - 1 - 1) {
            let stepRow = step.childNodes[5];
            let answerElements = stepRow.getElementsByClassName("result")
            for (answer of answerElements) {
                answer.classList.add("answer");
            }



        }
        element.appendChild(step);
    }

    let buttonDiv = document.getElementById('next-step-box');
    if (step_by_step) {
        let nextButton = document.createElement('button');
        nextButton.setAttribute("id", "next-button");
        nextButton.innerHTML = `Next`;
        buttonDiv.appendChild(nextButton);
        let i = 1;
        let max_i = maxLength + 1;
        console.log(maxLength)


        nextButton.addEventListener("click", () => {
            var nodes = document.getElementById('solution-box').childNodes;
            nodes[i].hidden = false;
            i++;
            console.log(i)
            if (i == max_i) {
                buttonDiv.removeChild(nextButton);

                let downloadButton = document.createElement('button');
                downloadButton.setAttribute("id", "dl-button");
                downloadButton.innerHTML = `Download results`;
                buttonDiv.appendChild(downloadButton);

                downloadButton.addEventListener("click", () => {
                    downloadResults();
                });
            }


        });


    }
    else {
        var nodes = document.getElementById('solution-box').childNodes;
        console.log(nodes);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].hidden = false;
        }

        let downloadButton = document.createElement('button');
        downloadButton.setAttribute("id", "dl-button");
        downloadButton.innerHTML = `Download results`;
        buttonDiv.appendChild(downloadButton);

        downloadButton.addEventListener("click", () => {
            downloadResults();
        });
    }
}



function downloadResults() {
    let textFileContent = `-M: ${given.M_n}\n M: ${given.M}\n A: ${given.A}  Q: ${given.Q}  Q-1: ${given.Q_1}\n\n`

    step = 0
    for (let i = 0; i < results.length; i += 2) {
        step++
        textFileContent += `Step ${step}:\n A: ${results[i].A}  Q: ${results[i].Q}  Q-1: ${results[i].Q_1}  ${results[i].msg}\n A: ${results[i + 1].A}  Q: ${results[i + 1].Q}  Q-1: ${results[i + 1].Q_1}  ${results[i + 1].msg}\n\n`
    }

    const textFileBlob = new Blob([textFileContent], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(textFileBlob);
    anchor.download = "results.txt";
    anchor.click();
}
