//yo kya krega ki slider ki length nikal ke dega
const inputSlider = document.querySelector("[data-length-slider]");
// jo value slider me ayegi wo screen par update hoyegi
const lengthDisplay = document.querySelector("[data-length-number]");
//password display hoga
const passwordDisplay = document.querySelector("[data-password-display]");
//password copy
const copyBtn = document.querySelector("[data-copy]");
//copy message display
const CopyMsg = document.querySelector("[data-copy-msg]");
//check krega tick ar untick
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
//strength check
const indicator = document.querySelector("[data-indicator]");
// password generate
const generateBtn = document.querySelector("#generateBtn");
const allCheckBox = document.querySelectorAll("input[type='checkbox']");
const symbols='~`!@#$%^&*(){}[]\|?/,.;"';
//empty password
let password="";
//initial length
let passwordLength=10;
//kya kya check hora
let checkCount=0;
handleSlider();
//set strenngth of circle color to grey
setIndicator("#ccc");
// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
      ((passwordLength - min) * 100) / (max - min) + "% 100%";
  }
//strength indicator
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}
//generayte random
function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRandomInt(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));
}
function generateSymbol(){
    const randNum=getRandomInt(0,symbols.length);
    return symbols.charAt(randNum);
}
//rules clear
function calcStrength(){
    let hasUpper =false;
    let hasLower =false;
    let hasNum =false;
    let hasSym =false;
    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym)&&passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper)&&
        (hasNum||hasSym)&&passwordLength>=6){
            setIndicator("#ff0");
        }
    else{
        setIndicator("#f00");
    }
}
async function notcopy(){
    CopyMsg.innerText="Please Select Input";
    CopyMsg.classList.add("active");
    //hide krna 2s baad
    setTimeout( ()=>{
        CopyMsg.classList.remove("active");
    },2000);
}
async function copyContent(){
    try{
        //clipboard copy
        await navigator.clipboard.writeText(passwordDisplay.value);
        CopyMsg.innerText="copied";
    }
    catch(e){
        CopyMsg.innerText="failed";
    }
    //to make copy span visible
    CopyMsg.classList.add("active");
    //hide krna 2s baad
    setTimeout( ()=>{
        CopyMsg.classList.remove("active");
    },2000);
}
function shufflePassword(array){
    //fisher eats method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    //string initialization
    let str="";
    // e hai element
    array.forEach((e)=>(str+=e));
    return str;
    // let array = ['H', 'e', 'l', 'l', 'o'];
    // array.forEach((e) => (str += e));
    // return str; // Output: "Hello"
}
function handleCheckBoxChange(){
    //kitne box checked hai
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    //special handling
    //manle password ki length 2 h par check count 4 h to password length bhi 4 hogi
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
//ek listener lgaya jo ye pta lagayega ki tick untick kitne hai
allCheckBox.forEach(checkbox=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
//jase jase slider change hoga wase wase password length bhi change hogi
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
//copy btm par click krte hi copy function call
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
         copyContent();
    }
    else{
        notcopy();
    }
})
//password generation
generateBtn.addEventListener('click',()=>{
    //manlo check count kuch ni h to koi password nhi ayega
    if(checkCount==0){
        alert("Please select at least 1 checkbox");
    };
    //agar password ki length choti hai check count se to check count ke size ka password ayega
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // find password
    
    //remove old password
    password="";

    //requirements
    // if(upperCaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    //necessary conditions ki kya kya checked hai
    let funcArr=[];
    //iska use ham password generate krne wasta krege
    // ki kis index parkya hoga
    if(upperCaseCheck.checked){
        //yo function nuche islie ni bnaya kyuki isne execute loop kregi
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remaining addition 
    for(let i=0;i<passwordLength-funcArr.length;i++){
        // agar 4 tick hai na to ek random int generate hoga ar uska 
        //jo index h us no ka function call hoge
        let randIndex = getRandomInt(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    //shuffle the password
    //array from kya krega string ne array me convert krega
    //jisse shuffle kr ske ham
    password = shufflePassword(Array.from(password));

    //show in ui 
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();


})