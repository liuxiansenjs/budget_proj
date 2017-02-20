// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        testing: function() {
            return data;
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
        expensesContainer: '.expenses__list'
    }
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value:  document.querySelector(DOMStrings.inputValue).value
            }    
        },
        addListItem: function(obj, type) {
            var html,newhtml,element;
            // Create
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else {
                console.log('Error')
            }
            
            
            // Replace
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%', obj.value)
            
            // Insert
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
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
            if (event.keyCode === 13 || event.which === 13) {
                console.log('Enter is pressed');
                ctrlAddItem();
            }
        });
    };
    
    var DOM = UICtrl.getDOMStrings();
            
    var ctrlAddItem = function() {
        var input, newItem;
        // Get the filled input data
        input = UICtrl.getInput();
        
        // Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // Calculate the budget
        
        
        // Display the budget on the UI
        
        
    }
    
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
        
    };   
}(budgetController, UIController));

controller.init();













