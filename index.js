import React from './src/react'
import ReactDOM from './src/react-dom'

function Hello(props) {
  return (
    <h1>{props.name}</h1>
  )
}

class App extends React.Component {
  
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props)
  }
  
  render() {
    return <Hello name = "shisan"/>
  }
}

ReactDOM.render(<App name="shisan"/>, document.getElementById('root'))