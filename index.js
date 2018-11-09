import React from './src/react/react.shisan'
import ReactDOM from './src/react-dom/react-dom.shisan'

function Example() {
  return (
    <div className="style" style={{color: 'red'}}>
      hello
      <span className="inner">这就是</span>
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1
    }
  }

  handleClick() {
    this.setState({ num: this.state.num + 1 })
  }

  render() {
    return (
      <div>
        <h3>react</h3>
        <Example></Example>
        <h5>{this.state.num}</h5>
        <button onClick={() => this.handleClick()}>add</button>
      </div>
    )
  }
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
)