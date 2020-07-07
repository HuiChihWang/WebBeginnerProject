class MoneyRecord {
    constructor(type, description, amount) {
        this.type = type;
        this.description = description;
        this.amount = amount;
        this.isValid = this.isRecordValid();
        this.ratio = 0.;
    }

    calculateRatio(totalIncome) {
        if (this.type === 'expenses') {
            this.ratio = this.amount / totalIncome;
        }
    }

    isRecordValid() {
        if (this.type != 'income' && this.type != 'expenses') {
            return false;
        }

        if (this.description === '') {
            return false;
        }

        if (isNaN(this.amount) || this.amount <= 0) {
            return false;
        }

        return true;
    }
}

class BudgetController {
    constructor() {
        this.clear();
    }

    clear() {
        this.incomeList = [];
        this.expenseList = [];
        this.totalExpense = 0;
        this.totalIncome = 0;
        this.totalBudget = 0;
    }

    updateExpenseRatio() {
        this.expenseList.forEach(item => {
            item.calculateRatio(this.totalIncome);
        })
    }

    updateBudget() {
        this.totalBudget = this.totalIncome - this.totalExpense;
    }

    addMoneyRecord(record) {
        if (record.type === 'income') {
            this.incomeList.push(record);
            this.totalIncome += record.amount;
            this.updateExpenseRatio();
        }
        else if (record.type === 'expenses') {
            record.calculateRatio(this.totalIncome);
            this.expenseList.push(record);
            this.totalExpense += record.amount;
        }

        this.updateBudget();
    }

    removeMoneyRecord(type, index) {
        if (type === 'income') {
            let item = this.incomeList.splice(index, 1)[0];
            this.totalIncome -= item.amount;
            this.updateExpenseRatio();
        }
        else if (type === 'expenses') {
            let item = this.expenseList.splice(index, 1)[0];
            this.totalExpense -= item.amount;
        }

        this.updateBudget();
    }

    get expenseRatio() {
        // TODO: fix divide 0 problem
        return this.totalExpense / this.totalIncome;
    }
}
class ViewController {
    constructor() {
        this.addTypeElement = document.querySelector('.add__type');
        this.addValueElement = document.querySelector('.add__value');
        this.addDescriptionElement = document.querySelector('.add__description');
        this.expenseElement = document.querySelector('.budget__expenses--value');
        this.expenseRatioElement = document.querySelector('.budget__expenses--percentage');
        this.incomeElement = document.querySelector('.budget__income--value');
        this.budgetElement = document.querySelector('.budget__value');
    }

    init() {
        this.incomeItem = [];
        this.expenseItem = [];
        this.budgetElement.textContent = '0';
        this.expenseRatioElement.textContent = '0%';
        this.incomeElement.textContent = '0';
        this.expenseElement.textContent = '0';
    }

    parseItemInput() {
        let addType = this.addTypeElement.value;
        addType = this.convertRecordType(addType);

        let description = this.addDescriptionElement.value;
        let amount = Number(this.addValueElement.value);

        return new MoneyRecord(addType, description, amount);
    }

    convertRecordType(type) {
        if (type === 'inc') {
            return 'income';
        } else if (type === 'exp') {
            return 'expenses';
        }
        else {
            return 'none';
        }
    }

    convertRatio(ratio) {
        return (ratio * 100).toFixed(1) + '%';
    }

    clearInputItem() {
        this.addValueElement.value = '';
        this.addDescriptionElement.value = '';
    }

    createNewItem() {
        document.createElement()
    }

    updateItemList(record) {
        let newItem = document.createElement('div');
        newItem.setAttribute('class', 'item clearfix');

        let description = document.createElement('div');
        description.setAttribute('class', 'item__description');
        description.textContent = record.description;
        newItem.appendChild(description);

        let valueDiv = document.createElement('div');
        valueDiv.setAttribute('class', 'right clearfix');

        let value = document.createElement('div');
        value.setAttribute('class', 'item__value');


        if (record.type === 'income') {
            newItem.setAttribute('id', record.type + '-' + this.incomeItem.length);
            value.textContent = '+ ' + record.amount;
            this.incomeItem.push(newItem);
        }
        else if (record.type === 'expenses') {
            newItem.setAttribute('id', record.type + '-' + this.expenseItem.length);
            value.textContent = '- ' + record.amount;
            this.expenseItem.push(newItem);
        }

        valueDiv.appendChild(value);
        if (record.type === 'expenses') {
            let ratioDiv = document.createElement('div');
            ratioDiv.setAttribute('class', 'item__percentage');
            ratioDiv.textContent = this.convertRatio(record.ratio);
            valueDiv.appendChild(ratioDiv);
        }

        valueDiv.appendChild(this.createDeleteButton());
        newItem.appendChild(valueDiv);

        let itemList = document.querySelector('.' + record.type + '__list');
        itemList.appendChild(newItem);

        return newItem;
    }

    createDeleteButton() {
        let deleteDiv = document.createElement('div');
        deleteDiv.setAttribute('class', 'item__delete');

        let deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'item__delete--btn');

        let deleteButtonIn = document.createElement('i');
        deleteButtonIn.setAttribute('class', 'ion-ios-close-outline');

        deleteButton.appendChild(deleteButtonIn);
        deleteDiv.appendChild(deleteButton);

        return deleteDiv;
    }

    updateExpense(totalExpense) {
        this.expenseElement.textContent = totalExpense;
    }

    updateExpenseRatio(expenseRatio) {
        this.expenseRatioElement.textContent = this.convertRatio(expenseRatio);
    }

    updateIncome(totaIncome) {
        this.incomeElement.textContent = totaIncome;
    }

    updateBudget(totalBudget) {
        let prefix = '';
        if (totalBudget > 0) {
            prefix = '+';
        }
        else if (totalBudget < 0) {
            prefix = '-';
        }
        this.budgetElement.textContent = prefix + totalBudget;
    }

    updateAllExpenseRatio(expenseList) {
        this.expenseItem.forEach((item, index) => {
            let itemDiv = item.querySelector('.item__percentage');
            itemDiv.textContent = this.convertRatio(expenseList[index].ratio);
        })
    }

    //TODO: remove item from UI (array splice problem)
    removeItem(type, removeIndex){
        let targetList;
        if (type == 'income') {
            targetList = this.incomeItem;
        }
        else if (type == 'expenses') {
            targetList = this.expenseItem;
        }

        let removeItem = targetList.splice(removeIndex, 1)[0];
        removeItem.remove();

        targetList.forEach((item, index)=>{
            if (index >= removeIndex) {
                item.id = type + '-' + index;
            }
        });

    }

    updateMainBoardInfo(totalBudget, totalIncome, totalExpense, totalExpenseRatio) {
        this.updateBudget(totalBudget);
        this.updateIncome(totalIncome);
        this.updateExpense(totalExpense);
        this.updateExpenseRatio(totalExpenseRatio);
    }
}

class EventHandler {
    constructor(budgetController, viewController) {
        this.budgetController = budgetController;
        this.viewController = viewController;
    }

    clickAddItem() {
        let addButton = document.querySelector('.add__btn');
        addButton.addEventListener('click', (event) => {
            let record = this.viewController.parseItemInput();
            if (record.isValid) {
                // add record to backend
                this.budgetController.addMoneyRecord(record);

                this.viewController.clearInputItem();
                let item = this.viewController.updateItemList(record);
                this.viewController.updateAllExpenseRatio(this.budgetController.expenseList);
                this.addRemoveButtonEvent(item);

                this.viewController.updateMainBoardInfo(
                    this.budgetController.totalBudget,
                    this.budgetController.totalIncome,
                    this.budgetController.totalExpense,
                    this.budgetController.expenseRatio
                );
            }
        })
    }

    //TODO: define remove button action
    addRemoveButtonEvent(item) {
        let removeButton = item.querySelector('.item__delete--btn');
        removeButton.addEventListener('click', (event) => {
            //parse item id to get type and index
            let parser = item.id.split('-');
            let type = parser[0];
            let removeIndex = parser[1];

            // update budget controller
            this.budgetController.removeMoneyRecord(type, removeIndex);

            // update view & element id
            this.viewController.removeItem(type, removeIndex);
            this.viewController.updateMainBoardInfo(
                this.budgetController.totalBudget,
                this.budgetController.totalIncome,
                this.budgetController.totalExpense,
                this.budgetController.expenseRatio
            );
        });
    }
}

let moneyRecrds = new BudgetController();
let view = new ViewController();
let eventProcessor = new EventHandler(moneyRecrds, view);

view.init();
moneyRecrds.clear();


eventProcessor.clickAddItem();
remove = document.getElementById('expense-1');



