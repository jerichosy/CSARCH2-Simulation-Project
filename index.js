const multiplicand = document.getElementById('multiplicand');
const multiplier = document.getElementById('multiplier');
const solve = document.getElementById('solve');
// const multiplicand = "1001";
// const multiplier = "1011";
const input_type = "binary";
const step_by_step = false;

    //let M = multiplicandValue
    // const M_n = 0//comp M
    // let A = "0"
    // let Q_1 = "0"
    // let Q = multiplierValue

    // to convert negative decimal to binary
    //Let binary = (decimal >>> 0).toString( redix );

function twosComplement(str) {
    let dec = parseInt(str, 2)
    dec = ~dec+1*-1
    console.log(dec)
    console.log(~dec)
    console.log(~dec+1)
    console.log((~dec+1)*-1)
    return dec.toString(2);  
    
}

solve.addEventListener("click", () => {
    const multiplicandValue = multiplicand.value;
    const multiplierValue = multiplier.value;

    const signMultiplicand = multiplicandValue[0];
    const signMultiplier = multiplierValue[0];

    let maxLength = Math.max(multiplicandValue.length, multiplierValue.length);
    let minLength = Math.min(multiplicandValue.length, multiplierValue.length);
    let toPad = maxLength-minLength;
    if (multiplicandValue.length > multiplierValue.length) {
        let M = multiplicandValue;
        let M_n = twosComplement(M)
        let Q = String(multiplierValue).padStart(toPad, signMultiplier);
        let A = "0".padStart(maxLength-1, 0)
    }
    else{
        let M = String(multiplicandValue).padStart(toPad, signMultiplicand)
        let M_n = twosComplement(M)
        let Q = multiplierValue;
        let A = "0".padStart(maxLength-1, 0)
        console.log("M_n: " + M_n);   
    }
    // 
    console.log(maxLength - minLength)


    // console.log(typeof(multiplicandValue));
    
    //console.log(multiplicandValue[0]);
    // 001 1001 1001 1001
    // A = 0
    // M = multiplicandValue
    // M_n = 
    // sign_ext = 1
    // 
    // Q = multiplierValue  [1,0,1,1] "0000" "1011" "0"
    //                                 1101   0101   1
    // Q_1 = 0
    // a = 0101
    // b = 1
    // a >> b
    // 0010


    //var q = "1011";
    //check msb
    //push msb
   // q.push("1")
   // q.pop()
    //console.log (q)

        
});

function convertToBinary(x) {
    console.log(x)
    // let bin = 0;
    // let rem, i = 1;
    // while (x != 0) {
    //     rem = x % 2;
    //     x = parseInt(x / 2);
    //     bin = bin + rem * i;
    //     i = i * 10;
    // }
    // return bin

    return (dec >>> 0).toString(2);
};

function isBinary(input) {
    return /^[01]+$/g.test(input);
}

