# PureReactState (In Development)

Delving into Class Based State, Hooks State, Reducers, Context, Data Fetching and Thunks.

# What are some examples of the kinds of state we use?

- Model Data: The nouns in your application
- View/UI State: Are those nouns sorted in ascending or descending order?
- Session State: Is the user even logged in?
- Communication: Are we in the process of fetching the nouns from the server?
- Location: Where are we in the application? Which nouns are we looking at?

## High Level Ways of Thinking of State:

1. Model State: This is the most likely the data in your application such as items in a list of inventory.
2. Ephemeral State: This could include things like values of input fields or things that are wiped away once you press "enter". It could also be the order in which a given list is sorted.

## setState: Understanding the basics

```javascript
class Counter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0,
		};

		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
		this.reset = this.reset.bind(this);
	}

	increment() {
		this.setState({ count: this.state.count + 1 });
	}

	decrement() {
		this.setState({ count: this.state.count - 1 });
	}

	reset() {
		this.setState({ count: 0 });
	}

	render() {
		const { count } = this.state;
		return (
			<div className="Counter">
				<p className="count">{count}</p>
				<section className="controls">
					<button onClick={this.increment}>Increment</button>
					<button onClick={this.decrement}>Decrement</button>
					<button onClick={this.reset}>Reset</button>
				</section>
			</div>
		);
	}
}
```

Here we have a react counter found in simple-counter that is incrementing, decrementing and reseting our count in state.
I'm assuming you have a basic knowledge of Javascript and React so I don't have to break the above snippet down too much)

### What are we doing?

1. Initialize a class component and passing props to the component class
2. Setting an initial state of 0
3. Binding _this_ to our three methods (otherwise we would get the classic "Cannot read property setState of undefined")
4. Building out our methods and updating state
5. Rendering our counter

Now what if we were to write

```javascript
increment() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  }
```

What will our count be?
Answer: 0

You were probably thinking 3, but this.setState() is asynchronous.
It acts like this becaues we don't want to stop the world and redender the DOM every time setState is called.
Instead, the function runs to completion and then React can figure out what changes need to be made to the DOM.

Now what if we write the same code? (minus the log)

```javascript
increment() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  }
```

What will the count on the screen be now after the program has run and the DOM has updated?
Answer: 1

The reason for this is that now we're queueing up state changes. We've told React "0 + 1" _three times_ and tries to collect all of the things in the object. This will be different when we get to hooks because there are no objects per se.

What's happening above when we call this.setState() we give it an object, that has the key of count and the value of what the new count should be and it merges all of those objects together. Here's an example below:

```javascript
Object.assign(
	{},
	firstCallToSetState,
	secondCallToSetState,
	thirdCallToSetSTate
);
```

IF there are DUPLICATE keys, shown in the example below, the last key wins and the count would be 3.

```javascript
increment() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 3 });
  }
```

MAIN TAKEAWAY -> Avoid unnesecary rerenders.

We're not quite done with setState() just yet! We've passed in objects, and now we're going to pass in a function.
Let's take the example above and instead of passing in the same object 3 times, let's call the same anonymous funciton 3 times.

```javascript
increment() {
    this.setState((state) => { count: this.state.count + 1 });
    this.setState((state) => { count: this.state.count + 1 });
    this.setState((state) => { count: this.state.count + 1 });
  }
```

What will the counter be incremented to after using this syntax?
Answer: 3

The reason why is because in Javascript we can merge objects, but not functions (before you yell at me we're not getting into composition).

Why is this so useful? See the example below:

If you wanted to test the component, you would only need to write a simple unit test rather than getting into jest or enzyme and mounting the component and passing in props etc when all we want to test is "does this funciton work".

```javascript
const inc = (state, props) => {
	const { max, step } = props;
	if (state.count >= max) return;
	return { count: state.count + step };
};

...

increment() {
    this.setState(inc)
}

```

This is also key if your application is growing and becomes more and more complex. You can simply reuse the same function in multiple places.

One last thing to cover about setState is the second argument it takes in which is the callback. This happens after the state has been updated.

Let's say we want to keep track of our count in localstorage to persist our data each time we log in to our app. This isn't the best practice of dealing with localstorage, but it suits our current need.

```javascript
const getLocalStorage = () => {
  const storage = localStorage.getItem('localCounter');
  if (storage) return JSON.parse(storage);
  return { count: 0 };
};

...

increment = () => {
	this.setState(
		(state, props) => {
			const { max, step } = props;
			if (state.count >= max) return;
			return { count: state.count + step };
		},
		() => {
			localStorage.setItem("localCounter", JSON.stringify(this.state));
		}
	);
};
```

Now we're updating localstorage within the context of setState by using the second callback parameter.

## Top React patterns and anti-patterns to practice when managing state:

1. When working with props, we have PropTypes. State does not have those safegaurds.
2. What should be kept in state?
   - Anything that you can't calculate from props
   - Anything you aren't using in the render method
3. Don't use state to derive props
   ```javascript
   WRONG;
   this.state = {
   	fullName: props.firstName + " " + props.lastName,
   };
   WRONG;
   ```
   Instead you could do the following destructure:
   ```javascript
   render() {
       const { firstName, lastName } = this.props;
       const fullName = firstName + ' ' + lastName;
       return (
           <h1>{fullName}</h1>
       )
   }
   ```
4. Don't shove all of your logic into a render. You can break it out into another function:

   ```javascript
   const renderCustomerProfile = customer => {
       return (
           <CustomerProfile key ={customer.id} photo{customer.avatar} />
       )
   }

   const CustomerList = ({customers}) => {
       return (
           {customers.map(renderCustomerProfile)}
       )
   }
   ```

5. Don't use state for things you're not going to render!! (Look to lifecycle methods)

Get Ready for HOOKS!!!

## Hooks State

# Refactoring our old code

So now that we have a solid understanding of how setState works inside of a class component, let's take a look at how Hooks work. First we're going to refactor our class into a function called Counter and delete the constructor as well as all of our old logic except what was inside of our old render.

```javascript
const Counter = ({ max, step }) => {
	const count = ([count, setCount] = React.useState(0));
	return (
		<div className="Counter">
			<p className="count">{count}</p>
			<section className="controls">
				<button onClick={this.increment}>Increment</button>
				<button onClick={this.decrement}>Decrement</button>
				<button onClick={this.reset}>Reset</button>
			</section>
		</div>
	);
};

export default Counter;
```
