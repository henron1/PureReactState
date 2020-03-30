# PureReactState

Delving into Class Based State, Hooks State, Reducers, Context, Data Fetching and Thunks.

# What are some examples of the kinds of state we use?

- Model Data: The nouns in your application
- View/UI State: Are those nouns sorted in ascending or descending order?
- Session State: Is the user even logged in?
- Communication: Are we in the process of fetching the nouns from the server?
- Location: Where are we in the application? Which nouns are we looking at?

# High Level Ways of Thinking of State:

1. Model State: This is the most likely the data in your application such as items in a list of inventory.
2. Ephemeral State: This could include things like values of input fields or things that are wiped away once you press "enter". It could also be the order in which a given list is sorted.

```javascript
class Counter extends Component {
  // pass props up to component class since we're sublcassing
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
