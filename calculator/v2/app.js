class Calculator {
    constructor(prevOperandElement, currentOperandElement) {
        this.prevOperandElement = prevOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.state = 'calc';
        this.clear();
    }
    setOperator(operator){
        if (this.previousOperand !== '') {
            this.compute();
            this.updateDisplay();
        }
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }
    deleteChar(){
        this.currentOperand = this.currentOperand.slice(0, -1);
        this.updateDisplay();
    }
    appendNumber(number){
        if (number === "." && this.currentOperand.includes('.')) {
            return
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }
    compute(){
        let computation;
        let first = parseFloat(this.previousOperand);
        let second = parseFloat(this.currentOperand);
        if (isNaN(first) || isNaN(second)) {return};
        switch (this.operation) {
            case '+' :
                computation = first + second;
                break;
            case '-' :
                computation = first - second;
                break;
            case '×' :
                computation = first * second;
                break;
            case '÷' :
                computation = first / second;
                break;
            default: 
                return
        }
        this.currentOperand = computation;
        this.operation = null;
        this.previousOperand = '';

    }
    getDisplayNumber(number){
        const stringNumber = String(number);
        const intDigits = parseFloat(stringNumber.split(".")[0]);
        const decDigits = stringNumber.split(".")[1];
        let integerDisplay;
        if (isNaN(intDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = intDigits.toLocaleString('en', { maximumFractionDigits: 0 }).replace(/,/g, " ");
        };
        if (decDigits != null) {
            return integerDisplay + '.' + decDigits;
        } else {
            return integerDisplay;
        }

    }
    updateDisplay(){
        this.prevOperandElement.innerText = this.getDisplayNumber(this.previousOperand);
        if (this.operation != null) {
            this.prevOperandElement.innerText += ` ${this.operation}`;
        }
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
    }
    logObject(){
        console.log(this)
    }
    keypress(key){
        const operatorKeys = ['/','*','x','X','m','M','+','-'];
        const numberKeys = ['1','2','3','4','5','6','7','8','9','0','.'];
        const functionKeys = ['a','c','d','Enter','Backspace'];
        if (numberKeys.includes(key)) {
            calculator.appendNumber(key);
            calculator.updateDisplay();
        } else if (operatorKeys.includes(key)) {
            key === '/' ? calculator.setOperator('÷') : 
            ['*','x','X','m','M'].includes(key) ? calculator.setOperator('×') :
            calculator.setOperator(key);
            calculator.updateDisplay();
        } else if (functionKeys.includes(key)) {
            ['a','c'].includes(key) ? calculator.clear() :
            ['d', 'Backspace'].includes(key) ? calculator.deleteChar() :
            calculator.compute();
            calculator.updateDisplay();
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operation]');
const clearButton = document.querySelector('[data-clear]');
const deleteButton = document.querySelector('[data-delete]');
const calculateButton = document.querySelector('[data-calculate]');
const prevOperandElement = document.querySelector('.prev-operand');
const currentOperandElement = document.querySelector('.current-operand');
const memoryTab = document.querySelector('.memory-tab');

const calculator = new Calculator(prevOperandElement, currentOperandElement);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.setOperator(button.innerText);
        calculator.updateDisplay();
    })
})

calculateButton.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
})

clearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
})

deleteButton.addEventListener("click", () => {
    calculator.deleteChar();
    calculator.updateDisplay();
})
memoryTab.addEventListener('click', () => {
    memoryTab.parentElement.parentElement.classList.toggle('open-mem');
})

document.addEventListener("keydown", (e) => {
    calculator.keypress(e.key);
})