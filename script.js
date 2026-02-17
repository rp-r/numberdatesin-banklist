'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2025-11-18T21:31:17.178Z',
    '2025-12-23T07:42:02.383Z',
    '2025-01-28T09:15:04.904Z',
    '2025-04-01T10:17:24.185Z',
    '2026-02-04T14:11:59.604Z',
    '2026-02-09T17:01:17.194Z',
    '2026-02-10T23:36:17.929Z',
    '2026-02-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'sv-SE', // de-DE sv-SE pt-PT
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2025-11-01T13:15:33.035Z',
    '2025-11-30T09:48:16.867Z',
    '2025-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2026-02-04T16:33:06.386Z',
    '2026-02-09T14:43:26.374Z',
    '2026-02-10T18:49:59.371Z',
    '2026-02-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const startLogOutTimer= function()
{
 // SET TIME TO 5 MINUTES
    let settime=120;
//CALL THE TIME EVERY SECOND
    const tick=function() {
    const min=String(Math.trunc(settime/60)).padStart(2,0);
    const sec=String(settime %60).padStart(2,0);

    labelTimer.textContent=`${min}:${sec}`;
    

    if(settime === 0)
    {
    clearInterval(timer)
    labelWelcome.textContent ='Log in to get started'; 
     containerApp.style.opacity = 0;
    }
settime--;

  }




  tick();

    const timer=setInterval(tick, 1000);

    return timer;
  // IN EACH CALL , PRINT THE REMAINING TIME TO UI
  //WHEN TIME IS ZERO ,STOP TIMER AND LOG OUT USER
}

//CREATEÍNG NEW FNCTION FOR FORMATING CURRENCY
const formatcurr= function(value,local,currency){
  return new Intl.NumberFormat(local,{
    style:'currency',
    currency:currency,
  }).format(value)

  
}

const formatMovementDate=function (date,locale)
{
const calcDaysPassed=(date1,date2)=>Math.round(Math.abs(date2-date1)/(1000*60*60*24));

const dayPassed=calcDaysPassed(new Date(),date);
console.log(dayPassed);
if(dayPassed===0) return  `Today`;
if(dayPassed===1) return `Yesterday`;
if(dayPassed<=7) return `${dayPassed} days ago`;

else

 {
  /*const year=date.getFullYear()
  const month=`${date.getMonth()+1}`.padStart(2,0);
 const da=`${date.getDate()}`.padStart(2,0);
 const hor=`${date.getHours()}`.padStart(2,0);
 const min=`${date.getMinutes()}`.padStart(2,0);
 const sec=date.getSeconds();
 return `${year}/${month}/${da}`;
 */

 return new Intl.DateTimeFormat(locale).format(date)
 
}


}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
const combineMovsDates=acc.movements.map((mov,i)=>
                      ({
movement:mov,
date:acc.movementsDates.at(i),

}));
console.log(combineMovsDates);



 // const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

 if(sort) combineMovsDates.sort((a,b)=> a.movement-b.movement);

 combineMovsDates.forEach(function (obj, i)
 {

    const {movement,date}=obj;
    
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const d=new Date(date);
    const displaydate=formatMovementDate(d,acc.locale);
   // const year=d.getFullYear()
 //const month=`${d.getMonth()+1}`.padStart(2,0);
// const da=`${d.getDate()}`.padStart(2,0);
 //const hor=`${d.getHours()}`.padStart(2,0);
 //const min=`${d.getMinutes()}`.padStart(2,0);
 //const sec=d.getSeconds();
 //const displaydate=`${year} /${month} /${da} ${hor}:${min} `;
 const formatted= new Intl.NumberFormat
 (acc.locale,{style:'currency',
  currency:acc.currency
 }).format(movement)

 const formatcurrency=formatcurr(movement,acc.local,acc.currency)



//${movement.toFixed(2)}
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displaydate}</div>
        <div class="movements__value">${formatcurrency}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
const formatedbalance=formatcurr(acc.balance,acc.local,acc.currency)

  //labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = `${formatedbalance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  //labelSumIn.textContent = `${incomes.toFixed(2)}€`;
labelSumIn.textContent=formatcurr(incomes,acc.local,acc.currency);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
    labelSumOut.textContent = formatcurr(Math.abs(out),acc.local,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  //labelSumInterest.textContent = `${interest.toFixed(2)}€`;
    labelSumInterest.textContent = formatcurr(interest,acc.local,acc.currency);1
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers

//LOGIN DATE ///////



let currentAccount,timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
   acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //ADD TIME AND DATE HERE 
    const n=new Date();
const options=
{
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',
  year:'numeric',
  //weekday:'long'
}
labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale,options).format(n);
 /*   
 const year=n.getFullYear()
 const month=`${n.getMonth()+1}`.padStart(2,0);
 const da=`${n.getDate()}`.padStart(2,0);
 const hor=`${n.getHours()}`.padStart(2,0);
 const min=`${n.getMinutes()}`.padStart(2,0);
 const sec=n.getSeconds();
labelDate.textContent=`${year} /${month} /${da} , ${hor}:${min}`;


*/



    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

if(timer) clearInterval(timer);

   timer=startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
    //RESET TIMER
    clearInterval(timer);
    timer=startLogOutTimer();
  }
});







btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //ADD TRANSFER DATE 

    currentAccount.movementsDates.push( new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());




    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    //ADD SET TIME OUTER IN THE FUNCTION 
    setTimeout( function(){
        currentAccount.movements.push(amount);

    //ADD LOAN DATE
    currentAccount.movementsDates.push( new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    },2500)

  
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {

  e.preventDefault();
  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


/**181 Converting and checking number */

//BASE 10- 0 TO 9
//Binar base 2 - 0 1

console.log(23==23.0);
console.log(+'234');

// parsing


console.log(Number.parseInt('45x',10));

console.log(Number.parseInt('e45',10));

//PARSEINT AND PARSEFLOAT ARE GOLBAL FUNCTION 
//NUMBER CALLED NAMESPACE
console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseInt('2.5rem'));
//CHECK IF THE VALUE IS NAN 
console.log(Number.isNaN(2));
//THIS IS NOT A NUMBER
console.log(Number.isNaN(+'20x'));

//checking if values is Numvber with finite number
console.log(Number.isFinite(20));



//**** 182 Math and rounding 
//*/ 

console.log(Math.sqrt(25));

console.log(25**(1/2));

console.log(Math.max(5,18,23,11,2));
console.log(Math.min(5,18,23,11,2));
//AREA OF CIRCLE
console.log(Math.PI*Number.parseFloat('10px')**2);

//random 

console.log(Math.trunc(Math.random()*6)+1)
//

const randomInt=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;






console.log(randomInt(0,2));


//ROUNDING INTEGERS

console.log(Math.trunc(23.4))
console.log(Math.round(23.9))
console.log(Math.round(23.1))
console.log(Math.ceil(23.9))
console.log(Math.ceil(23.1))
console.log(Math.floor(23.9))
console.log(Math.floor(23.1))
console.log(Math.trunc(-23.4))
console.log(Math.floor(-23.1))


//ROUNDING DECIMAL
//TOFIX RETURN STRING NOT NUMBER
console.log((2.49).toFixed(0))



//**183 REMINDER OPERATOR */

console.log(5%2);

//to check 
const isEven=n=>n%2==0;
console.log(isEven(4));

//WE WILL SELECT ALL THE ROWS OD
//CALL SPREAD OPERATOR TO CREATE NEW ARRAY


labelBalance.addEventListener('click',function()
{
[...document.querySelectorAll('.movements__row')].forEach(function(row,i)
{
//0,2,4,6
if(i%2===0) row.style.backgroundColor='orangered';

//0,3,6,9
if(i%3===0) row.style.backgroundColor='blue';




})

})


// 184 NUMBERIC SEPARATOR
//287 765 888
//287 460 000 000 
const diameter=287_460_000_000;

console.log(diameter);

const price=123_321;
console.log(price);
const PI=3.1415;


//** 185 Working with BigInt */

console.log(2**53-1);
console.log(Number.MAX_SAFE_INTEGER)
//bigInt make save Large 
console.log(BigInt(65464645644546));
//*** CREATE DATES  */

//CREATE DATE 
//THERE ARE FOUR WAYS

const now=new Date();

console.log(now);

console.log( new Date('2019-11-01T13:15:33.035Z'));
console.log( new Date('december 24'));


console.log( new Date( account1.movementsDates[0]));
console.log( new Date(2037,10,19,15,32,15));

console.log( new Date(0));
//3 days later aftrer the UTC
console.log( new Date(3*24*60*60*1000));



//working with dates


const future= new Date(2037,10,19,15,23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
//RETURN THE SECOND PASSED  FROM 1970
console.log(future.getTime());
//cureent TIME STAMP

console.log(Date.now());

future.setFullYear(2040);
console.log(future);

/***187 ADDING DATES TO BANKLIST  */

//FAKE ALWAYS LOG IN

//currentAccount=account1;
//updateUI(currentAccount)
//containerApp.style.opacity=100;



const n=new Date();
 const year=n.getFullYear()
 const month=`${n.getMonth()+1}`.padStart(2,0);
 const da=`${n.getDate()}`.padStart(2,0);
 const hor=n.getHours();
 const min=n.getMinutes();
 const sec=n.getSeconds();
labelDate.textContent=`${year} /${month} /${da} , ${hor}:${min}`;

//year//month//day


/** 189 FIND THE DIFFERENCE OF DAY BETWEEN TWO DATES */


const calDay=(d1,d2)=>Math.abs(d1-d2)/(1000*60*60*24);

console.log(calDay(new Date(2025,12,3), new Date(2025,11,4)))

/**** 190 Internationalizing Dates (INT) */

//formating dates 
const checkInt=new Date();

//provide option object ¨
//SET PROPERTIES OF DAY MONTH AND YEAR
//month long or 2-digit or short or narrow
const options=
{
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'long',
  year:'numeric',
  weekday:'long'
}
//labelDate.textContent= new Intl.DateTimeFormat(currentAccount.locale,options).format(checkInt);
//TAKE FORM USER BROWSER

const local =navigator.language;
console.log(local);


console.log("2026-02-16");
const fut=new Date(2037,10,19,15,23);
const fut1=new Date(2037,11,29,15,23);

console.log(Math.floor(Math.abs((Number(fut)-Number(fut1))/(1000*60*60*24))))


//*191 inyternationalizing Number** */

console.log("191 inyternationalizing Number");
const num=3884476.23
 const options1=
 {
//style:'curreny',
//unit:'celsius',
currency:'EUR'

 };

//console.log('US: ',new Intl.NumberFormat('en-US',options1).format(num));
console.log('SE: ',new Intl.NumberFormat('sv-SE',options1).format(num));
console.log('Syria: ',new Intl.NumberFormat('ar-SY',options1).format(num));
console.log(navigator.language,new Intl.NumberFormat(navigator.language,options1).format(num))



///****192  TIMEers   */
// call after millisecond
console.log("192 set timer")
// DISPLAY AFTER 3 SECOND
//CALL BACK FUNCTION
//'olivies' spencac
 
//WE ADD INGREDIENTS BY USING SPREAD OPERATOR 
const ingredients=['','spinach']


const setPizzatimeouter=
setTimeout((ing1,ing2)=>console.log(`Here is the pizza 🍕 with ${ing1} and ${ing2}`),3000,...ingredients);

if(ingredients.includes('oliver') )clearTimeout(setPizzatimeouter);

console.log('waiting....');


//IF SOMEBODY CALL FUNCTION OVER AND OVER
//settimeout
/*
setInterval(function(){
  const now= new Date();
  console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`)
},1000);

*/


/** 193 IMPLEMENTING A COUNTDOWN TIMER */

