// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur, index, array) {
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // Create ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create item
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else {
                console.log('Error');
            }
            // push it into data
            data.allItems[type].push(newItem);
            // return
            return newItem;
            
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(cur) {
                return cur.id;
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            budgetController.calculateBudget();
        },
        calculateBudget : function() {
            //calc total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calc income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calc %
            
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc *100);
            } else {
                data.percentage = NaN;
            }
        },
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function() {
            console.log(data);
        }
    }
 
    
}());

// UI CONTROLLER
var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dataLabel: '.budget__title--month'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value:  parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }    
        },
        addListItem: function(obj, type) {
            var html,newhtml,element;
            // Create
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                console.log('Error');
            }
            
            
            // Replace
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value)
            
            // Insert
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
        },
        
        deleateListItem: function(selectorID) {
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        
        clearFields: function() {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[1].focus();
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).style.visibility = 'visible';
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).style.visibility = 'hidden';
            }
            
        },
        displayPercentages: function(perc) {
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i],i);
                }
            }
            nodeListForEach(fields, function(cur, i) {
                if (perc[i] > 0) {
                    cur.textContent = perc[i] + '%';
                } else {
                    cur.textContent = '';
                }                
            });
            
        },
        displayMonth: function() {
            var now = new Date();
            var year = now.getFullYear();
            document.querySelector(DOMStrings.dataLabel).tabIndex = year;
        },
        
        getDOMStrings: function(){
            return DOMStrings;
        }
    }
}());

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function() {
        document.querySelector(DOM.inputBtn).addEventListener('click', function() {
            console.log('button is clicked');
            ctrlAddItem();
        });
    
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                console.log('Enter is pressed');
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };
    
    var DOM = UICtrl.getDOMStrings();
    
    var updateBudget = function() {
        budgetCtrl.calculateBudget();
        
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        UICtrl.displayBudget(budget);
        return budget;
    }
    
    var updatePercentages = function() {
        budgetCtrl.calculatePercentage();
        var percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    };
            
    var ctrlAddItem = function() {
        var input, newItem;
        // Get the filled input data
        input = UICtrl.getInput();
        
        // Add the item to the budget controller
        if (!isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
         
            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            UICtrl.clearFields();
            // Calculate the budget
            updateBudget();

            // Display the budget on the UI
            updatePercentages();

        }
        
    }
    
    var ctrlDeleteItem = function(e) {
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleateListItem(itemID);
            
            // 3. Update new budget
            updateBudget();
        }
        
    }
    
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
        
    };   
}(budgetController, UIController));

controller.init();













