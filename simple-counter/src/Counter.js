import React, { Component } from 'react';

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
