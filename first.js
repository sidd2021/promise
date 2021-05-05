/*
 
Following varient of Test Cases solved by MyPromise:
 1. Executor function is called immediately when new Promise object is created.
 2. Resolution handler is called when the promise is resolved (method that is passed into then)
 3. Promise Support many resolution handler
 4. resolution handler can be chained
 5. chaining works with non -promise return value.
 6. resoluion handler can be attached when promise is resolved
 7. second resolve method has no effect
 8. rejection handler is called when promise is rejected
 */

class MyPromise {
    constructor(executor) {
        // console.log("new object created");
        this._state = 'pending';
        this._value = null;
        this._rejectionReason = null;
        this._resolutionQueue = [];
        this._rejectionQueue = [];
        executor(this._resolve.bind(this), this._reject.bind(this));
    }

    _runResolutionHandler() {
        while (this._resolutionQueue.length > 0) {
            var resolution = this._resolutionQueue.shift();
            var returnValue = resolution.handler(this._value);
            if (returnValue instanceof MyPromise) {
                // console.log("returnvalue", returnValue);
                returnValue.then(function (v) {
                    // console.log("v", v);
                    resolution.promise._resolve(v);
                }).catch(function (e) {
                    resolution.promise._reject(e);
                });
            }
            else {
                resolution.promise._resolve(returnValue);
            }
        }
    }
    _runRejectionHandler() {
        while (this._rejectionQueue.length > 0) {
            var rejection = this._rejectionQueue.shift();
            var returnValue = rejection.handler(this._rejectionReason);
            if (returnValue instanceof MyPromise) {
                // console.log("returnvalue", returnValue);
                returnValue.then(function (v) {
                    // console.log("v", v);
                    rejection.promise._reject(v);
                });
            }
            else {
                rejection.promise._reject(returnValue);
            }
        }
    }
    _reject(reason) {
        if (this._state === "pending") {
            this._rejectionReason = reason;
            this._state = "rejected";
            this._runRejectionHandler();
        }
        while (this._resolutionQueue.length > 0) {
            var resolution = this._resolutionQueue.shift();
            resolution.promise._reject(this._rejectionReason);
        }
    }
    _resolve(value) {
        // console.log("resolved method called", value);
        // console.log(this._resolutionQueue.length);
        if (this._state === "pending") {
            this._value = value;
            this._state = "resolved";
            this._runResolutionHandler();
        }
    }
    then(resolutionHandler) {
        // console.log("then method called");
        var newPromise = new MyPromise(function () { });
        this._resolutionQueue.push({
            handler: resolutionHandler,
            promise: newPromise,
        });
        if (this._state === "resolved") {
            this._runResolutionHandler();
        }

        return newPromise;
    }
    catch(rejectionHandler) {
        var newPromise = new MyPromise(function () { });
        this._rejectionQueue.push({
            handler: rejectionHandler,
            promise: newPromise
        });
        if (this._state === "rejected") {
            this._runRejectionHandler();
        }
        return newPromise;
    }

}

//Test cases :-

/*
case 1: when promise is created executor function is called immediately


const p = new MyPromise(function (resolve, reject) {
    console.log("Hello");
});


const p1 = new Promise(function (resolve, reject) {
    console.log("Hello");
});


output:-
  Mypromise output:- Hello
  Promise output:- Hello
*/









//case 2: simple resolve reject promise based on condition

/*
const p = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        if (Math.random() > 0.5) {
            resolve("Sucess");
        }
        else {
            reject("Failure");
        }
    }, 0);
});
p.then(response => console.log(response)).catch(err => console.log(err))


const p1 = new Promise(function (resolve, reject) {
    if (Math.random() > 0.5) {
        resolve("Sucess");
    }
    else {
        reject("failure");
    }
});

p1.then(response => console.log(response)).catch(err => console.log(err))


output:-
description :- based on the random value generated by the random function
               resolve or reject promise is called
  Mypromise output:-
  Promise output:-
*/











/*
case 3 : promise chaining with all resolve promise handling scenrios

const p = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve("Hello");
    }, 100);
});
p.then(function (response) {
    return new MyPromise(function (resolve, reject) {
        resolve(response + "how are you");
    });
}).then(response => console.log(response));



const p1 = new Promise(function (resolve, reject) {
    resolve("Hello");
});

p1.then(function (response) {
    return new Promise(function (resolve, reject) {
        resolve(response + "how are you");
    });
}).then(response => console.log(response));


output:-
  Mypromise output:- Hello How Are You
  Promise output:-Hello How Are You
*/









/*
case 4: second resolve method is not cause any effect

const p = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve("Hello");
        resolve("How Are you");
    }, 100);
});
p.then(response => console.log(response));


const p1 = new Promise(function (resolve, reject) {
    resolve("Hello");
    resolve("Hoe Are you");
});
p1.then(response => console.log(response));



output:-
  Mypromise output:- Hello
  Promise output:-  Hello

*/








/*

case 5: rejected promise and catch handling

const p = new MyPromise(function (resolve, reject) {
    setTimeout(function () {
        reject("fail 1")
    }, 100);
});
p.catch(response => console.log(response));


const p1 = new Promise(function (resolve, reject) {
    reject("fail 2");
});
p1.catch(response => console.log(response));


output:-
  Mypromise output:- fail 1
  Promise output:- fail 2
*/


