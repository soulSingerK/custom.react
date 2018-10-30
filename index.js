import React from './src/react'
import ReactDOM from './src/react-dom'

function Hello(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <div>{props.num}</div>
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

  componentDidMount() {
    console.log(this.props)
  }

  handleClick() {
    this.setState({ num: this.state.num + 1 })
  }
  
  render() {
    return (
      <div>
        <Hello name = "shisan" num={this.state.num}/>
        <button onClick={() => this.handleClick()}>加一</button>
      </div> 
    )  
  }
}

ReactDOM.render(<App />, document.getElementById('root'))