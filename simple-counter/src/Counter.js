import React, { Component } from 'react';

const increment = (state, props) => {
  const { max, step } = props;
  if (state.count >= max) return;
  return { count: state.count + step };
};

const getLocalStorage = () => {
  const storage = localStorage.getItem('localCounter');
  if (storage) return JSON.parse(storage);
  return { count: 0 };
};

class Counter extends Component {
  // pass props up to component class since we're sublcassing
  constructor(props) {
    super(props);
    this.state = getLocalStorage();
  }

  // increment() {
  //   this.setState(increment);
  // }

  increment = () => {
    this.setState(
      (state, props) => {
        const { max, step } = props;
        if (state.count >= max) return;
        return { count: state.count + step };
      },
      () => {
        localStorage.setItem('localCounter', JSON.stringify(this.state));
      },
    );
  };

  decrement = () => {
    this.setState({ count: this.state.count - 1 });
  };

  reset = () => {
    this.setState({ count: 0 });
  };

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

export default Counter;
