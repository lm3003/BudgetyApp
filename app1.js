//Creating a module budgetController, UIController, AppController using IIFE's and closures

//Budget Controoler
var budgetController=(function(){
    //Expense constructor
    var Expense = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
    
    //Income Constructor
    var Income = function(id, description, value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
        
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
           sum += curr.value; 
        });
        data.totals[type] = sum;
    };
    return{
        addItem: function(type, des, val){
            var newItem, ID;
            
            //create new id (last id +1)
            if(data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }else{
                ID=0;
            }
            
            
            //create new item based on inc or exp type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }
            
            //push it into our data structure            
            data.allItems[type].push(newItem);
            
            //return the new element
            return newItem; 
        },
        calculateBudget: function(){
            //Calculate the total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');
            
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate the % of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
            
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        test: function(){
            console.log(data);
        }
        
    }
})();


//UI Controller
var UIController=(function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        deleteLabel: '.item__delete--btn'
    }
    return{
        getInput: function(){
        return{
            type: document.querySelector(DOMStrings.inputType).value,   //Will be either inc or exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value) 
            };        
        },
        getDOMStrings: function(){
                return DOMStrings;
        },
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%des%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if (type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%des%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
            }
            
            //Replace place holder text with some actual data
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            //Insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
        },
        clearFields: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(curr, i, array){
                curr.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 0){
               document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+ '%'; 
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        getDeletedEntryID : function(){
            var id;
            id = document.querySelector(DOMStrings.)
            return   
        },
        deleteEntry: function(){
            
        }
    };
})();

//App Controller
var controller=(function(budgetCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click' , controlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){
                controlAddItem();
        }
        document.querySelector(DOM.deleteLabel).addEventListener('click' , removeEntry);
    });
}
    var updateBudget = function(){
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        //2. Return the budget
        var budget= budgetCtrl.getBudget();
        
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    } 
    var controlAddItem = function(){
        var input, newItem;
         //1. Get the field input data
        input = UICtrl.getInput();
        
        if( input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //3. Add the item to the UI
            UICtrl.addListItem(newItem , input.type);
        
            //4. Clear the fields
            UICtrl.clearFields();
        
            //4. Calculate and update the budget
            updateBudget();
            
        }
        
    }
    var removeEntry = function(){
        var id;
        //get input from the UI about the income or expense id which is deleted
        id = getDeletedEntryID();
        //Remove entry from the UI
        
        
        //Update the income
    }
    return{
        init: function(){
            console.log("Application Starting now");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController,UIController);

controller.init();