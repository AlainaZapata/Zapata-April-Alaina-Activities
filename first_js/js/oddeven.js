function checkOddEven() {
    let num = document.getElementById("numberInput").value;
    let resultText="";

    if(num === "") {
        resultText ="Please Enter a number.";
    } else if (num % 2 === 0) {
        resultText= '${num} is an Even number.';
    }else{
        resultText= '${num} is an Odd number.';
    }
    document.getElementById("result").innerText = resultText;
}
   