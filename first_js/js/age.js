function checkAge() {
    const age= document.getElementById('age').value;
    
    //12 and below ="Child"
    //13 to 19 ="teen"
    //20 t0 59="Adult"
    //60 to above="Senior Citizen"

    if(age <18) {
        document.getElementById('message').innerHTML ="Under Age";
    }
    else {
        document.getElementById('message').innerHTML ="Legal Age";  
    }
     if(age <=12) {
        document.getElementById('message').innerHTML ="Child";
     }
      
       else if(age <=19) {
            document.getElementById('message').innerHTML ="Teen";
        }
       else if(age <=59) {
            document.getElementById('message').innerHTML ="Adult";   
       }
       else if(age >=60) {
        document.getElementById('message').innerHTML ="Senior Citizen";
       }
       console.log(age);
    }

    
 